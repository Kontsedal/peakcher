import { configureStore } from "@reduxjs/toolkit";
import { slice } from "./slice";
import { EventsService } from "../services/Events";

const EVENTS = {
  DISPATCH_EVENT: "DISPATCH_EVENT",
  GET_STATE: "GET_STATE",
};

export const getStore = (isBackground: boolean) => {
  const currentSenderId = Math.floor(Math.random() * 10000);
  const populateAction = () => (next) => (action) => {
    if (!action.isSyncAction && action.type !== slice.actions.setState.type) {
      EventsService.emit({
        type: EVENTS.DISPATCH_EVENT,
        payload: { action, senderId: currentSenderId },
      });
    }
    next(action);
  };

  const store = configureStore({
    reducer: slice.reducer,
    middleware: [populateAction],
  });
  EventsService.on<{
    senderId: number;
    action: { type: string; payload: any };
  }>(EVENTS.DISPATCH_EVENT, (event) => {
    if (event.senderId === currentSenderId) {
      return;
    }
    const action = { ...event.action, isSyncAction: true };
    store.dispatch(action);
  });

  if (isBackground) {
    EventsService.on(EVENTS.GET_STATE, (message, sender, respond) => {
      respond(store.getState());
    });
  } else {
    EventsService.emit({ type: EVENTS.GET_STATE }, (newState) =>
      store.dispatch(slice.actions.setState(newState))
    );
  }
  return store;
};

export type RootState = ReturnType<typeof slice.reducer>;
export const { actions } = slice;

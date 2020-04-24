import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import compact from "lodash/compact";
import { slice } from "./slice";
import { EventsService } from "../services/Events";
import { BackgroundService } from "../services/Background";

const EVENTS = {
  DISPATCH_EVENT: "DISPATCH_EVENT",
  GET_STATE: "GET_STATE",
};

const populateActionsMiddleware = () => (next) => (action) => {
  EventsService.emit({
    type: EVENTS.DISPATCH_EVENT,
    payload: action,
  });
  next(action);
};

export const getStore = (isBackground: boolean) => {
  const middleware = compact([
    isBackground && populateActionsMiddleware,
    IS_DEV && createLogger(),
  ]);

  const store = configureStore({
    reducer: slice.reducer,
    middleware,
  });

  if (isBackground) {
    EventsService.on(EVENTS.GET_STATE, (message, sender, respond) => {
      respond(store.getState());
    });
    return store;
  }

  const originalDispatch = store.dispatch;
  store.dispatch = <T>(action): T => {
    BackgroundService.safeDispatch(action);
    // eslint-disable-next-line no-useless-return
    return;
  };
  EventsService.on(EVENTS.DISPATCH_EVENT, (remoteAction: PayloadAction) => {
    originalDispatch(remoteAction);
  });
  EventsService.emit({ type: EVENTS.GET_STATE }, (newState) =>
    originalDispatch(slice.actions.setState(newState))
  );
  return store;
};

export type RootState = ReturnType<typeof slice.reducer>;
export const { actions } = slice;

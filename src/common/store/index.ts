import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import compact from "lodash/compact";
import { slice } from "./slice";
import { EventsService } from "../services/Events";
import { CommunicationService } from "../services/Communication";

const EVENTS = {
  DISPATCH: "DISPATCH",
  GET_STATE: "GET_STATE",
};

const populateActionsMiddleware = () => (next) => (action) => {
  CommunicationService.dispatch(action);
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
    CommunicationService.onGetState((respond) => {
      respond(store.getState());
    });
    return store;
  }

  const originalDispatch = store.dispatch;
  store.dispatch = <T>(action): T => {
    CommunicationService.safeDispatch(action);
    // eslint-disable-next-line no-useless-return
    return;
  };
  CommunicationService.onDispatch((action) => {
    originalDispatch(action);
  });
  CommunicationService.getState((newState) =>
    originalDispatch(slice.actions.setState(newState))
  );
  return store;
};

export type RootState = ReturnType<typeof slice.reducer>;
export const actions = {
  setIsAuthorized: slice.actions.setIsAuthorized,
  addFile: slice.actions.addFile,
  setSettingValue: slice.actions.setSettingValue,
  deleteFile: slice.actions.deleteFile,
  deleteTag: slice.actions.deleteTag,
  setRemoteSpaceInfo: slice.actions.setRemoteSpaceInfo,
  logOut: slice.actions.logOut,
  addFileTag: slice.actions.addFileTag,
  removeFileTag: slice.actions.removeFileTag,
  setState: slice.actions.setState,
  setRemoteState: slice.actions.setRemoteState,
  setUploadFileStatus: slice.actions.setUploadFileStatus,
  removeUploadFileStatus: slice.actions.removeUploadFileStatus,
};

import { configureStore, Store } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import compact from "lodash/compact";
import { slice } from "./slice";
import { CommunicationService } from "../services/Communication";

const populateActionsMiddleware = () => (next) => (action) => {
  CommunicationService.dispatch(action);
  next(action);
};

export const getStore = (isBackground: boolean): Store<RootState> => {
  const middleware = compact([
    isBackground && populateActionsMiddleware,
    IS_DEV && createLogger({ diff: true }),
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
  if (!isBackground) {
    if (window.parent) {
      store.subscribe(() => {
        window.parent.postMessage(
          { type: "peakcherSettings", payload: store.getState().settings },
          "*"
        );
      });
    }
  }
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
  cleanUploadStatus: slice.actions.cleanUploadStatus,
  incrementUsedTimes: slice.actions.incrementUsedTimes,
};

import { Store } from "redux";
import { BackgroundService } from "../../common/services/Background";
import { AppService } from "../services/App";
import { RootState } from "../../common/store";

export const initEventListeners = (
  appService: AppService,
  store: Store<RootState>
) => {
  BackgroundService.onAuthenticate(({ code, tabId }): void => {
    appService
      .authenticate({ code, tabId })
      .catch((error) => console.error("Failed to authenticate", error));
  });

  BackgroundService.onUploadFile(({ files, notifyUser }): void => {
    appService
      .uploadFiles({ files, notifyUser })
      .catch((error) => console.error("Failed to upload files", error));
  });

  BackgroundService.onSaveDispatch(async (action) => {
    // await appService.checkStateRelevance();
    store.dispatch(action);
  });
};

import { Store } from "redux";
import { CommunicationService } from "../../common/services/Communication";
import { AppService } from "../services/App";
import { RootState } from "../../common/store";

export const initEventListeners = (
  appService: AppService,
  store: Store<RootState>
): void => {
  CommunicationService.onAuthenticate(({ code, tabId }): void => {
    appService
      .authenticate({ code, tabId })
      .catch((error) => console.error("Failed to authenticate", error));
  });

  CommunicationService.onUploadFile(({ files, notifyUser }): void => {
    appService
      .uploadFiles({ files, notifyUser })
      .catch((error) => console.error("Failed to upload files", error));
  });

  CommunicationService.onSaveDispatch(async (action) => {
    await appService.checkStateRelevance();
    store.dispatch(action);
  });

  chrome.browserAction.onClicked.addListener((tab) => {
    CommunicationService.injectView(
      {
        url: `${window.location.origin}/popup.html`,
      },
      tab.id
    );
  });
};

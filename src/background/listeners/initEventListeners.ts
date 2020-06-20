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

  CommunicationService.onUploadFiles(({ files, notifyUser }): void => {
    appService
      .uploadFiles({ files, notifyUser })
      .catch((error) => console.error("Failed to upload files", error));
  });

  CommunicationService.onSaveDispatch(async (action) => {
    await appService.checkStateRelevance();
    store.dispatch(action);
  });

  chrome.browserAction.onClicked.addListener((tab) => {
    const scriptsToInject = [
      "/vendors_background_popup_viewInjector.bundle.js",
      "/background_popup_viewInjector.bundle.js",
      "/viewInjector.js",
    ];
    function injectNext() {
      let scriptSrc = scriptsToInject.shift();
      console.log("inject " + scriptSrc);
      if (!scriptSrc) {
        return;
      }
      chrome.tabs.executeScript(
        null,
        {
          file: scriptSrc,
        },
        injectNext
      );
    }
    injectNext();
  });
};

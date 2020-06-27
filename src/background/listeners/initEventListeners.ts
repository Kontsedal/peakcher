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

  CommunicationService.onDeleteFile(({ fileId, force }, sender, respond) => {
    appService
      .deleteFile({ fileId, force }, respond)
      .catch((error) => console.error("Failed to delete file", error));
  });

  chrome.browserAction.onClicked.addListener(() => {
    const scriptsToInject = ["/viewInjector.js"];
    function injectNext() {
      let scriptSrc = scriptsToInject.shift();
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

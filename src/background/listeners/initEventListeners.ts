import { Store } from "redux";
import { CommunicationService } from "../../common/services/Communication";
import { AppService } from "../services/App";
import { actions, RootState } from "../../common/store";
import { injectScripts } from "../../utils/activeTab";
import { AuthTable } from "../../common/database/AuthTable";

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

  CommunicationService.onLogOut(async () => {
    await new AuthTable().setAuthToken(null);
    store.dispatch(actions.logOut());
  });

  chrome.browserAction.onClicked.addListener((data) => {
    let isServicePage = !/^https?/.test(data.url);
    if (isServicePage) {
      return window.open(chrome.extension.getURL("popup.html"));
    }
    injectScripts([{ file: "/viewInjector.js" }]);
  });
};

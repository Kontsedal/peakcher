import { Store } from "redux";
import { injectScripts } from "utils/activeTab";
import { AuthTable } from "common/database/AuthTable";
import { Logger } from "common/services/Logger";
import { CommunicationService } from "common/services/Communication";
import { actions, RootState } from "common/store";
import { AppService } from "../services/App";

export const initEventListeners = (
  appService: AppService,
  store: Store<RootState>
): void => {
  CommunicationService.onAuthenticate(
    async ({ code, tabId }): Promise<void> => {
      try {
        await appService.authenticate({ code, tabId });
      } catch (error) {
        Logger.error("Failed to authenticate", error);
      }
    }
  );

  CommunicationService.onUploadFiles(
    async ({ files, notifyUser }): Promise<void> => {
      try {
        await appService.uploadFiles({ files, notifyUser });
      } catch (error) {
        Logger.error("Failed to upload files", error);
      }
    }
  );

  CommunicationService.onSaveDispatch(
    async (action): Promise<void> => {
      try {
        await appService.checkStateRelevance();
        store.dispatch(action);
      } catch (error) {
        Logger.error("Failed to perform safe dispatch", error);
      }
    }
  );

  CommunicationService.onDeleteFile(
    async ({ fileId, force }, sender, respond): Promise<void> => {
      try {
        await appService.deleteFile({ fileId, force }, respond);
      } catch (error) {
        Logger.error("Failed to delete file", error);
      }
    }
  );

  CommunicationService.onLogOut(async () => {
    try {
      await new AuthTable().setAuthToken(null);
      store.dispatch(actions.logOut());
    } catch (error) {
      Logger.error("Log out failed", error);
    }
  });

  chrome.browserAction.onClicked.addListener((data): void => {
    const isServicePage = !/^https?/.test(data.url);
    if (isServicePage) {
      window.open(chrome.extension.getURL("popup.html"));
      return;
    }
    injectScripts([{ file: "/viewInjector.js" }]);
  });
};

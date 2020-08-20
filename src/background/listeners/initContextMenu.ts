import { Store } from "redux";
import { RootState } from "common/store";
import { injectScripts } from "utils/activeTab";
import { I18n } from "common/services/I18n";
import { Logger } from "../../common/services/Logger";

let contextMenuWasAdded = false;
const menuId = "send_to_peakcher";

export const initContextMenu = (store: Store<RootState>): void => {
  const state = store.getState();
  const unsubscribe = store.subscribe(() => {
    unsubscribe();
    initContextMenu(store);
  });
  if (state.isAuthorized && !contextMenuWasAdded) {
    chrome.contextMenus.create(
      {
        title: I18n.t("contextMenuSaveAction"),
        id: menuId,
        contexts: ["image"],
        onclick: async (image) => {
          injectScripts([
            { code: `window.peakcherImageToUpload = "${image.srcUrl}"` },
            { file: "imageExtractor.js" },
          ]);
        },
      },
      () => {
        Logger.error(
          "Create context menu action error",
          chrome.runtime.lastError
        );
      }
    );
    contextMenuWasAdded = true;
  }

  if (!state.isAuthorized && contextMenuWasAdded) {
    chrome.contextMenus.remove(menuId, () => {
      Logger.error(
        "Remove context menu action error",
        chrome.runtime.lastError
      );
    });
    contextMenuWasAdded = false;
  }
};

import { Logger } from "common/services/Logger";
import { getStore } from "common/store";
import { AppService } from "./services/App";
import { CONFIG } from "../config";
import { initEventListeners } from "./listeners/initEventListeners";
import { initStoreListeners } from "./listeners/initStoreListeners";
import { initContextMenu } from "./listeners/initContextMenu";

export const main = async (): Promise<void> => {
  const store = getStore(true);
  const appService = new AppService(store);
  await appService.init();
  initEventListeners(appService, store);
  initStoreListeners(appService, store);
  initContextMenu(store);
  tryToLoadState(appService).catch();
  tryToLoadUsedSpace(appService).catch();
};

async function tryToLoadState(appService) {
  try {
    await appService.loadRemoteState();
  } catch (e) {
    Logger.info("Failed to load remote state on start");
    setTimeout(() => {
      if (appService.canAuthorize()) {
        tryToLoadState(appService);
      }
    }, CONFIG.OFFLINE_RETRY_TIMEOUT);
  }
}

async function tryToLoadUsedSpace(appService) {
  try {
    await appService.refreshUsedSpace();
  } catch (e) {
    Logger.info("Failed to load free space info on start");
    setTimeout(() => {
      if (appService.canAuthorize()) {
        tryToLoadUsedSpace(appService);
      }
    }, CONFIG.OFFLINE_RETRY_TIMEOUT);
  }
}

import { AppService } from "background/services/App";
import { RootState } from "common/store";
import { Store } from "redux";
import { Logger } from "../../common/services/Logger";

export const initStoreListeners = (
  appService: AppService,
  store: Store<RootState>
): void => {
  store.subscribe(async () => {
    const state = store.getState();
    try {
      await appService.uploadStateToRemote(state);
    } catch (error) {
      Logger.error("Failed to upload state to remote", error);
    }
  });
};

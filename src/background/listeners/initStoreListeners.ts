import { CommunicationService } from "common/services/Communication";
import { AppService } from "background/services/App";
import { RootState } from "common/store";
import { Store } from "redux";

export const initStoreListeners = (
  appService: AppService,
  store: Store<RootState>
): void => {
  store.subscribe(async () => {
    const state = store.getState();
    try {
      await appService.uploadStateToRemote(state);
    } catch (error) {
      console.error("Failed to upload state to remote", error);
    }
  });
};

import { BackgroundService } from "../common/services/Background";
import { AppService } from "./services/App";

export const initEventListeners = (appService: AppService) => {
  BackgroundService.onAuthenticate(({ code, tabId }) => {
    appService
      .authenticate({ code, tabId })
      .catch((error) => console.error("Failed to authenticate", error));
  });
};

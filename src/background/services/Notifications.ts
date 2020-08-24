import { I18n } from "common/services/I18n";

export class NotificationsService {
  static authSuccess(): void {
    chrome.notifications.create({
      message: I18n.t("authSuccessMessage"),
      title: I18n.t("authSuccessTitle"),
      type: "basic",
      iconUrl: "/assets/logo.png",
    });
  }

  static uploadFailed(): void {
    chrome.notifications.create({
      message: I18n.t("uploadFailedMessage"),
      title: I18n.t("uploadFailedTitle"),
      type: "basic",
      iconUrl: "/assets/logo.png",
    });
  }

  static uploadSuccess(imgUrl: string): void {
    chrome.notifications.create({
      message: I18n.t("uploadSuccessMessage"),
      title: I18n.t("uploadSuccessTitle"),
      type: "basic",
      iconUrl: imgUrl,
    });
  }
}

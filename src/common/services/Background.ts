import { PayloadAction } from "@reduxjs/toolkit";
import { EventsService } from "./Events";
import { FileToUpload } from "../interfaces";

const EVENTS = {
  AUTHENTICATE: "AUTHENTICATE",
  UPLOAD_FILES: "UPLOAD_FILES",
  SAFE_DISPATCH: "SAFE_DISPATCH",
};

type UploadPayload = {
  files: FileToUpload[];
  notifyUser?: boolean;
};

export class BackgroundService {
  public static authenticate(dropboxCode: string): void {
    EventsService.emit({
      type: EVENTS.AUTHENTICATE,
      payload: { code: dropboxCode },
    });
  }

  public static onAuthenticate(
    handler: ({ code: string, tabId: number }) => void
  ): void {
    EventsService.on(EVENTS.AUTHENTICATE, ({ code }, sender) => {
      handler({ code, tabId: sender.tab.id });
    });
  }

  public static uploadFile(payload: UploadPayload): void {
    EventsService.emit({
      type: EVENTS.UPLOAD_FILES,
      payload: {
        files: payload.files,
        notifyUser: payload.notifyUser,
      },
    });
  }

  public static onUploadFile(handler: (payload: UploadPayload) => void): void {
    EventsService.on(EVENTS.UPLOAD_FILES, (payload: UploadPayload) => {
      handler(payload);
    });
  }

  /**
   * If user enabled data loss protection, we need to synchronize state before
   * every action
   */
  public static safeDispatch(action: PayloadAction) {
    console.info("safeDispatch", action);
    EventsService.emit({ type: EVENTS.SAFE_DISPATCH, payload: { action } });
  }

  public static onSaveDispatch(handler: (action: PayloadAction) => void) {
    EventsService.on(EVENTS.SAFE_DISPATCH, ({ action }) => {
      console.info("onSaveDispatch", action);
      handler(action);
    });
  }
}

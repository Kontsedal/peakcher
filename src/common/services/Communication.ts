import { PayloadAction } from "@reduxjs/toolkit";
import { EventsService } from "./Events";
import { FileToUpload } from "../interfaces";

const EVENTS = {
  AUTHENTICATE: "AUTHENTICATE",
  UPLOAD_FILES: "UPLOAD_FILES",
  SAFE_DISPATCH: "SAFE_DISPATCH",
  INJECT_VIEW: "INJECT_VIEW",
};

type UploadPayload = {
  files: FileToUpload[];
  notifyUser?: boolean;
};

export class CommunicationService {
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
    EventsService.emit({ type: EVENTS.SAFE_DISPATCH, payload: { action } });
  }

  public static onSaveDispatch(handler: (action: PayloadAction) => void) {
    EventsService.on(EVENTS.SAFE_DISPATCH, ({ action }) => {
      handler(action);
    });
  }

  public static injectView(params: { url: string }, tabId: number) {
    EventsService.emit(
      { type: EVENTS.INJECT_VIEW, payload: params },
      () => {},
      tabId
    );
  }

  public static onInjectView(handler: (params: { url: string }) => void) {
    EventsService.on(EVENTS.INJECT_VIEW, handler);
  }
}

import { EventsService } from "./Events";

const EVENTS = {
  AUTHENTICATE: "AUTHENTICATE",
};
export class BackgroundService {
  public static authenticate(dropboxCode: string) {
    EventsService.emit({
      type: EVENTS.AUTHENTICATE,
      payload: { code: dropboxCode },
    });
  }

  public static onAuthenticate(
    callback: ({ code: string, tabId: number }) => void
  ) {
    EventsService.on(EVENTS.AUTHENTICATE, ({ code }, sender) => {
      callback({ code, tabId: sender.tab.id });
    });
  }
}

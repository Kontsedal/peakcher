import { Logger } from "./Logger";

export type Event<T> = {
  type: string;
  payload?: T;
};

export type EventCallback<T> = (
  message: T,
  sender: chrome.runtime.MessageSender,
  respond: (...args: unknown[]) => void
) => void;

export class EventsService {
  static on<T>(eventName: string, callback: EventCallback<T>): () => void {
    const handler = (
      message: Event<T>,
      sender: chrome.runtime.MessageSender,
      respond: (...args: unknown[]) => void
    ): boolean => {
      if (message && message.type === eventName) {
        callback(message.payload, sender, respond);
      }
      Logger.error(
        `EventsService::on event "${eventName} error": `,
        chrome.runtime.lastError
      );
      return true;
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }

  /**
   * emits event to internal extension scripts (background, popup etc.) but
   * not to the content scripts
   */
  static emit<T>(
    message: Event<T>,
    callback?: (T) => void,
    tabId?: number
  ): void {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message, callback);
      return;
    }
    chrome.runtime.sendMessage(message, callback);
  }
}

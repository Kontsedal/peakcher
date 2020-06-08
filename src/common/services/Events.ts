import MessageSender = chrome.runtime.MessageSender;

export type Event<T = object> = {
  type: string;
  payload?: T;
};

export class EventsService {
  static on<T>(
    eventName: string,
    callback: (
      message: T,
      sender: MessageSender,
      respond: (...args: any[]) => void
    ) => void
  ): () => void {
    const handler = (
      message: Event<T>,
      sender: MessageSender,
      respond: (...args: any[]) => void
    ): boolean => {
      if (message && message.type === eventName) {
        callback(message.payload, sender, respond);
      }
      // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
      chrome.runtime.lastError;
      return true;
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }

  /**
   * emits event to internal extension scripts (background, popup etc.) but
   * not to the content scripts
   */
  static emit<T>(message: Event, callback?: (T) => void, tabId?: number): void {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message, callback);
      return;
    }
    chrome.runtime.sendMessage(message, callback);
  }
}

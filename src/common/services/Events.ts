export type Event<T = object> = {
  type: string;
  payload: T;
};

type Sender = {
  id: string;
  url: string;
};

export class EventsService {
  static on<T>(
    eventName: string,
    callback: (message: T, sender: Sender, respond: () => void) => void
  ): () => void {
    const handler = (
      message: Event<T>,
      sender: Sender,
      respond: () => void
    ): boolean => {
      if (message && message.type === eventName) {
        callback(message.payload, sender, respond);
      }
      return true;
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }

  static emit<T>(message: Event, callback?: (T) => void): void {
    chrome.runtime.sendMessage(message, callback);
  }
}

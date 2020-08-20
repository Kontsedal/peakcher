/* eslint-disable no-console */
import LastError = chrome.runtime.LastError;

type Argument =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | LastError
  | Error;

export class Logger {
  static info(...args: Argument[]): void {
    if (!IS_DEV) {
      return;
    }
    console.info(...args);
  }

  static log(...args: Argument[]): void {
    if (!IS_DEV) {
      return;
    }
    console.log(...args);
  }

  static warn(...args: Argument[]): void {
    if (!IS_DEV) {
      return;
    }
    console.warn(...args);
  }

  static error(...args: Argument[]): void {
    if (!IS_DEV) {
      return;
    }
    console.error(...args);
  }
}

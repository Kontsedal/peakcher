import * as KeyCode from "keycode-js";
import React from "react";

type EventCallback<T> = (event: React.KeyboardEvent<T>) => void;

export const handleKey = <T>(keyCode: string, handler: EventCallback<T>) => {
  return (event: React.KeyboardEvent<T>): void => {
    if (event.code !== keyCode) {
      return;
    }
    handler(event);
  };
};

export const handleKeys = <T>(
  keyCodes: string[],
  handler: EventCallback<T>
) => {
  return (event: React.KeyboardEvent<T>): void => {
    if (!keyCodes.includes(event.code)) {
      return;
    }
    handler(event);
  };
};

export const handleEnter = <T>(handler: EventCallback<T>): EventCallback<T> => {
  return handleKey<T>(KeyCode.CODE_ENTER, handler);
};

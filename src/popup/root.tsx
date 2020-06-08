import React from "react";
import { Provider } from "react-redux";
import { getStore } from "../common/store";
import { App } from "./container";
import { CurrentViewProvider } from "./context/CurrentView";

export const Root = () => {
  return (
    <Provider store={getStore(false)}>
      <CurrentViewProvider>
        <App />
      </CurrentViewProvider>
    </Provider>
  );
};

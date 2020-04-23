import React from "react";
import { Provider } from "react-redux";
import { getStore } from "../common/store";
import { App } from "./container";

export const Root = () => {
  return (
    <Provider store={getStore(false)}>
      <App />
    </Provider>
  );
};

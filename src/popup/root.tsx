import React from "react";
import { Provider } from "react-redux";
import { IconContext } from "react-icons";
import { getStore } from "../common/store";
import { App } from "./container";
import { CurrentViewProvider } from "./context/CurrentView";
import cssVars from "./styles/vars.module.scss";
import { ToastProvider } from "./components/Toast/context";

export const Root = () => {
  return (
    <Provider store={getStore(false)}>
      <CurrentViewProvider>
        <ToastProvider>
          <IconContext.Provider
            value={{ size: "15px", color: cssVars.textColor }}
          >
            <App />
          </IconContext.Provider>
        </ToastProvider>
      </CurrentViewProvider>
    </Provider>
  );
};

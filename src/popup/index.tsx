import React from "react";
import { Provider } from "react-redux";
import { IconContext } from "react-icons";
import { getStore } from "../common/store";
import { CurrentViewProvider } from "./context/currentView";
import cssVars from "./styles/vars.module.scss";
import { ToastProvider } from "./components/Toast/context";
import { AppView } from "./view";

export const App: React.FC = () => {
  return (
    <Provider store={getStore(false)}>
      <CurrentViewProvider>
        <ToastProvider>
          <IconContext.Provider
            value={{ size: "15px", color: cssVars.textColor }}
          >
            <AppView />
          </IconContext.Provider>
        </ToastProvider>
      </CurrentViewProvider>
    </Provider>
  );
};

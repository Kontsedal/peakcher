import React, { useContext } from "react";
import { Provider } from "react-redux";
import { IconContext } from "react-icons";
import { getStore } from "../common/store";
import {
  CurrentViewContext,
  CurrentViewProvider,
  VIEWS,
} from "./context/currentView";
import cssVars from "./styles/vars.module.scss";
import { ToastProvider } from "./components/Toast/context";
import styles from "./styles.module.scss";
import { LogInPage } from "./pages/LogIn";
import { MainPage } from "./pages/Main";
import { EditTagsPage } from "./pages/EditTags";
import { Settings } from "./components/Settings";

export const App: React.FC = () => {
  const { currentView } = useContext(CurrentViewContext);
  return (
    <Provider store={getStore(false)}>
      <CurrentViewProvider>
        <ToastProvider>
          <IconContext.Provider
            value={{ size: "15px", color: cssVars.textColor }}
          >
            <div className={styles.root}>
              {currentView === VIEWS.LOGIN && <LogInPage />}
              {currentView === VIEWS.MAIN && <MainPage />}
              {currentView === VIEWS.EDIT_TAG && <EditTagsPage />}
              <Settings />
            </div>
          </IconContext.Provider>
        </ToastProvider>
      </CurrentViewProvider>
    </Provider>
  );
};

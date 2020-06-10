import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../common/store";
import { CurrentViewContext, VIEWS } from "./context/CurrentView";
import styles from "./styles.module.scss";
import { LogInPage } from "./pages/LogIn";
import { MainPage } from "./pages/Main";
import { EditTagsPage } from "./pages/EditTags";
import { SettingsPage } from "./pages/Settings";

export const App = () => {
  const state = useSelector((currentState: RootState) => currentState);
  const { currentView, showMainView, showLoginView } = useContext(
    CurrentViewContext
  );
  useEffect(() => {
    if (state.isAuthorized) {
      showMainView();
    }
    if (!state.isAuthorized) {
      showLoginView();
    }
  }, [state.isAuthorized]);
  return (
    <div className={styles.root}>
      {currentView === VIEWS.LOGIN && <LogInPage />}
      {currentView !== VIEWS.LOGIN && <MainPage />}
      {currentView === VIEWS.EDIT_TAG && <EditTagsPage />}
      {currentView === VIEWS.SETTINGS && <SettingsPage />}
    </div>
  );
};

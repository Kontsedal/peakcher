import React, { useContext } from "react";
import styles from "./styles.module.scss";
import { CurrentViewContext, VIEWS } from "./context/currentView";
import { LogInPage } from "./pages/LogIn";
import { MainPage } from "./pages/Main";
import { EditTagsPage } from "./pages/EditTags";
import { Settings } from "./components/Settings";

export const AppView: React.FC = () => {
  const { currentView } = useContext(CurrentViewContext);
  return (
    <div className={styles.root}>
      {currentView === VIEWS.LOGIN && <LogInPage />}
      {currentView === VIEWS.MAIN && <MainPage />}
      {currentView === VIEWS.EDIT_TAG && <EditTagsPage />}
      <Settings />
    </div>
  );
};

import React from "react";
import styles from "./styles.module.scss";
import { LogInPage } from "./pages/LogIn";
import { MainPage } from "./pages/Main";

interface Props {
  isAuthorized: boolean;
}

export const AppView = ({ isAuthorized }: Props) => {
  return (
    <div className={styles.root}>
      {!isAuthorized && <LogInPage />}
      {isAuthorized && <MainPage />}
    </div>
  );
};

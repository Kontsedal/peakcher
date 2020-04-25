import React from "react";
import styles from "./styles.module.scss";
import { RootState } from "../common/store";
import { CONFIG } from "../config";

interface Props {
  state: RootState;
  increaseWidth: () => void;
}
export const AppView = ({ state, increaseWidth }: Props) => {
  return (
    <div className={styles.root}>
      {!state.isAuthorized && (
        <button
          type="button"
          onClick={() => {
            chrome.tabs.create({
              url: `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${CONFIG.DROPBOX_APP_KEY}`,
            });
          }}
        >
          Login
        </button>
      )}
      <button type="button" onClick={increaseWidth}>
        increase width
      </button>
    </div>
  );
};

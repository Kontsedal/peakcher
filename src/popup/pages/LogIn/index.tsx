import React from "react";
import { CONFIG } from "../../../config";
import { LogInPageView } from "./view";

export const LogInPage = () => {
  const handleLogInClick = () => {
    chrome.tabs.create({
      url: `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${CONFIG.DROPBOX_APP_KEY}`,
    });
  };
  return <LogInPageView onLogIn={handleLogInClick} />;
};

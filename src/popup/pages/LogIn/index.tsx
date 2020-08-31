import React from "react";
import { CONFIG } from "../../../config";
import { LogInPageView } from "./view";

export const LogInPage: React.FC = () => {
  const handleLogInClick = () => {
    window.open(
      `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${CONFIG.DROPBOX_APP_KEY}`
    );
  };
  return <LogInPageView onLogIn={handleLogInClick} />;
};

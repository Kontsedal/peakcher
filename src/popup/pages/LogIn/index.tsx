import { CONFIG } from "../../../config";
import React from "react";

export const LogInPage = () => {
  return (
    <div>
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
    </div>
  );
};

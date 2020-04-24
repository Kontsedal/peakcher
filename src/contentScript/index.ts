import { BackgroundService } from "../common/services/Background";

const DROPBOX_CODE_PAGE_URL =
  "https://www.dropbox.com/1/oauth2/authorize_submit";
function init() {
  if (!window.location.href.includes(DROPBOX_CODE_PAGE_URL)) {
    return;
  }
  getToken();
}
function getToken() {
  const tokenSelector = "[data-token]";
  const tokenAttr = "data-token";
  const element = document.querySelector(tokenSelector);
  if (element) {
    const code = element.getAttribute(tokenAttr);
    BackgroundService.authenticate(code);
  }
}

window.onload = init;

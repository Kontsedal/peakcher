import { getStore } from "../common/store";
import styles from "./styles.module.scss";

function main() {
  const IFRAME_ID = "peakcherIframe";

  let existingIframe = document.getElementById(IFRAME_ID);
  if (existingIframe) {
    existingIframe.parentNode.removeChild(existingIframe);
    return;
  }

  const store = getStore(false);
  store.subscribe(() => {
    const state = store.getState();
    iframeEl.style.width = `${state.settings.popupWidth}px`;
    iframeEl.style.height = `${state.settings.popupHeight}px`;
  });
  const iframeEl = document.createElement("iframe");
  iframeEl.src = chrome.runtime.getURL("popup.html");
  iframeEl.id = IFRAME_ID;
  iframeEl.classList.add(styles.window);
  iframeEl.setAttribute("frameborder", "0");
  document.body.appendChild(iframeEl);
}

main();

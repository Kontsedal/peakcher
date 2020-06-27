import styles from "./styles.module.scss";
import { Settings } from "../common/interfaces";

function main() {
  const IFRAME_ID = "peakcherIframe";

  let existingIframe = document.getElementById(IFRAME_ID);
  if (existingIframe) {
    existingIframe.parentNode.removeChild(existingIframe);
    return;
  }
  const iframeEl = document.createElement("iframe");
  iframeEl.src = chrome.runtime.getURL("popup.html");
  iframeEl.id = IFRAME_ID;
  iframeEl.classList.add(styles.window);
  iframeEl.setAttribute("frameborder", "0");
  iframeEl.style.visibility = "hidden";
  document.body.appendChild(iframeEl);
  window.addEventListener("message", (message: MessageEvent) => {
    if (
      message.data &&
      message.data.type === "peakcherSettings" &&
      message.data.payload
    ) {
      const settings = message.data.payload;
      iframeEl.style.width = `${settings.popupWidth}px`;
      iframeEl.style.height = `${settings.popupHeight}px`;
      setTimeout(() => {
        iframeEl.style.visibility = "visible";
      }, 100);
    }
  });
}

main();

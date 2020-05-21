import { CommunicationService } from "../common/services/Communication";
import { getStore } from "../common/store";
import styles from "./styles.module.scss";

let injectedView;
let unsubscribeFromStore;
CommunicationService.onInjectView(({ url }) => {
  if (injectedView) {
    injectedView.parentElement.removeChild(injectedView);
    injectedView = undefined;
    unsubscribeFromStore();
    return;
  }
  const store = getStore(false);
  unsubscribeFromStore = store.subscribe(() => {
    const state = store.getState();
    iframeEl.style.width = `${state.settings.popupWidth}px`;
    iframeEl.style.height = `${state.settings.popupHeight}px`;
  });
  const iframeEl = document.createElement("iframe");
  injectedView = iframeEl;

  iframeEl.src = url;
  iframeEl.classList.add(styles.window);
  iframeEl.setAttribute("frameborder", "0");
  document.body.appendChild(iframeEl);
});

import { CommunicationService } from "../common/services/Communication";
import { getStore } from "../common/store";

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
  iframeEl.style.position = "fixed";
  iframeEl.style.top = "0px";
  iframeEl.style.right = "0px";
  iframeEl.style["z-index"] = "9999";
  iframeEl.setAttribute("frameborder", "0");
  document.body.appendChild(iframeEl);
});

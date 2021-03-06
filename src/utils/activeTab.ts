export const injectScripts = (
  scriptsUrls: Array<{ code?: string; file?: string }> = []
): void => {
  const scriptsToInject = [...scriptsUrls];
  function injectNext() {
    const script = scriptsToInject.shift();
    if (!script) {
      return;
    }
    chrome.tabs.executeScript(null, script, injectNext);
  }
  injectNext();
};

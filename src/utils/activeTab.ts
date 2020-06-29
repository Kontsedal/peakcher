export const injectScripts = (scriptsUrls: Array<string> = []): void => {
  let scriptsToInject = [...scriptsUrls];
  function injectNext() {
    const scriptSrc = scriptsToInject.shift();
    if (!scriptSrc) {
      return;
    }
    chrome.tabs.executeScript(
      null,
      {
        file: scriptSrc,
      },
      injectNext
    );
  }
  injectNext();
};

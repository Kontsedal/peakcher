module.exports = ({ authProxyUrl }) => ({
  name: "Peakcher: Anonymous image gallery",
  short_name: "Peakcher",
  description: "Never lose your memes again",
  version: "2.0.0",
  manifest_version: 2,
  // We need it to make soucemaps work
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  browser_action: {
    default_popup: "popup.html",
    default_icon: "assets/logo.png",
  },
  permissions: [
    "storage",
    "notifications",
    "contextMenus",
    "https://api.dropboxapi.com/*",
    authProxyUrl,
  ],
  default_locale: "en",
  background: {
    page: "background.html",
    persistent: true,
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["bropboxCodeExtractor.js"],
    },
  ],
  icons: {
    "128": "assets/logo.png",
  },
});

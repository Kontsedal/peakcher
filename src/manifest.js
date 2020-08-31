const packageJson = require("../package.json");

module.exports = ({ authProxyUrl }) => ({
  name: "Peakcher 2",
  short_name: "Peakcher 2",
  description: "Never lose your memes again",
  version: `${packageJson.version}.0`,
  manifest_version: 2,
  // We need it to make soucemaps work
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  browser_action: {
    default_icon: "assets/logo.png",
  },
  permissions: [
    "notifications",
    "contextMenus",
    "activeTab",
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
      matches: ["https://www.dropbox.com/1/oauth2/authorize_submit"],
      js: ["dropboxCodeExtractor.js"],
    },
  ],
  icons: {
    128: "assets/logo.png",
  },
  web_accessible_resources: ["*"],
});

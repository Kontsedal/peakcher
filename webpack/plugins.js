const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");

const PATHS = require("./paths");

const processPopupHtmlFile = new HtmlWebpackPlugin({
  filename: "popup.html",
  template: path.join(PATHS.SRC_DIR, "popup/index.html"),
  chunks: ["popup"],
});

require("dotenv").config();
const defineGlobalVariables = new webpack.DefinePlugin({
  "process.env": JSON.stringify({
    DROPBOX_AUTH_PROXY_URL: process.env.DROPBOX_AUTH_PROXY_URL,
    DROPBOX_APP_KEY: process.env.DROPBOX_APP_KEY,
  }),
});

const copyStaticFiles = new CopyPlugin([
  { from: path.join(PATHS.SRC_DIR, "assets"), to: "assets" },
  { from: path.join(PATHS.SRC_DIR, "manifest.json"), to: "./" },
  { from: path.join(PATHS.SRC_DIR, "_locales"), to: "./_locales" },
]);

const enableHotReload = new ExtensionReloader({
  entries: {
    contentScript: "contentScript",
    background: "background",
    extensionPage: "popup",
  },
});

module.exports = {
  processPopupHtmlFile,
  defineGlobalVariables,
  copyStaticFiles,
  enableHotReload
};

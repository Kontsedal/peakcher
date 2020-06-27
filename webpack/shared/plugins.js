const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const getManifest = require("../../src/manifest");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const PATHS = require("./paths");

const processPopupHtmlFile = new HtmlWebpackPlugin({
  filename: "popup.html",
  template: path.join(PATHS.SRC_DIR, "popup/index.html"),
  chunks: ["popup"],
});

const processBackgroundHtmlFile = new HtmlWebpackPlugin({
  filename: "background.html",
  template: path.join(PATHS.SRC_DIR, "background/index.html"),
  chunks: ["background"],
});

require("dotenv").config();
const defineGlobalVariables = new webpack.DefinePlugin({
  "process.env": JSON.stringify({
    DROPBOX_AUTH_PROXY_URL: process.env.DROPBOX_AUTH_PROXY_URL,
    DROPBOX_APP_KEY: process.env.DROPBOX_APP_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }),
  IS_DEV: process.env.NODE_ENV === "development",
});

const copyStaticFiles = new CopyPlugin({
  patterns: [
    { from: path.join(PATHS.SRC_DIR, "assets"), to: "assets" },
    { from: path.join(PATHS.SRC_DIR, "_locales"), to: "./_locales" },
  ],
});

const enableHotReload = new ExtensionReloader({
  entries: {
    contentScript: "contentScript",
    background: "background",
    extensionPage: "popup",
  },
});

const createManifestFile = new WebpackExtensionManifestPlugin({
  config: {
    base: getManifest({ authProxyUrl: process.env.DROPBOX_AUTH_PROXY_URL }),
  },
});

const cleanDistFolder = new CleanWebpackPlugin();

module.exports = {
  processPopupHtmlFile,
  processBackgroundHtmlFile,
  defineGlobalVariables,
  copyStaticFiles,
  enableHotReload,
  createManifestFile,
  cleanDistFolder,
};

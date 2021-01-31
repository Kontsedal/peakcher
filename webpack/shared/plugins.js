const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const DashboardPlugin = require("webpack-dashboard/plugin");

const pkg = require('../../package.json')

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

const manifestVars = {
  version: pkg.version + '.0',
  authProxyUrl: process.env.DROPBOX_AUTH_PROXY_URL
}
const createManifestFile = new CopyPlugin({
  patterns: [
    {
      from: path.join(PATHS.SRC_DIR, "manifest.json"),
      to: "./",
      transform: (content) => {
        let manifest = content.toString();
        Object.entries(manifestVars).forEach(([variable, value]) => {
          manifest = manifest.replace(new RegExp(`{{\\s*${variable}\\s*}}`, 'g'), value)
        })
        return new Buffer.from(manifest, 'utf8')
      },
    },
  ],
});

const cleanDistFolder = new CleanWebpackPlugin();

const analyzeBundleSize = new BundleAnalyzerPlugin({
  analyzerPort: 3838,
});

const displayConsoleDashboard = new DashboardPlugin()

module.exports = {
  processPopupHtmlFile,
  processBackgroundHtmlFile,
  defineGlobalVariables,
  copyStaticFiles,
  createManifestFile,
  cleanDistFolder,
  analyzeBundleSize,
  displayConsoleDashboard
};

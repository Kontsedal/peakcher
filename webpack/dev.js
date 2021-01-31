const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./common");
const plugins = require("./shared/plugins");

let OUTPUT_PATH = path.join(__dirname, "../dist_dev");

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    path: OUTPUT_PATH,
    chunkFilename: "[name].bundle.js",
    filename: "[name].js",
  },
  plugins: [plugins.displayConsoleDashboard]
});

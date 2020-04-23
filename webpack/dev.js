const path = require("path");
const merge = require("webpack-merge");
const commonConfig = require("./common");
const plugins = require("./plugins");

let OUTPUT_PATH = path.join(__dirname, "../dist");

module.exports = merge(commonConfig, {
  mode: "development",
  output: {
    path: OUTPUT_PATH,
    chunkFilename: "[name].bundle.js",
    filename: "[name].js",
  },
  plugins: [plugins.enableHotReload],
});

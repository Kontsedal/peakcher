const path = require("path");
const merge = require("webpack-merge");
const commonConfig = require("./common");

let OUTPUT_PATH = path.join(__dirname, "../dist");

module.exports = merge(commonConfig, {
  mode: "development",
  output: {
    path: OUTPUT_PATH,
    chunkFilename: "[name].bundle.js",
    filename: "[name].js",
  },
});

const path = require("path");
const merge = require("webpack-merge");
const commonConfig = require("./common");
const plugins = require("./shared/plugins");

let OUTPUT_PATH = path.join(__dirname, "../dist_prod");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    path: OUTPUT_PATH,
    chunkFilename: "[name].bundle.js",
    filename: "[name].js",
  },
  plugins: [plugins.cleanDistFolder, plugins.analyzeBundleSize],
});

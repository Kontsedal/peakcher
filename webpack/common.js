const path = require("path");
const PATHS = require('./paths')
const loaders = require("./loaders")
const plugins = require("./plugins")

const ENTRY_POINTS = {
  popup: path.join(PATHS.SRC_DIR, "popup/index.tsx"),
};

module.exports = {
  entry: ENTRY_POINTS,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      loaders.processTypescript,
      loaders.processSass
    ],
  },
  plugins: [
    plugins.processPopupHtmlFile
  ]
};

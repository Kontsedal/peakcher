const path = require("path");
const PATHS = require("./shared/paths");
const loaders = require("./shared/loaders");
const plugins = require("./shared/plugins");

const ENTRY_POINTS = {
  popup: path.join(PATHS.SRC_DIR, "popup/index.tsx"),
  background: path.join(PATHS.SRC_DIR, "background/index.ts"),
  dropboxCodeExtractor: path.join(
    PATHS.SRC_DIR,
    "contentScript/dropboxCodeExtractor.ts"
  ),
  viewInjector: path.join(PATHS.SRC_DIR, "contentScript/viewInjector.ts"),
  imageExtractor: path.join(PATHS.SRC_DIR, "contentScript/imageExtractor.ts"),
};

module.exports = {
  entry: ENTRY_POINTS,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: ["node_modules", PATHS.SRC_DIR],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "_",
    },
  },
  module: {
    rules: [
      loaders.processTypescriptFiles,
      loaders.processSassFiles,
      loaders.processImages,
      loaders.processSvg,
      // loaders.lintJavaScript,
    ],
  },
  plugins: [
    plugins.createManifestFile,
    plugins.processPopupHtmlFile,
    plugins.processBackgroundHtmlFile,
    plugins.defineGlobalVariables,
    plugins.copyStaticFiles,
  ],
};

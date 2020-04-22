const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PATHS = require('./paths')

const processPopupHtmlFile = new HtmlWebpackPlugin({
  filename: "popup.html",
  template: path.join(PATHS.SRC_DIR, 'popup/index.html'),
  chunks: ["popup"],
})

module.exports = {
  processPopupHtmlFile
}

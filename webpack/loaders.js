const processTypescriptFiles = {
  test: /\.tsx?$/,
  use: "ts-loader",
  exclude: /node_modules/,
};

const processSassFiles = {
  test: /scss$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        modules: true,
      },
    },
    "sass-loader",
  ],
};

module.exports = {
  processTypescriptFiles,
  processSassFiles,
};

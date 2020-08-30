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

const processImages = {
  test: /\.(png|jpg|gif|webp)$/,
  use: ["file-loader"],
};

const processSvg = {
  test: /\.svg$/,
  use: ['@svgr/webpack'],
};

const lintJavaScript = {
  test: /\.(js|tsx?)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        eslintPath: require.resolve('eslint'),
      },
      loader: require.resolve('eslint-loader'),
    },
  ],
  exclude: /node_modules/,
}

module.exports = {
  processTypescriptFiles,
  processSassFiles,
  processImages,
  processSvg,
  lintJavaScript
};

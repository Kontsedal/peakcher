module.exports = {
  stories: ["../src/**/stories.tsx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-links"],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
        },
        {
          loader: require.resolve("react-docgen-typescript-loader"),
        },
      ],
    });
    config.module.rules.push({
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
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};

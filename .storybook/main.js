let loaders = require("../webpack/shared/loaders");
module.exports = {
  stories: ["../src/**/stories.tsx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-links"],
  webpackFinal: async (config) => {
    config.module.rules = config.module.rules.filter(
      (rule) => !rule.test.test(".svg")
    );
    config.module.rules.push(loaders.processTypescriptFiles);
    config.module.rules.push(loaders.processSassFiles);
    config.module.rules.push(loaders.processSvg);
    config.module.rules.push(loaders.processImages);
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};

const signale = require("signale");
const { getTranslationsList } = require("./utils/translations");
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const prettierConfig = require("../.prettierrc.json");

(async () => {
  signale.pending("Generating translation typings");
  let translations = await getTranslationsList();
  let translationParamsType = `export type TranslationParams = `;
  translations.forEach((item, index) => {
    let paramsType =
      item.params.length && `[${item.params.map(() => `string`).join(", ")}]`;
    translationParamsType += `["${item.name}"${
      paramsType ? `,${paramsType}` : ""
    }]`;
    if (index !== translations.length - 1) {
      translationParamsType += "|";
    } else {
      translationParamsType += ";";
    }
  });
  fs.writeFileSync(
    path.resolve("src/_locales/types.ts"),
    prettier.format(translationParamsType, prettierConfig)
  );

  signale.success("Done");
})();

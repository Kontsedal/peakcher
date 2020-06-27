const path = require("path");
const shell = require("shelljs");
const glob = require("glob");
let defaultLang = require("../../src/_locales/en/messages.json");

async function getUnusedTranslations() {
  let translationKeys = Object.keys(defaultLang);
  let translationsToFilesMap = await getTranslationsToFilesMap(translationKeys);
  let unusedTranslations = [];
  translationKeys.forEach((key) => {
    if (!translationsToFilesMap[key]) {
      unusedTranslations.push(key);
    }
  });
  return unusedTranslations;
}

function getTranslationsToFilesMap(translationsKeys) {
  let translationFilesMap = {};
  let filesPath = path.join(__dirname, "../../src/**/*.?(tsx|ts)");
  return new Promise((resolve, reject) => {
    glob(filesPath, {}, (error, files) => {
      if (error) {
        reject(error);
      }
      translationsKeys.map((translationKey) => {
        let searchString = `\\.t\\("${translationKey}"`;
        const response = shell.grep("-l", searchString, files);
        translationFilesMap[translationKey] = response.stdout.replace(
          /\s/g,
          ""
        );
      });
      resolve(translationFilesMap);
    });
  });
}

module.exports = {
  getUnusedTranslations,
};

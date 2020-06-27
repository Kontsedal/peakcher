const signale = require("signale");
const { getUnusedTranslations } = require("./utils/translations");

(async () => {
  signale.pending("Searching for unused translations");
  let unused = await getUnusedTranslations();
  signale.success("Result:", unused);
})();

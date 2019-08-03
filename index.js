const babelPlugin = require("./src/babelPlugin");
const utils = require("./src/utils");
const hash = require("object-hash");
const reactI18next = require("react-i18next");

let globalI18n;

module.exports = babelPlugin;

module.exports.createTranslation = (dict, options) => {
  const i18n = (options && options.i18n) || globalI18n;
  const namespace = hash(dict, { algorithm: "md5", encoding: "base64" }).substr(0, 5);
  const translations = utils.convertToLanguageFirst(dict);
  Object.keys(translations).forEach(lng => i18n.addResourceBundle(lng, namespace, translations[lng]));
  return {
    namespace,
    translations,
    useTranslation: () => reactI18next.useTranslation(namespace, { i18n })
  };
};

module.exports.init = {
  type: "3rdParty",
  init: i18n => {
    globalI18n = i18n;
  }
};

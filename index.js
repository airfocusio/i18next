var babelPlugin = require("./src/babelPlugin");
var utils = require("./src/utils");
var hash = require("object-hash");
var reactI18next = require("react-i18next");

var globalI18n;

module.exports = babelPlugin;

module.exports.createTranslation = function (dict, options) {
  var i18n = (options && options.i18n) || globalI18n;
  var namespace =
    (options && options.namespace) || hash(dict, { algorithm: "md5", encoding: "base64", excludeValues: false });
  var translations = utils.convertToLanguageFirst(dict);
  Object.keys(translations).forEach(function (lng) {
    i18n.addResourceBundle(lng, namespace, translations[lng]);
  });
  return {
    namespace,
    translations,
    useTranslation: function () {
      return reactI18next.useTranslation(namespace, { i18n });
    },
  };
};

module.exports.init = {
  type: "3rdParty",
  init: function (i18n) {
    globalI18n = i18n;
  },
};

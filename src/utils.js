var assign = require("es6-object-assign").assign;

function convertToLanguageFirst(translations) {
  return listToDeep(
    deepToList(translations).map(function(item) {
      return assign({}, item, {
        keys: item.keys.slice(item.keys.length - 1).concat(item.keys.slice(0, item.keys.length - 1))
      });
    })
  );
}

function deepToList(deep) {
  return Object.keys(deep).reduce(function(acc, key) {
    var value = deep[key];
    if (typeof value === "object") {
      var a = acc.concat(
        deepToList(value).map(function(x) {
          return {
            keys: [key].concat(x.keys),
            value: x.value
          };
        })
      );
      return a;
    } else {
      return acc.concat([{ keys: [key], value }]);
    }
  }, []);
}

function listToDeep(list) {
  var set = function(value, path) {
    if (path.keys.length === 0) {
      return path.value;
    } else {
      var key = path.keys[0];
      var nextKeys = path.keys.slice(1);
      var nextValue = (value && value[key]) || undefined;
      var value2 = assign({}, value);
      value2[key] = set(nextValue, { keys: nextKeys, value: path.value });
      return value2;
    }
  };
  return list.reduce(function(acc, item) {
    return set(acc, item);
  }, {});
}

module.exports = {
  convertToLanguageFirst
};

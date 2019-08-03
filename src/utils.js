function convertToLanguageFirst(translations) {
  return listToDeep(
    deepToList(translations).map(item => ({
      ...item,
      keys: [...item.keys.slice(item.keys.length - 1), ...item.keys.slice(0, item.keys.length - 1)]
    }))
  );
}

function deepToList(deep) {
  return Object.keys(deep).reduce((acc, key) => {
    const value = deep[key];
    if (typeof value === "object") {
      const a = [
        ...acc,
        ...deepToList(value).map(x => ({
          keys: [key, ...x.keys],
          value: x.value
        }))
      ];
      return a;
    } else {
      return [...acc, { keys: [key], value }];
    }
  }, []);
}

function listToDeep(list) {
  const set = (value, path) => {
    if (path.keys.length === 0) {
      return path.value;
    } else {
      const key = path.keys[0];
      const nextKeys = path.keys.slice(1);
      const nextValue = (value && value[key]) || undefined;
      return {
        ...value,
        [key]: set(nextValue, { keys: nextKeys, value: path.value })
      };
    }
  };
  return list.reduce((acc, item) => set(acc, item), {});
}

module.exports = {
  convertToLanguageFirst
};

const pluginTester = require("babel-plugin-tester").default;
const plugin = require("../src/babelPlugin");
const path = require("path");

pluginTester({
  plugin,
  fixtures: path.join(__dirname, "babelPluginFixtures"),
});

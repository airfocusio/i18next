const pluginTester = require("babel-plugin-tester");
const plugin = require("../src/babelPlugin");
const path = require("path");

pluginTester({
  plugin,
  fixtures: path.join(__dirname, "babelPlugin")
});

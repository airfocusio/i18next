const nodePath = require("path");
const hash = require("object-hash");
const evaluate = require("babel-helper-evaluate-path");

module.exports = function i18nextBabelPlugin(babel) {
  const { types: t } = babel;
  return {
    name: "i18next",
    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.source.value === "@choffmeister/i18next") {
          if (t.isImportNamespaceSpecifier(path.node.specifiers[0])) {
            return;
          }

          const imports = path.node.specifiers.map((s) => ({
            localName: s.local.name,
            importedName: s.type === "ImportDefaultSpecifier" ? "default" : s.imported.name,
          }));

          let shouldExit = false;
          let hasReferences = false;
          const referencePathsByImportName = imports.reduce((byName, { importedName, localName }) => {
            let binding = path.scope.getBinding(localName);
            if (!binding) {
              shouldExit = true;
              return byName;
            }
            byName[importedName] = binding.referencePaths;
            hasReferences = hasReferences || byName[importedName].length > 0;
            return byName;
          }, {});

          if (!hasReferences || shouldExit) {
            return;
          }

          /**
           * Other plugins that run before babel-plugin-macros might use path.replace, where a path is
           * put into its own replacement. Apparently babel does not update the scope after such
           * an operation. As a remedy, the whole scope is traversed again with an empty "Identifier"
           * visitor - this makes the problem go away.
           *
           * See: https://github.com/kentcdodds/import-all.macro/issues/7
           */
          state.file.scope.path.traverse({
            Identifier() {},
          });

          const createTranslationReferencePaths = referencePathsByImportName["createTranslation"] || [];
          createTranslationReferencePaths
            .filter((ref) => t.isCallExpression(ref.parent))
            .filter((ref) => ref.node === ref.parent.callee)
            .filter((ref) => ref.parent.arguments.length >= 1)
            .forEach((reference) => {
              rewriteCreateTranslationCallExpression({
                reference,
                state,
                babel,
              });
            });
        }
      },
    },
  };
};

function rewriteCreateTranslationCallExpression({ reference, babel }) {
  const hasFilepath = reference.hub.file.opts.filename && reference.hub.file.opts.filename !== "unknown";
  const fileName = hasFilepath ? nodePath.basename(reference.hub.file.opts.filename) : "";
  const namespacePrefix = fileName.substr(0, fileName.length - nodePath.extname(fileName).length);

  const { types: t } = babel;
  const dictEvaluation = evaluate(reference.parentPath.get("arguments")[0]);
  if (dictEvaluation.confident) {
    const dict = dictEvaluation.value;
    // TODO apply convertToLanguageFirst
    const dictHash = hash(dict, { algorithm: "md5", encoding: "base64", excludeValues: false });
    const namespaceObjectProperty = t.objectProperty(
      t.identifier("namespace"),
      t.stringLiteral(namespacePrefix + "--" + dictHash.substr(0, 5))
    );
    if (reference.parent.arguments.length === 1) {
      reference.parent.arguments.push(t.objectExpression([namespaceObjectProperty]));
    } else if (reference.parent.arguments.length === 2 && t.isObjectExpression(reference.parent.arguments[1])) {
      reference.parent.arguments[1].properties.push(namespaceObjectProperty);
    }
  }
}

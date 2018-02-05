// import syntaxFunctionPartialApplication from "@babel/plugin-syntax-function-partial-application";
import { types as t } from "@babel/core";

function isPartialApplication(node) {
  return (
    node.type === "QuestionElement" ||
    (node.type === "SpreadElement" && node.argument === undefined)
  );
}

export function nextArgument(args) {
  const countUnderscores = s => (s.match(/_/g) || []).length;
  const nextUnderscoreCount =
    Math.max(
      ...args.map(e => {
        if (typeof e.name === "string" && e.name.replace(/_*/, "") === "x") {
          return countUnderscores(e.name);
        } else {
          return 0;
        }
      }),
    ) + 1;
  return t.identifier("_".repeat(nextUnderscoreCount) + "x");
}

export default function() {
  return {
    // inherits: syntaxFunctionPartialApplication,

    visitor: {
      CallExpression(path) {
        const { node } = path;

        if (node.arguments.some(e => isPartialApplication(e)) === false) {
          return;
        }

        const params = node.arguments;
        for (let i = 0; i < node.arguments.length; ++i) {
          if (node.arguments[i].type === "QuestionElement") {
            params[i] = nextArgument(params);
          }
        }

        const body = { ...node, arguments: params };
        path.replaceWith(
          t.expressionStatement(
            t.arrowFunctionExpression(
              params.filter(e => e.type === "Identifier"),
              body,
            ),
          ),
        );
      },
    },
  };
}

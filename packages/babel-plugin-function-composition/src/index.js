import { types as t } from "@babel/core";

export default function() {
  return {
    visitor: {
      BinaryExpression(path) {
        const { node } = path;
        const { operator } = node;

        if (operator !== "+>") {
          return;
        }

        // x => g(f(x))
        const args = [t.identifier("x")];
        const body = t.callExpression(node.right, [
          t.callExpression(node.left, args),
        ]);

        path.replaceWith(
          t.expressionStatement(t.arrowFunctionExpression(args, body)),
        );
      },
    },
  };
}

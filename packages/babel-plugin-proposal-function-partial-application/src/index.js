// import syntaxFunctionPartialApplication from "@babel/plugin-syntax-function-partial-application";
import { types as t } from "@babel/core";

function isPartialApplication(node) {
  return node.type === 'QuestionElement' ||
    (node.type === 'SpreadElement' && node.argument === undefined);
}

export default function() {
  return {
    // inherits: syntaxFunctionPartialApplication,

    visitor: {
      CallExpression(path) {
        // make it work for ?
        // then ...
        const { scope } = path;
        const { node } = path;

        if (node.arguments.some(e => isPartialApplication(e)) === false) {
          return;
        }

        // partial application was detected
        console.log('partial application was detected')

        // const transformArgument = e => isPartialApplication(e) ? ''

        // const params = node.arguments.map(e => (e))
        // // const body =
        // path.replaceWith(t.expressionStatement(t.arrowFunctionExpression(params, body)))
      }
    }
  }
}

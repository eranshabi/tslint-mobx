/*"no-async-with-action": context => ({
    Decorator: function(node) {
      if (node.expression.name === "action") {
        const ancestors = context.getAncestors();
        const parent = ancestors.length > 0 && ancestors[ancestors.length - 1];
        if (parent.type === "ClassProperty") {
          if (parent.value && parent.value.async) {
            context.report(node, "Async methods must use flow");
          }
        }
      }
    }
  })
*/

import * as Lint from 'tslint';
import * as ts from 'typescript';
import {isMethodDeclaration, isArrowFunction, isPropertyDeclaration} from 'tsutils';
import { hasModifier } from 'tslint';
import { SyntaxKind } from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const hasActionDecorator = (node:ts.Node)=>{
   return node.decorators && node.decorators.some(deco => {
        return (deco.expression && (deco.expression as any).escapedText === 'action')
    });
}

const walk = (ctx: Lint.WalkContext<any>): void => {
    const {sourceFile} = ctx;
    return ts.forEachChild(sourceFile,  function cb(node: ts.Node): void {

        if(isMethodDeclaration(node) && hasModifier(node.modifiers, SyntaxKind.AsyncKeyword) && hasActionDecorator(node)){
            ctx.addFailureAtNode(node, "Mobx @action can't be used on async methods");
        }
        else if(isPropertyDeclaration(node)  && hasActionDecorator(node)){
            const isAsync = (node.initializer && hasModifier(node.initializer.modifiers, SyntaxKind.AsyncKeyword))
            if(isAsync) {
                ctx.addFailureAtNode(node, "Mobx @action can't be used on async methods");
            }
        }
       
        return ts.forEachChild(node, cb);
    });
};

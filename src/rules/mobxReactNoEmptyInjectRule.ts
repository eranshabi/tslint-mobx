import * as Lint from 'tslint';
import * as ts from 'typescript';
import {isClassDeclaration, isClassExpression} from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const walk = (ctx: Lint.WalkContext<any>): void => {
    const {sourceFile} = ctx;
    return ts.forEachChild(sourceFile,  function cb(node: ts.Node): void {
        if (isClassDeclaration(node) || isClassExpression(node)) {
            if (node.decorators) {
                node.decorators.forEach(deco => {
                    if (deco.expression && deco.expression.expression && deco.expression.expression.escapedText === 'inject') {
                        if (!deco.expression.arguments[0]) {
                            ctx.addFailureAtNode(node, 'inject must have an argument');
                        }
                    }
                });
            }
        }
        return ts.forEachChild(node, cb);
    });
};

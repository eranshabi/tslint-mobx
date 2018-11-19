import * as Lint from 'tslint';
import * as ts from 'typescript';
import { isClassDeclaration, isClassExpression } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const walk = (ctx: Lint.WalkContext<any>): void => {
    const { sourceFile } = ctx;
    return ts.forEachChild(sourceFile, function cb(node: ts.Node): void {
        if (isClassDeclaration(node) || isClassExpression(node)) {
            if (node.decorators) {
                node.decorators.forEach(deco => {
                    if (deco.expression && (<any>deco.expression).expression && (<any>deco.expression).expression.escapedText === 'inject') {
                        ctx.addFailureAtNode(node, 'inject decorators are not allowed');
                    }
                });
            }
        }
        return ts.forEachChild(node, cb);
    });
};

import * as ts from 'typescript';
import * as Lint from 'tslint';
import {isClassDeclaration, isClassExpression} from 'tsutils';

const FAILURE_MESSAGE: string = 'Unused mobX store injected: ';

//Based on https://github.com/Microsoft/tslint-microsoft-contrib/blob/master/src/reactUnusedPropsAndStateRule.ts

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {

    private propNames: string[] = [];
    private propNodes: { [index: string]: ts.TypeElement } = {};
    private classDeclarations: ts.ClassDeclaration[] = [];
    private propsAlias: string;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitSourceFile(node: ts.SourceFile): void {

        super.visitSourceFile(node);
        this.getInjectedStoresNames(node);

        // if no stores were injected then don't bother scanning the class
        if (this.propNames.length > 0) {
            this.classDeclarations.forEach(this.walkChildren, this);
        }

        this.propNames.forEach((propName: string): void => {
            const typeElement: ts.TypeElement = this.propNodes[propName];
            this.addFailureAt(typeElement.getStart(), typeElement.getWidth(), FAILURE_MESSAGE + propName);
        });
    }

    protected getInjectedStoresNames(sourceFile) {
        const cb = (node: ts.Node): void => {
            if (isClassDeclaration(node) || isClassExpression(node)) {
                if (node.decorators) {
                    node.decorators.forEach(deco => {
                        if (deco.expression && (<any>deco.expression).expression && (<any>deco.expression).expression.escapedText === 'inject') {
                            if ((<any>deco.expression).arguments[0]) {
                                this.propNodes[(<any>deco.expression).arguments[0].text] = (<any>node);
                                this.propNames.push((<any>deco.expression).arguments[0].text);
                            }
                        }
                    });
                }
            }
            return ts.forEachChild(node, cb);
        };

        return ts.forEachChild(sourceFile, cb);
    }

    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        this.classDeclarations.push(node);
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        const referencedPropertyName: string = node.getText();
        if (/this\.props\..*/.test(referencedPropertyName)) {
            this.propNames = remove(this.propNames, referencedPropertyName.substring(11));
        }

        if (this.propsAlias != null) {
            if (new RegExp(this.propsAlias + '\\..*').test(referencedPropertyName)) {
                this.propNames = remove(this.propNames, referencedPropertyName.substring(this.propsAlias.length + 1));
            }
        }

        if (node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression) {
            if (referencedPropertyName === 'this.props') {
                const left = node.parent.getChildren()[0];
                const leftChildrenLength = left.getChildren().length;
                if (leftChildrenLength !== 0 && left.getChildren()[0].getText() === '{' && left.getChildren()[leftChildrenLength - 1].getText() === '}') {
                    const vars = left.getChildren().map(child => child.getText()).slice(1, -1)[0].split(',').map(ar => ar.trim());
                    this.propNames = removeAll(this.propNames, vars);
                } else {
                    // this props reference has escaped the function
                    this.propNames = [];
                }
            }
        }
        super.visitPropertyAccessExpression(node);
    }

    protected visitIdentifier(node: ts.Identifier): void {
        if (this.propsAlias != null) {
            if (node.text === this.propsAlias
                && node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression
                && node.parent.kind !== ts.SyntaxKind.Parameter
                && this.isParentNodeSuperCall(node) === false) {
                // this props reference has escaped the constructor
                this.propNames = [];
            }

        }
        super.visitIdentifier(node);
    }

    /**
     * Props can be aliased to some other name within the constructor.
     */
    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        if (node.parameters.length > 0) {
            this.propsAlias = (<ts.Identifier>node.parameters[0].name).text;
        }
        super.visitConstructorDeclaration(node);
        this.propsAlias = undefined;
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        const methodName: string = (<ts.Identifier>node.name).text;
        if (/componentWillReceiveProps|shouldComponentUpdate|componentWillUpdate|componentDidUpdate/.test(methodName)
            && node.parameters.length > 0) {
            this.propsAlias = (<ts.Identifier>node.parameters[0].name).text;
        }
        super.visitMethodDeclaration(node);
        this.propsAlias = undefined;
    }

    private isParentNodeSuperCall(node: ts.Node): boolean {
        if (node.parent != null && node.parent.kind === ts.SyntaxKind.CallExpression) {
            const call: ts.CallExpression = <ts.CallExpression>node.parent;
            return call.expression.getText() === 'super';
        }
        return false;
    }
}

function removeAll<T>(source: ReadonlyArray<T>, elementsToRemove: ReadonlyArray<T>): T[] {
    if (source == null || source.length === 0) {
        return [];
    }
    if (elementsToRemove == null || elementsToRemove.length === 0) {
        return [].concat(source); // be sure to return a copy of the array
    }

    return source.filter((sourceElement: T): boolean => {
        return !contains(elementsToRemove, sourceElement);
    });
}

function remove<T>(source: ReadonlyArray<T>, elementToRemove: T): T[] {
    return removeAll(source, [elementToRemove]);
}

function contains<T>(list: ReadonlyArray<T>, element: T): boolean {
    return exists(list, (item: T): boolean => {
        return item === element;
    });
}

function exists<T>(list : ReadonlyArray<T>, predicate: (t: T) => boolean) : boolean {
    if (list != null) {
        for (let i = 0; i < list.length; i++) {
            const obj : T = list[i];
            if (predicate(obj)) {
                return true;
            }
        }
    }
    return false;
}

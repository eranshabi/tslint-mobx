import {lintFileString, noUnusedInjectConfig} from './utils';

describe('mobx-react-no-unused-inject', () => {
    describe('should pass when', () => {
        it('when destructuring store prop', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                        let {myStore, a} = this.props; 
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when using props escaped the function', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                            console.log(this.props); 
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when used in constructor', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                        console.log(this.props); 
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when used from constructor parameters', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor(props) {
                        super(props);
                        console.log(props.myStore); 
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when referenced from lifecycle method', () => {
            const file = `
                @inject('myStore1')
                @inject('myStore2')
                @inject('myStore3')
                @inject('myStore4')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    public componentWillReceiveProps(nextProps: P, nextContext: any): void {
                    console.log(nextProps.myStore1);
                }
                public shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any): boolean {
                    console.log(nextProps.myStore2);
                    return true;
                }
                public componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {
                    console.log(nextProps.myStore3);
                }
                public componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {
                    console.log(prevProps.myStore4);
                }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when escaped from shouldComponentUpdate', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    public shouldComponentUpdate(nextProps: P, nextState: S, nextContext: any): boolean {
                    console.log(nextProps);
                    return true;
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when escaped from componentWillUpdate', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    public componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {
                        console.log(nextProps);
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when escaped from componentDidUpdate', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                     public componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {
                        console.log(prevProps);
                     }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when escaped from componentWillReceiveProps', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    public componentWillReceiveProps(nextProps: P, nextContext: any): void {
                        console.log(nextProps);
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });

        it('when destructuring a value from the store', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {                    
                    public render(): ReactTypes.ReactElement<any> {
                        const { myStore: { storeValue }, foo, bar = [], ...rest } = this.props;
                        return null;
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(0);
        });
    });

    describe('should fail when', () => {
        it('store was not used', () => {
            const file = `
                @inject('myStore')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                }
                `;
            const result = lintFileString(file, noUnusedInjectConfig);
            expect(result.errorCount).toEqual(1);
        });

    });

    it('when destructuring other prop', () => {
        const file = `
            @inject('myStore')
            class A extends React.Component<AddressDetailsFormProps, AState> {
                constructor() {
                    super();
                    let {a} = this.props; 
                }
            }
            `;
        const result = lintFileString(file, noUnusedInjectConfig);
        expect(result.errorCount).toEqual(1);
    });
});

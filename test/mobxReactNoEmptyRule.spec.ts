import {lint, lintFileString, noEmptyInjectConfig} from './utils';

describe('mobx-react-no-empty-inject', () => {
    it('should fail when there is an empty inject', () => {
        const file = `
                @inject()
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                            console.log(this.props); 
                    }
                }
                `;
        const result = lintFileString(file, noEmptyInjectConfig);
        expect(result.errorCount).toEqual(1);
    });

    it('should pass when there is a not empty inject', () => {
        const file = `
                @inject('store')
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                            console.log(this.props); 
                    }
                }
                `;
        const result = lintFileString(file, noEmptyInjectConfig);
        expect(result.errorCount).toEqual(0);
    });

    it('should pass when there are no injects', () => {
        const file = `
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    public render(): ReactTypes.ReactElement<any> {
                            console.log(this.props); 
                    }
                }
                `;
        const result = lintFileString(file, noEmptyInjectConfig);
        expect(result.errorCount).toEqual(0);
    });
});

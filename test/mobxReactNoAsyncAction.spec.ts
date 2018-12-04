import {lint, lintFileString, noAsyncActions} from './utils';

describe('mobx-react-no-async-action', () => {
    it('should fail when there is an action decorator on an async method', () => {
        const file = `
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    @action
                    public async method(){
                        console.log("I'm an action");
                    }
                }
                `;
        const result = lintFileString(file, noAsyncActions);
        expect(result.errorCount).toEqual(1);
    });

    it('should fail when there is an action decorator on an async ClassProperty', () => {
        const file = `
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    @action
                    public method = async () => {
                        console.log("I'm an action");
                    }
                }
                `;
        const result = lintFileString(file, noAsyncActions);
        expect(result.errorCount).toEqual(1);
    });

    it('should pass when there is an action decorator on a non-async ClassProperty', () => {
        const file = `
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    @action
                    public method = () => {
                        console.log("I'm an action");
                    }
                }
                `;
        const result = lintFileString(file, noAsyncActions);
        expect(result.errorCount).toEqual(0);
    });

    it('should pass when there is an action decorator on a non-async method', () => {
        const file = `
                class A extends React.Component<AddressDetailsFormProps, AState> {
                    constructor() {
                        super();
                    }
                    
                    @action
                    public action(){
                        console.log("I'm an action");
                    }
                }
                `;
        const result = lintFileString(file, noAsyncActions);
        expect(result.errorCount).toEqual(0);
    });


  });

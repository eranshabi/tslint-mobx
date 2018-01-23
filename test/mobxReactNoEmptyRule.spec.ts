import {lint} from './utils';

describe('mobx-react-no-empty-inject', () => {
    it('should result 1 error', () => {
        const result = lint('./test/projectsToLint/', '1.ts');
        expect(result.errorCount).toEqual(1);
    })
});

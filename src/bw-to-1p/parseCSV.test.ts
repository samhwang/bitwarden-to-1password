import { parseCSVInput } from './parseCSV';
import { getRelativeFilepath } from './utils';

describe('Parse JSON File', () => {
    const inputFile = '../input/sample.csv';

    it('Should parse the file correctly', () => {
        const records = parseCSVInput(getRelativeFilepath(inputFile));
        expect(records.length).toEqual(1);

        const item = records[0];
        expect(item).toEqual({
            name: 'Example name',
            notes: 'example note',
            login_uri: 'https://example.com',
            login_username: 'example_login',
            login_password: 'example_password',
        });
    });
});

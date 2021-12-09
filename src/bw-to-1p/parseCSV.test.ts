import { convertBWCSVTo1P, IBitwardenLogin, parseCSVInput } from './parseCSV';
import { getRelativeFilepath, I1PasswordLogin } from './utils';

describe('Bitwarden CSV to 1Password', () => {
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

    it('Should convert correctly', () => {
        const input: IBitwardenLogin = {
            name: 'Example name',
            notes: 'example note',
            login_uri: 'https://example.com',
            login_username: 'example_login',
            login_password: 'example_password',
        };
        const output = convertBWCSVTo1P([input]);
        const expectedOutput: I1PasswordLogin = {
            title: 'Example name',
            notes: 'example note',
            website: 'example.com',
            username: 'example_login',
            password: 'example_password',
        };
        expect(output).toEqual([expectedOutput]);
    });
});

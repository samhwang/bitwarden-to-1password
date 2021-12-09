import { parseCSVInput } from './bw-to-1p';

describe('Bitwarden to 1Password', () => {
    const inputFile = '../input/sample.csv';

    it('Should parse the file correctly', () => {
        const records = parseCSVInput(inputFile);
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

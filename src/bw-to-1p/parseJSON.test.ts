import { parseJSONInput } from './parseJSON';
import { getRelativeFilepath } from './utils';

describe('Parse JSON file', () => {
    const inputFile = '../input/sample.json';

    it('Should parse the file correctly', () => {
        const records = parseJSONInput(getRelativeFilepath(inputFile));
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

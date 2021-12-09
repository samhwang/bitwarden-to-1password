import {
    convertBWTo1P,
    IBitWardenLogin,
    I1PasswordLogin,
    isIncorrectFiletype,
    isUnsupportedFiletype,
} from './utils';

describe('BitWarden to 1Password', () => {
    it('Should convert correctly', () => {
        const input: IBitWardenLogin = {
            name: 'Example name',
            notes: 'example note',
            login_uri: 'https://example.com',
            login_username: 'example_login',
            login_password: 'example_password',
        };
        const output = convertBWTo1P([input]);
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

describe('Utility functions', () => {
    describe('Flagging incorrect file type', () => {
        it('Should flag .csv file and csv format is correct', () => {
            expect(isIncorrectFiletype('test.csv', 'csv')).toBeFalsy();
        });

        it('Should flag .csv file and csv format is incorrect', () => {
            expect(isIncorrectFiletype('test.csv', 'json')).toBeTruthy();
        });
    });

    describe('Flagging unsupported file type', () => {
        it('Should not flag csv or json as unsupported file type', () => {
            expect(isUnsupportedFiletype('json')).toBeFalsy();
            expect(isUnsupportedFiletype('csv')).toBeFalsy();
        });

        it('Should flag unsupported file type correctly', () => {
            expect(isUnsupportedFiletype('txt')).toBeTruthy();
        });
    });
});

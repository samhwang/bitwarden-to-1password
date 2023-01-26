import { path } from './deps.ts';
import { assertEquals, assertObjectMatch, assertThrows, describe, it } from './dev_deps.ts';
import { convertBWTo1P, IBitWardenLogin } from './convert.ts';
import { getRelativeFilepath, isIncorrectFiletype, isUnsupportedFiletype } from './utils.ts';
import { parseCSV, parseJSON } from './parseInput.ts';

/**
 * Get Path to test file
 */
function getTestFilePath(fileName: string) {
    return getRelativeFilepath(path.join('testFiles', 'input', fileName));
}

describe('BitWarden to 1Password', () => {
    describe('Utility functions', () => {
        describe('Flagging incorrect file type', () => {
            it('Should flag .csv file and csv format is correct', () => {
                assertEquals(isIncorrectFiletype('test.csv', 'csv'), false);
            });

            it('Should flag .csv file and json format as incorrect', () => {
                assertEquals(isIncorrectFiletype('test.csv', 'json'), true);
            });
        });

        describe('Flagging unsupported file type', () => {
            it('Should not flag csv or json as unsupported file type', () => {
                assertEquals(isUnsupportedFiletype('json'), false);
                assertEquals(isUnsupportedFiletype('csv'), false);
            });

            it('Should flag unsupported file type correctly', () => {
                assertEquals(isUnsupportedFiletype('txt'), true);
            });
        });
    });

    describe('Parse CSV File', () => {
        it('Should parse the file correctly', () => {
            const inputFile = 'sample.csv';
            const records = parseCSV(getTestFilePath(inputFile));
            assertEquals(records.length, 1);

            const item = records[0];
            assertObjectMatch(item, {
                name: 'Example name',
                notes: 'example note',
                login_uri: 'https://example.com',
                login_username: 'example_login',
                login_password: 'example_password',
            });
        });
    });

    describe('Parse JSON file', () => {
        it('Should throw error when reading invalid json files', () => {
            const inputFile = 'sample_invalid.json';
            assertThrows(() => parseJSON(getTestFilePath(inputFile)));
        });

        it('Should throw error when reading encrypted json files', () => {
            const inputFile = 'sample_encrypted.json';
            assertThrows(
                () => parseJSON(getTestFilePath(inputFile)),
                Error,
                'Cannot work with encrypted JSON file. Please use an unencrypted export.',
            );
        });

        it('Should parse the file correctly with empty credentials', () => {
            const inputFile = 'sample_empty_credentials.json';
            const records = parseJSON(getTestFilePath(inputFile));
            assertEquals(records.length, 1);

            const item = records[0];
            assertObjectMatch(item, {
                name: 'Example name',
                notes: '',
                login_uri: '',
                login_username: '',
                login_password: '',
            });
        });

        it('Should parse the file correctly with empty uri array', () => {
            const inputFile = 'sample_no_uris.json';
            const records = parseJSON(getTestFilePath(inputFile));
            assertEquals(records.length, 1);

            const item = records[0];
            assertObjectMatch(item, {
                name: 'Example name',
                notes: 'example note',
                login_uri: '',
                login_username: 'example_login',
                login_password: 'example_password',
            });
        });

        it('Should parse the file correctly with at least 1 uri', () => {
            const inputFile = 'sample_valid.json';
            const records = parseJSON(getTestFilePath(inputFile));
            assertEquals(records.length, 1);

            const item = records[0];
            assertObjectMatch(item, {
                name: 'Example name',
                notes: 'example note',
                login_uri: 'https://example.com',
                login_username: 'example_login',
                login_password: 'example_password',
            });
        });

        it('Should parse the file correctly with null uri', () => {
            const inputFile = 'sample_null_uri.json';
            const records = parseJSON(getTestFilePath(inputFile));
            assertEquals(records.length, 1);

            const item = records[0];
            assertObjectMatch(item, {
                name: 'Example name',
                notes: 'example note',
                login_uri: '',
                login_username: 'example_login',
                login_password: 'example_password',
            });
        });

        it('Should parse the file correctly with null or missing properties', () => {
            const inputFile = 'sample_null_or_missing_properties.json';
            const records = parseJSON(getTestFilePath(inputFile));
            assertEquals(records.length, 3);

            assertObjectMatch(records[0], {
                name: 'Example name',
                notes: 'example note',
                login_uri: '',
                login_username: 'example_login',
                login_password: 'example_password',
            });
            assertObjectMatch(records[1], {
                name: 'Example with null note and no login',
                notes: '',
                login_uri: '',
                login_username: '',
                login_password: '',
            });
            assertObjectMatch(records[2], {
                name: 'Example with no uris',
                notes: 'example note',
                login_uri: '',
                login_username: 'example_login',
                login_password: 'example_password',
            });
        });
    });

    describe('Conversion', () => {
        it('Should convert correctly', () => {
            const input: IBitWardenLogin = {
                name: 'Example name',
                notes: 'example note',
                login_uri: 'https://example.com',
                login_username: 'example_login',
                login_password: 'example_password',
            };
            const output = convertBWTo1P(input);
            assertObjectMatch(output, {
                title: 'Example name',
                notes: 'example note',
                website: 'https://example.com',
                username: 'example_login',
                password: 'example_password',
            });
        });
    });
});

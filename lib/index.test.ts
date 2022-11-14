import path from 'path';
import { describe, it, expect } from 'vitest';
import { convertBWTo1P, IBitWardenLogin, I1PasswordLogin } from './convert';
import {
    isIncorrectFiletype,
    isUnsupportedFiletype,
    getRelativeFilepath,
} from './utils';
import { parseCSV, parseJSON } from './parseInput';

/**
 * Get Path to test file
 * @param fileName
 */
const getTestFilePath = (fileName: string) =>
    getRelativeFilepath(path.join('testFiles', 'input', fileName));

describe('BitWarden to 1Password', () => {
    describe('Utility functions', () => {
        describe('Flagging incorrect file type', () => {
            it('Should flag .csv file and csv format is correct', () => {
                expect(isIncorrectFiletype('test.csv', 'csv')).toBeFalsy();
            });

            it('Should flag .csv file and json format as incorrect', () => {
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

    describe('Parse CSV File', () => {
        it('Should parse the file correctly', () => {
            const inputFile = 'sample.csv';
            const records = parseCSV(getTestFilePath(inputFile));
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

    describe('Parse JSON file', () => {
        it('Should throw error when reading invalid json files', () => {
            const inputFile = 'sample_invalid.json';
            expect(() => parseJSON(getTestFilePath(inputFile))).toThrow();
        });

        it('Should throw error when reading encrypted json files', () => {
            const inputFile = 'sample_encrypted.json';
            expect(() => parseJSON(getTestFilePath(inputFile))).toThrow(
                'Cannot work with encrypted JSON file. Please use an unencrypted export.'
            );
        });

        it('Should parse the file correctly with empty credentials', () => {
            const inputFile = 'sample_empty_credentials.json';
            const records = parseJSON(getTestFilePath(inputFile));
            expect(records.length).toEqual(1);

            const item = records[0];
            expect(item).toEqual({
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
            expect(records.length).toEqual(1);

            const item = records[0];
            expect(item).toEqual({
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

        it('Should parse the file correctly with null uri', () => {
            const inputFile = 'sample_null_uri.json';
            const records = parseJSON(getTestFilePath(inputFile));
            expect(records.length).toEqual(1);

            const item = records[0];
            expect(item).toEqual({
                name: 'Example name',
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
            const expectedOutput: I1PasswordLogin = {
                title: 'Example name',
                notes: 'example note',
                website: 'https://example.com',
                username: 'example_login',
                password: 'example_password',
            };
            expect(output).toEqual(expectedOutput);
        });
    });
});

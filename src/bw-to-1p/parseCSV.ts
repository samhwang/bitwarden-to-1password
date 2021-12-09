import fs from 'fs';
import { URL } from 'url';
import type { IBitwardenLogin, I1PasswordLogin } from './utils';

/**
 * Parse CSV input file into an array of TS Records
 * @param inputFile Input file name
 * @returns The parsed array of records
 */
export const parseCSVInput = (inputFile: string): IBitwardenLogin[] => {
    const isHeaderRow = (lineCount: number) => lineCount === 0;
    const isEmptyLine = (line: string) => line.trim() === '';
    return fs
        .readFileSync(inputFile, { encoding: 'utf-8' })
        .split('\n')
        .reduce((accumulator: IBitwardenLogin[], line, index) => {
            if (isHeaderRow(index) || isEmptyLine(line)) {
                return accumulator;
            }

            const attributes = line.split(',');
            accumulator.push({
                name: attributes[3],
                notes: attributes[4],
                login_uri: attributes[7],
                login_username: attributes[8],
                login_password: attributes[9],
            });
            return accumulator;
        }, []);
};

/**
 * Converts BitWarden Login CSV to 1Password Login
 * @param inputs BitWarden Logins
 * @returns 1Password Login Objects
 */
export const convertBWCSVTo1P = (
    inputs: IBitwardenLogin[]
): I1PasswordLogin[] =>
    inputs.map(
        ({ name, login_uri, login_username, login_password, notes }) => ({
            title: name,
            website: new URL(login_uri).host,
            username: login_username,
            password: login_password,
            notes,
        })
    );

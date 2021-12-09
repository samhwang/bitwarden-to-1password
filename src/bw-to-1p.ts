import fs from 'fs';
import path from 'path';
import { URL } from 'url';

/**
 * Get relative file path from the script calling this
 * @param filename The file name
 * @returns The relative path to the file
 */
export const getRelativeFilepath = (filename: string) =>
    path.join(__dirname, '..', filename);

export interface IBitwardenLogin {
    name: string;
    notes: string;
    login_uri: string;
    login_username: string;
    login_password: string;
}

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

export interface I1PasswordLogin {
    title: string;
    website: string;
    username: string;
    password: string;
    notes?: string;
}

/**
 * Converts BitWarden Login to 1Password Login
 * @param inputs BitWarden Logins
 * @returns 1Password Login Objects
 */
export const convertBWTo1P = (inputs: IBitwardenLogin[]): I1PasswordLogin[] =>
    inputs.map(
        ({ name, login_uri, login_username, login_password, notes }) => ({
            title: name,
            website: new URL(login_uri).host,
            username: login_username,
            password: login_password,
            notes,
        })
    );

const arrayToLine = (words: string[]) => `${words.join(',')}\n`;

/**
 * Export 1password logins into csv file
 * @param logins 1Password login objects
 * @param outputFile Output file name
 */
export const write1PasswordCSV = (
    logins: I1PasswordLogin[],
    outputFile: string
) => {
    const titles = ['title', 'website', 'username', 'password', 'notes'];
    const writeStream = fs.createWriteStream(outputFile);
    writeStream.write(arrayToLine(titles));
    logins.forEach((login) => {
        writeStream.write(arrayToLine(Object.values(login)));
    });
};

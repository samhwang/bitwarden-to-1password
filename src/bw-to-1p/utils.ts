import path from 'path';
import fs from 'fs';
import { URL } from 'url';

/**
 * Get relative file path from the script calling this
 * @param filename The file name
 * @returns The relative path to the file
 */
export const getRelativeFilepath = (filename: string) =>
    path.join(__dirname, '..', filename);

/**
 * Detect if a file type is incorrect
 * @param filename
 * @param format
 */
export const isIncorrectFiletype = (filename: string, format: string) =>
    !filename.endsWith(format);

const SUPPORTED_FILETYPES = ['csv', 'json'];

/**
 * Detect if a file type is supported
 * @param format
 */
export const isUnsupportedFiletype = (format: string) =>
    !SUPPORTED_FILETYPES.includes(format);

/**
 * Output array to line
 * @param words Words to print out in a line
 */
export const arrayToLine = (words: string[]) => `${words.join(',')}\n`;

export interface IBitWardenLogin {
    name: string;
    notes: string;
    login_uri: string;
    login_username: string;
    login_password: string;
}

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
export const convertBWTo1P = (inputs: IBitWardenLogin[]): I1PasswordLogin[] =>
    inputs.map(
        ({ name, login_uri, login_username, login_password, notes }) => ({
            title: name,
            website: new URL(login_uri).host,
            username: login_username,
            password: login_password,
            notes,
        })
    );

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
    const titleLine = arrayToLine(titles);
    const toWrite = logins.reduce(
        (fileContent, login) =>
            `${fileContent}${arrayToLine(Object.values(login))}`,
        titleLine
    );
    fs.writeFileSync(outputFile, toWrite, { encoding: 'utf-8' });
};

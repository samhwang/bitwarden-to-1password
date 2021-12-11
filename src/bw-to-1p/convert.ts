import fs from 'fs';
import { parseCSV, parseJSON } from './parseInput';
import {
    arrayToLine,
    getRelativeFilepath,
    isIncorrectFiletype,
    isUnsupportedFiletype,
    ISupportedFileFormat,
} from './utils';

export interface IBitWardenLogin {
    name: string;
    notes: string;
    login_uri: string;
    login_username: string;
    login_password: string;
}

/**
 * Parse input base on file type
 * @param inputFile
 * @param fileFormat
 */
export const parseInput = <Format extends ISupportedFileFormat>(
    inputFile: string,
    fileFormat: Format
): IBitWardenLogin[] => {
    if (fileFormat === 'csv') {
        return parseCSV(inputFile);
    }

    return parseJSON(inputFile);
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
export const convertBWTo1P = (inputs: IBitWardenLogin[]): I1PasswordLogin[] =>
    inputs.map(
        ({ name, login_uri, login_username, login_password, notes }) => ({
            title: name,
            website: login_uri,
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

/**
 * End-to-end conversion process
 * @param inputFile The BitWarden export file
 * @param outputFile The 1Password compatible CSV
 * @param fileFormat File format: csv/json
 */
export const convert = (
    inputFile: string,
    outputFile: string,
    fileFormat: string
) => {
    if (isUnsupportedFiletype(fileFormat)) {
        throw new Error(`Unsupported file type: ${fileFormat}`);
    }

    if (isIncorrectFiletype(inputFile, fileFormat)) {
        throw new Error(`Incorrect file format: ${inputFile}, ${fileFormat}`);
    }

    console.log(`READING INPUT FILE: ${inputFile}`);
    const inputPath = getRelativeFilepath(inputFile);
    const BWLogins = parseInput(inputPath, fileFormat as ISupportedFileFormat);

    console.log(`CONVERTING TO 1PASSWORD LOGINS`);
    const onePassLogins = convertBWTo1P(BWLogins);

    console.log(`WRITING TO OUTPUT FILE: ${outputFile}`);
    write1PasswordCSV(onePassLogins, getRelativeFilepath(outputFile));

    console.log(`WRITE DONE!`);
};

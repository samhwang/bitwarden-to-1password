import { parseCSV, parseJSON } from './parseInput.ts';
import {
    arrayToLine,
    getRelativeFilepath,
    isIncorrectFiletype,
    isUnsupportedFiletype,
    ISupportedFileFormat,
} from './utils.ts';

export interface IBitWardenLogin {
    readonly name: string;
    readonly notes: string;
    readonly login_uri: string;
    readonly login_username: string;
    readonly login_password: string;
}

/**
 * Parse input base on file type
 */
export function parseInput<Format extends ISupportedFileFormat>(
    inputFile: string,
    fileFormat: Format,
): IBitWardenLogin[] {
    if (fileFormat === 'csv') {
        return parseCSV(inputFile);
    }

    return parseJSON(inputFile);
}

export interface I1PasswordLogin {
    readonly title: string;
    readonly website: string;
    readonly username: string;
    readonly password: string;
    readonly notes?: string;
}

/**
 * Converts BitWarden Login to 1Password Login
 */
export function convertBWTo1P({
    name,
    login_uri,
    login_username,
    login_password,
    notes,
}: IBitWardenLogin): I1PasswordLogin {
    return {
        title: name,
        website: login_uri,
        username: login_username,
        password: login_password,
        notes,
    };
}

/**
 * Export 1password logins into csv file
 */
export function write1PasswordCSV(
    logins: I1PasswordLogin[],
    outputFile: string,
) {
    const titles = ['title', 'website', 'username', 'password', 'notes'];
    const titleLine = arrayToLine(titles);
    const toWrite = logins.reduce(
        (fileContent, login) => `${fileContent}${arrayToLine(Object.values(login))}`,
        titleLine,
    );
    Deno.writeTextFileSync(outputFile, toWrite);
}

/**
 * End-to-end conversion process
 */
export function convert(
    inputFile: string,
    outputFile: string,
    fileFormat: string,
) {
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
    const onePassLogins = BWLogins.map(convertBWTo1P);

    console.log(`WRITING TO OUTPUT FILE: ${outputFile}`);
    const outputPath = getRelativeFilepath(outputFile);
    write1PasswordCSV(onePassLogins, outputPath);

    console.log(`WRITE DONE!`);
}

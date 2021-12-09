import fs from 'fs';
import path from 'path';

interface IBitwardenLogin {
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
        .readFileSync(path.join(__dirname, inputFile), {
            encoding: 'utf-8',
        })
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

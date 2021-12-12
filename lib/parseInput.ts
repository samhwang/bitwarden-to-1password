import fs from 'fs';
import type { IBitWardenLogin } from './convert';
import {
    BitWardenJSONExport,
    IBitWardenJSONExport,
} from './BitwardenJSONSchema';

/**
 * Parse CSV input file into an array of TS Records
 * @param inputFile Input file name
 * @returns The parsed array of records
 */
export const parseCSV = (inputFile: string): IBitWardenLogin[] => {
    const isEmptyLine = (line: string) => line.trim() === '';
    return fs
        .readFileSync(inputFile, { encoding: 'utf-8' })
        .split('\n')
        .slice(1)
        .reduce((accumulator: IBitWardenLogin[], currentLine) => {
            if (isEmptyLine(currentLine)) {
                return accumulator;
            }

            const attributes = currentLine.split(',');
            return [
                ...accumulator,
                {
                    name: attributes[3],
                    notes: attributes[4],
                    login_uri: attributes[7],
                    login_username: attributes[8],
                    login_password: attributes[9],
                },
            ];
        }, []);
};

/**
 * Parse JSON input file into an array of TS Records
 * @param inputFile Input file name
 * @returns The parsed array of records
 */
export const parseJSON = (inputFile: string): IBitWardenLogin[] => {
    const content = fs.readFileSync(inputFile, { encoding: 'utf-8' });
    const rawData = JSON.parse(content);
    const validateResult: IBitWardenJSONExport =
        BitWardenJSONExport.parse(rawData);

    const { encrypted } = validateResult;
    if (encrypted) {
        throw new Error(
            'Cannot work with encrypted JSON file. Please use an unencrypted export.'
        );
    }

    const { items } = validateResult;
    return items.reduce((accumulator, { name, notes, login }) => {
        const baseObject: Omit<IBitWardenLogin, 'login_uri'> = {
            name,
            notes: notes ?? '',
            login_username: login.username ?? '',
            login_password: login.password ?? '',
        };

        const { uris } = login;
        if (uris.length === 0) {
            return [
                ...accumulator,
                {
                    ...baseObject,
                    login_uri: '',
                },
            ];
        }

        return accumulator.concat(
            uris.map(({ uri }) => ({
                ...baseObject,
                login_uri: uri ?? '',
            }))
        );
    }, [] as IBitWardenLogin[]);
};

import type { IBitWardenLogin } from './convert.ts';
import { BitWardenJSONExport, IBitWardenJSONExport } from './BitwardenJSONSchema.ts';
import { isEmptyLine } from './utils.ts';

/**
 * Parse CSV input file into an array of TS Records
 */
export function parseCSV(inputFile: string): IBitWardenLogin[] {
    return Deno
        .readTextFileSync(inputFile)
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
}

/**
 * Parse JSON input file into an array of TS Records
 */
export function parseJSON(inputFile: string): IBitWardenLogin[] {
    const content = Deno.readTextFileSync(inputFile);
    const rawData = JSON.parse(content);
    const validateResult: IBitWardenJSONExport = BitWardenJSONExport.parse(rawData);

    const { encrypted } = validateResult;
    if (encrypted) {
        throw new Error(
            'Cannot work with encrypted JSON file. Please use an unencrypted export.',
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
            })),
        );
    }, [] as IBitWardenLogin[]);
}

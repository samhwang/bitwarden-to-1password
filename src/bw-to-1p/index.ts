import { parseCSVInput } from './parseCSV';
import { parseJSONInput } from './parseJSON';
import { IBitWardenLogin } from './utils';

export const parseInput = (
    inputFile: string,
    fileFormat: string
): IBitWardenLogin[] => {
    if (fileFormat === 'csv') {
        return parseCSVInput(inputFile);
    }

    return parseJSONInput(inputFile);
};

export * from './utils';
export * from './parseCSV';
export * from './parseJSON';

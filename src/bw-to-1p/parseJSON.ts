import fs from 'fs';
import {
    BitWardenJSONExport,
    IBitWardenJSONExport,
} from './BitwardenJSONSchema';
import { IBitWardenLogin } from './utils';

export const parseJSONInput = (inputFile: string): IBitWardenLogin[] => {
    const content = fs.readFileSync(inputFile, { encoding: 'utf-8' });
    const rawData = JSON.parse(content);
    const validateResult: IBitWardenJSONExport =
        BitWardenJSONExport.validateSync(rawData, {
            strict: true,
            stripUnknown: true,
        });
    if (!validateResult) {
        throw new Error('Bad JSON input');
    }

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

        if (!login.uris || login.uris.length === 0) {
            accumulator.push({
                ...baseObject,
                login_uri: '',
            });
            return accumulator;
        }

        return accumulator.concat(
            login.uris.map(({ uri }: { uri?: string }) => ({
                ...baseObject,
                login_uri: uri ?? '',
            }))
        );
    }, [] as IBitWardenLogin[]);
};

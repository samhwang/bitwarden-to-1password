import * as yup from 'yup';
import { Asserts } from 'yup';

const URISchema = yup
    .object()
    .shape({
        match: yup.string().nullable(),
        uri: yup.string().required(),
    })
    .required();

const BitWardenItem = yup
    .object()
    .required()
    .shape({
        name: yup.string().required(),
        notes: yup.string().nullable(),
        login: yup
            .object()
            .shape({
                username: yup.string().required(),
                password: yup.string().required(),
                uris: yup.array().of(URISchema).required(),
            })
            .required(),
    });

export const BitWardenJSONExport = yup
    .object()
    .required()
    .shape({
        encrypted: yup.boolean().required(),
        folders: yup.array().of(yup.string()),
        items: yup.array().of(BitWardenItem).required(),
    });

export type IBitWardenJSONExport = Asserts<typeof BitWardenJSONExport>;

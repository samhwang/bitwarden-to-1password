import { z } from './deps.ts';

const URISchema = z.object({
    match: z.union([z.string(), z.number()]).nullable(),
    uri: z.string().nullable(),
});

const BitWardenItem = z.object({
    name: z.string(),
    notes: z.string().nullable().optional(),
    login: z.object({
        username: z.string().nullish(),
        password: z.string().nullish(),
        uris: z.array(URISchema).optional(),
    }).optional(),
});

export const BitWardenJSONExport = z
    .object({
        encrypted: z.boolean(),
        folders: z.array(z.object({
            id: z.string(),
            name: z.string(),
        })),
        items: z.array(BitWardenItem),
    })
    .strip();

export type IBitWardenJSONExport = z.infer<typeof BitWardenJSONExport>;

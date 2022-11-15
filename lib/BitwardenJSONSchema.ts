import { z } from './dependencies.ts';

const URISchema = z.object({
    match: z.string().nullable(),
    uri: z.string().nullable(),
});

const BitWardenItem = z.object({
    name: z.string(),
    notes: z.string().optional(),
    login: z.object({
        username: z.string().nullish(),
        password: z.string().nullish(),
        uris: z.array(URISchema),
    }),
});

export const BitWardenJSONExport = z
    .object({
        encrypted: z.boolean(),
        folders: z.array(z.string()),
        items: z.array(BitWardenItem),
    })
    .strip();

export type IBitWardenJSONExport = z.infer<typeof BitWardenJSONExport>;

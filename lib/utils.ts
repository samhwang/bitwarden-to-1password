import { path } from './deps.ts';

/**
 * Get relative file path from the script calling this
 */
export function getRelativeFilepath(filename: string) {
    const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
    return path.join(__dirname, '..', filename);
}

/**
 * Detect if a file type is incorrect
 */
export function isIncorrectFiletype(filename: string, format: string) {
    return !filename.endsWith(format);
}

export enum SupportedFileFormat {
    csv = 'csv',
    json = 'json',
}
export type ISupportedFileFormat = keyof typeof SupportedFileFormat;

/**
 * Detect if a file type is supported
 */
export function isUnsupportedFiletype(
    format: string,
): format is SupportedFileFormat {
    return !(format in SupportedFileFormat);
}

/**
 * Output array to line
 */
export function arrayToLine(words: string[]) {
    words = words.map((w) => {
        // basic CSV escaping
        if (w.search(/["\n]/) !== -1) {
            return `"${w.replaceAll('"', '""')}"`;
        }
        return w;
    });
    return `${words.join(',')}\n`;
}

/**
 * Detect a line of text is empty or not
 */
export function isEmptyLine(line: string) {
    return line.trim() === '';
}

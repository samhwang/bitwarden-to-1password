import path from 'path';

/**
 * Get relative file path from the script calling this
 * @param filename The file name
 * @returns The relative path to the file
 */
export const getRelativeFilepath = (filename: string) =>
    path.join(__dirname, '..', filename);

/**
 * Detect if a file type is incorrect
 * @param filename
 * @param format
 */
export const isIncorrectFiletype = (filename: string, format: string) =>
    !filename.endsWith(format);

export enum SupportedFileFormat {
    csv = 'csv',
    json = 'json',
}
export type ISupportedFileFormat = keyof typeof SupportedFileFormat;

/**
 * Detect if a file type is supported
 * @param format The file format
 */
export const isUnsupportedFiletype = (
    format: string
): format is SupportedFileFormat => !(format in SupportedFileFormat);

/**
 * Output array to line
 * @param words Words to print out in a line
 */
export const arrayToLine = (words: string[]) => `${words.join(',')}\n`;

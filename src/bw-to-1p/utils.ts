import path from 'path';
import fs from 'fs';

/**
 * Get relative file path from the script calling this
 * @param filename The file name
 * @returns The relative path to the file
 */
export const getRelativeFilepath = (filename: string) =>
    path.join(__dirname, '..', filename);

/**
 * Output array to line
 * @param words Words to print out in a line
 */
export const arrayToLine = (words: string[]) => `${words.join(',')}\n`;

export interface I1PasswordLogin {
    title: string;
    website: string;
    username: string;
    password: string;
    notes?: string;
}

/**
 * Export 1password logins into csv file
 * @param logins 1Password login objects
 * @param outputFile Output file name
 */
export const write1PasswordCSV = (
    logins: I1PasswordLogin[],
    outputFile: string
) => {
    const titles = ['title', 'website', 'username', 'password', 'notes'];
    const writeStream = fs.createWriteStream(outputFile);
    writeStream.write(arrayToLine(titles));
    logins.forEach((login) => {
        writeStream.write(arrayToLine(Object.values(login)));
    });
};

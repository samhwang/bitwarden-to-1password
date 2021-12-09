import { Command } from 'commander';
import {
    isIncorrectFiletype,
    isUnsupportedFiletype,
    getRelativeFilepath,
    parseCSVInput,
    convertBWTo1P,
    write1PasswordCSV,
} from './bw-to-1p';

const program = new Command();
program
    .version('0.0.1', '-v', 'output current version')
    .name('bw-to-1p')
    .description('Convert BitWarden logins into valid 1Password CSVs')
    .option('-i, --input [input]', 'input file', 'input/sample.csv')
    .option('-o, --output [output]', 'output file', 'output/out.csv')
    .option('-f, --format [format]', 'file format: csv or json.', 'csv')
    .parse();

const {
    input: inputFile,
    output: outputFile,
    format: fileFormat,
} = program.opts();

try {
    if (isUnsupportedFiletype(fileFormat)) {
        throw new Error(`Unsupported file type: ${fileFormat}`);
    }

    if (isIncorrectFiletype(inputFile, fileFormat)) {
        throw new Error(`Incorrect file format: ${inputFile}, ${fileFormat}`);
    }

    console.log(`READING INPUT FILE: ${inputFile}`);
    const inputPath = getRelativeFilepath(inputFile);
    const BWLogins = parseCSVInput(inputPath);

    console.log(`CONVERTING TO 1PASSWORD LOGINS`);
    const onePassLogins = convertBWTo1P(BWLogins);

    console.log(`WRITING TO OUTPUT FILE: ${outputFile}`);
    write1PasswordCSV(onePassLogins, getRelativeFilepath(outputFile));

    console.log(`WRITE DONE!`);
    process.exit();
} catch (error: any) {
    console.error(`ENCOUNTERED ERROR: ${error}`);
    process.exit(1);
}

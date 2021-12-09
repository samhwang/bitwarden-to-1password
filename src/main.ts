import { Command } from 'commander';
import {
    getRelativeFilepath,
    parseCSVInput,
    convertBWCSVTo1P,
    write1PasswordCSV,
} from './bw-to-1p';

const program = new Command();
program
    .version('0.0.1', '-v', 'output current version')
    .name('bw-to-1p')
    .description('Convert BitWarden logins into valid 1Password CSVs')
    .option('-i, --input [input]', 'input file', 'input/sample.csv')
    .option('-o, --output [output]', 'output file', 'output/out.csv')
    .parse();

const { input: inputFile, output: outputFile } = program.opts();

try {
    console.log(`READING INPUT FILE: ${inputFile}`);
    const inputPath = getRelativeFilepath(inputFile);
    const BWLogins = parseCSVInput(inputPath);

    console.log(`CONVERTING TO 1PASSWORD LOGINS`);
    const onePassLogins = convertBWCSVTo1P(BWLogins);

    console.log(`WRITING TO OUTPUT FILE: ${outputFile}`);
    write1PasswordCSV(onePassLogins, getRelativeFilepath(outputFile));

    console.log(`WRITE DONE!`);
} catch (error: any) {
    console.error(`ENCOUNTERED ERROR: ${error}`);
}

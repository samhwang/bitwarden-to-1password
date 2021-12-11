import { Command } from 'commander';
import { convert } from './bw-to-1p';

const program = new Command();
program
    .version('0.0.1', '-v', 'output current version')
    .name('bw-to-1p')
    .description('Convert BitWarden logins into valid 1Password CSVs')
    .option('-i, --input [input]', 'input file', 'input/sample.csv')
    .option('-o, --output [output]', 'output file', 'output/out.csv')
    .option('-f, --format [format]', 'file format: csv or json.', 'csv')
    .parse();

const { input, output, format } = program.opts();

const main = () => {
    convert(input, output, format);
    process.exit();
};

main();

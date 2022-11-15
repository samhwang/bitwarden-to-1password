import { Denomander, Option } from '../lib/deps.ts';
import { convert } from '../lib/index.ts';

const program = new Denomander({
    app_name: 'bw-to-1p',
    app_description: 'Convert BitWarden logins into valid 1Password CSVs',
    app_version: '1.0.0',
});
program
    .command('convert', 'Convert BitWarden Logins into 1Password')
    .addOption(
        new Option({
            flags: '-i --input',
            description: 'input file',
            defaultValue: 'input/sample.csv',
        }),
        new Option({
            flags: '-o --output',
            description: 'output file',
            defaultValue: 'output/out.csv',
        }),
        new Option({
            flags: '-f --format',
            description: 'file format: csv or json',
            defaultValue: 'csv',
        }),
    )
    .action(({ input, output, format }: typeof program) => {
        convert(input, output, format);
    })
    .parse(Deno.args);

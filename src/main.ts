import { parseCSVInput, convertBWTo1P, write1PasswordCSV } from './bw-to-1p';

const input = '../input/sample.csv';
const output = '../output/test.csv';

const go = () => {
    const bwLogins = parseCSVInput(input);
    const onePassLogins = convertBWTo1P(bwLogins);
    write1PasswordCSV(onePassLogins, output);
};

go();

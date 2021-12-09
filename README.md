# Convert BitWarden vault export to 1Password accepted CSV

Inspired from [torshinalexey/bitwarden-to-1password-csv](https://github.com/torshinalexey/bitwarden-to-1password-csv).

This cli tool converts exported logins from [Bitwarden](https://bitwarden.com) to [1Password](https://1password.com)
compatible csv format.

## Usage Notes

- Login into BitWarden, and [export your vault into CSV format](https://bitwarden.com/help/article/export-your-data/#export-a-personal-vault)
  - Generally, you should be fine with CSVs
  - But if you're having troubles with multiple URLs, use JSON.
- Build the executable, and use the exported file as the input
- [Import the converted CSV output into 1Password](https://support.1password.com/import-1password-com/).

## Build the executable

```bash
git clone git@github.com:samhwang/bitwarden-to-1password.git
cd bitwarden-to-1password
npm run build
node build/bw-to-1p.js
```

## Options

```text
Usage: bw-to-1p [options]

Convert BitWarden logins into valid 1Password CSVs

Options:
  -v                     output current version
  -i, --input [input]    input file (default: "input/sample.csv")
  -o, --output [output]  output file (default: "output/out.csv")
  -h, --help             display help for command
```

## Example

```bash
node build/bw-to-1p.js -i input/bitwarden.csv -o output/1password.csv
```

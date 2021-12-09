# Convert BitWarden vault export to 1Password accepted CSV

Inspired from [torshinalexey/bitwarden-to-1password-csv](https://github.com/torshinalexey/bitwarden-to-1password-csv).

This cli tool converts exported logins from [BitWarden](https://bitwarden.com) to [1Password](https://1password.com)
compatible csv format.

## Prerequisites

- Node 14+
- NPM 7+

## Usage Notes

- Login into BitWarden, and [export your vault into CSV format](https://bitwarden.com/help/article/export-your-data/#export-a-personal-vault)
  - Generally, you should be fine with CSVs
  - But if you're having troubles with multiple URLs, use JSON.
  - Encrypted JSON files are **NOT** supported.
- Build the nodejs bundle, and use the exported file as the input
- [Import the converted CSV output into 1Password](https://support.1password.com/import-1password-com/).

## Build the NodeJS bundle

```bash
git clone https://github.com/samhwang/bitwarden-to-1password.git
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
  -f, --format [format]  file format: csv or json. (default: "csv")
  -h, --help             display help for command
```

## Example

```bash
node build/bw-to-1p.js -i input/bitwarden.csv -o output/1password.csv -f csv
```

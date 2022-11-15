# Convert BitWarden vault export to 1Password accepted CSV

Inspired from [torshinalexey/bitwarden-to-1password-csv](https://github.com/torshinalexey/bitwarden-to-1password-csv).

This cli tool converts exported logins from [BitWarden](https://bitwarden.com) to [1Password](https://1password.com)
compatible csv format.

## Usage Notes

- Login into BitWarden, and [export your vault into CSV format](https://bitwarden.com/help/article/export-your-data/#export-a-personal-vault)
  - For most use cases, you should be fine with CSVs
  - But if you're having troubles with multiple URLs per login, use JSON.
  - Encrypted JSON files are **NOT** supported.
- Build the executable, and use the exported file as the input
- [Import the converted CSV output into 1Password](https://support.1password.com/import-1password-com/).

## Prerequisites

- Deno 1.27+

## Build the executable

```bash
git clone https://github.com/samhwang/bitwarden-to-1password.git
cd bitwarden-to-1password
deno task compile
```

## Run the script

Run the script after compiling.

```bash
./build/bw-to-1p convert -i path/to/input -f format -o path/to/output
```

## Options

```text
Command Usage:
convert {options}

Description:
Convert BitWarden Logins into 1Password

Options:
-f, --format file format: csv or json.	(default: csv)
-h --help    Help Screen
-i, --input  input file	(default: input/sample.csv)
-o, --output output file	(default: output/out.csv)
```

## Example

Converting a CSV file

```bash
./build/bw-to-1p convert -i input/bitwarden.csv -o output/1password.csv
```

Converting a JSON file

```bash
./build/bw-to-1p convert -i input/bitwarden.json -o output/1password.csv -f json
```

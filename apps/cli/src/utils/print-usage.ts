export function printUsage() {
  console.log(
    `
Usage:
  console-look [options] -- <command>

Options:
  -t, --title <string>     Title for this run
  --no-stream              Don't stream logs live (default: false)
  -h, --help               Show this help message

Example:
  console-look -t "Local tests" -- npm test
`.trim()
  );
}

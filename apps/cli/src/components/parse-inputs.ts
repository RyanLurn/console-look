import { DEFAULT_OPTIONS, DELIMITER } from "#utils/constants";
import { printUsage } from "#utils/print-usage";
import { parseArgs } from "util";

export function parseInputs() {
  const args = Bun.argv.slice(2);
  const delimiterIndex = args.indexOf(DELIMITER);

  if (delimiterIndex === -1) {
    return {
      command: [...args],
      options: DEFAULT_OPTIONS,
    };
  }

  try {
    return {
      command: args.slice(delimiterIndex + 1),
      options: parseOptions(args.slice(0, delimiterIndex)),
    };
  } catch (err) {
    handleCliError(err);
    process.exit(1);
  }
}

function parseOptions(cliArgs: string[]) {
  const { values } = parseArgs({
    args: cliArgs,
    options: {
      title: { type: "string", short: "t" },
      stream: { type: "boolean", short: "s", default: DEFAULT_OPTIONS.stream },
    },
    strict: true,
    allowPositionals: true,
  });

  return values;
}

function handleCliError(err: unknown) {
  if (err instanceof Error) {
    console.error(`❌ ${err.message}\n`);
  } else {
    console.error("❌ Invalid command-line arguments\n");
  }

  printUsage();
}

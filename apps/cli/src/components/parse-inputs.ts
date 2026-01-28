import { DELIMITER } from "#utils/constants";
import { printUsage } from "#utils/print-usage";
import { DEFAULT_CLI_OPTIONS } from "@console-look/validators/constants";
import { parseArgs } from "util";

export function parseInputs() {
  const args = Bun.argv.slice(2);
  const delimiterIndex = args.indexOf(DELIMITER);

  if (delimiterIndex === -1) {
    const command = [...args];

    if (
      command.length === 1 &&
      (command[0] === "--help" || command[0] === "-h")
    ) {
      printUsage();
      process.exit(0);
    }

    return {
      command,
      options: DEFAULT_CLI_OPTIONS,
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
      stream: {
        type: "boolean",
        short: "s",
        default: DEFAULT_CLI_OPTIONS.stream,
      },
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

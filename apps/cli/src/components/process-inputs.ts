import type { parseInputs } from "#components/parse-inputs";
import { printUsage } from "#utils/print-usage";

export function processInputs({
  command,
  options,
}: ReturnType<typeof parseInputs>) {
  if (command.length === 0) {
    console.error("No command specified\n");
    printUsage();
    process.exit(1);
  }

  if (
    command.length === 1 &&
    (command[0] === "--help" || command[0] === "-h")
  ) {
    printUsage();
    process.exit(0);
  }

  return {
    command,
    options,
  };
}

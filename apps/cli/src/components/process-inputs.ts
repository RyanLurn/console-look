import type { parseInputs } from "#components/parse-inputs";
import { printUsage } from "#utils/print-usage";
import { CliInputsSchema } from "@console-look/validators/cli-inputs";
import { prettifyError } from "zod";

export function processInputs({
  command,
  options,
}: ReturnType<typeof parseInputs>) {
  if (
    command.length === 1 &&
    (command[0] === "--help" || command[0] === "-h")
  ) {
    printUsage();
    process.exit(0);
  }

  const validationResult = CliInputsSchema.safeParse({ command, options });

  if (!validationResult.success) {
    console.error(prettifyError(validationResult.error));
    console.log();
    printUsage();
    process.exit(1);
  }

  return validationResult.data;
}

import type { parseInputs } from "#components/parse-inputs";
import { printUsage } from "#utils/print-usage";
import { CliInputsSchema } from "@console-look/validators/cli-inputs";
import { prettifyError } from "zod";

export function validateInputs(inputs: ReturnType<typeof parseInputs>) {
  const validationResult = CliInputsSchema.safeParse(inputs);

  if (!validationResult.success) {
    console.error(prettifyError(validationResult.error));
    console.log();
    printUsage();
    process.exit(1);
  }

  return validationResult.data;
}

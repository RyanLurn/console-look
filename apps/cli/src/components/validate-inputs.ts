import type { parseInputs } from "#components/parse-inputs";
import { printUsage } from "#utils/print-usage";
import { CliInputsSchema } from "@console-look/validators/cli-inputs";
import { printIssues } from "@console-look/validators/print-issues";

export function validateInputs(inputs: ReturnType<typeof parseInputs>) {
  const validationResult = CliInputsSchema.safeParse(inputs);

  if (!validationResult.success) {
    printIssues(validationResult.error);
    console.log();
    printUsage();
    process.exit(1);
  }

  return validationResult.data;
}

import { parseInputs } from "#components/parse-inputs";
import { processInputs } from "#components/process-inputs";

const { command, options } = parseInputs();

const processedInputs = processInputs({ command, options });

console.log("Processed inputs:", processedInputs);

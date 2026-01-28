import { parseInputs } from "#components/parse-inputs";
import { validateInputs } from "#components/validate-inputs";

const { command, options } = parseInputs();
console.log("Options:", options);

const processedInputs = validateInputs({ command, options });

console.log("Processed inputs:", processedInputs);

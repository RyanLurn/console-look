import { parseInputs } from "#components/parse-inputs";
import { validateInputs } from "#components/validate-inputs";
import { runCommand } from "#components/run-command";

const inputs = parseInputs();

const validInputs = validateInputs(inputs);

await runCommand(validInputs.command);

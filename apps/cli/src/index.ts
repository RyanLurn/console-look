import { parseInputs } from "#components/parse-inputs";
import { validateInputs } from "#components/validate-inputs";
import { createSession } from "#components/create-session";

const inputs = parseInputs();

const validInputs = validateInputs(inputs);

const sessionId = await createSession(validInputs);
console.log(sessionId);

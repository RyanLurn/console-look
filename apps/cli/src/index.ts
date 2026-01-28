import { parseInputs } from "#components/parse-inputs";

const { command, options } = parseInputs();

console.log("Command:", command);
console.log("Options:", options);

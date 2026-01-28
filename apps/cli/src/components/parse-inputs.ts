import { DELIMITER } from "#utils/constants";
import { parseArgs } from "util";

export function parseInputs() {
  const args = Bun.argv.slice(2);
  const delimiterIndex = args.indexOf(DELIMITER);

  if (delimiterIndex === -1) {
    const command = [...args];
    return {
      command,
      options: {},
    };
  } else {
    const command = args.slice(delimiterIndex + 1);
    return {
      command,
      options: parseOptions(args.slice(0, delimiterIndex)),
    };
  }
}

function parseOptions(cliArgs: string[]) {
  const { values } = parseArgs({
    args: cliArgs,
    options: {
      help: { type: "boolean", short: "h", default: false },
      title: { type: "string", short: "t" },
      stream: { type: "boolean", short: "s", default: true },
    },
    strict: true,
    allowPositionals: true,
  });

  return values;
}

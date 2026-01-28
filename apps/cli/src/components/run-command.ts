import { readStream } from "#utils/read-stream";

export async function runCommand(command: string[]) {
  const proccess = Bun.spawn({
    cmd: command,
    cwd: process.cwd(),
    env: process.env,
    stdin: "inherit",
    stdout: "pipe",
    stderr: "pipe",
  });

  readStream(proccess.stdout, (chunk) => {
    process.stdout.write(chunk);
  });

  readStream(proccess.stderr, (chunk) => {
    process.stderr.write(chunk);
  });

  const exitCode = await proccess.exited;

  process.exit(exitCode);
}

import { readStream } from "#utils/read-stream";

export async function runCommand(command: string[]) {
  const subprocess = Bun.spawn({
    cmd: command,
    cwd: process.cwd(),
    env: process.env,
    stdin: "inherit",
    stdout: "pipe",
    stderr: "pipe",
  });

  process.on("SIGINT", () => {
    subprocess.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    subprocess.kill("SIGTERM");
  });

  readStream(subprocess.stdout, (chunk) => {
    process.stdout.write(chunk);
  });

  readStream(subprocess.stderr, (chunk) => {
    process.stderr.write(chunk);
  });

  const exitCode = await subprocess.exited;

  process.exit(exitCode);
}

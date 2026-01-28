export function runCommand(command: string[]) {
  const proccess = Bun.spawn({
    cmd: command,
    cwd: process.cwd(),
    env: process.env,
    stdin: "inherit",
    stdout: "pipe",
    stderr: "pipe",
  });

  return proccess;
}

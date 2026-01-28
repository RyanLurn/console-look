import type { ZodError } from "zod";

export function printIssues(error: ZodError) {
  for (const issue of error.issues) {
    console.error(issue.message);
  }
}

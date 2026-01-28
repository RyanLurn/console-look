import { DEFAULT_CLI_OPTIONS, MAX_TITLE_LENGTH } from "#utils/constants";
import * as z from "zod";

export const TitleOptionSchema = z
  .string()
  .trim()
  .min(1, { error: "Title cannot be empty" })
  .max(MAX_TITLE_LENGTH, {
    error: (issues) => {
      return `Title is too long (${issues.input?.length} characters). Maximum allowed is ${MAX_TITLE_LENGTH}.`;
    },
  });

export const CliOptionsSchema = z.object({
  title: TitleOptionSchema.optional(),
  "no-stream": z.boolean().default(DEFAULT_CLI_OPTIONS["no-stream"]),
});

export type CliOptions = z.infer<typeof CliOptionsSchema>;

export const CliInputsSchema = z.object({
  command: z.array(z.string()).min(1, { error: "Command is required" }),
  options: CliOptionsSchema,
});

export type CliInputs = z.infer<typeof CliInputsSchema>;

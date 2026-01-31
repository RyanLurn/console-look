import type { Branded } from "@console-look/types/brand";
import * as z from "zod";

const MAX_TITLE_LENGTH = 120;

export const ChunkIdSchema = z.custom<Branded<string, "ChunkId">>((value) => {
  const validationResult = z.uuidv7().safeParse(value);
  if (!validationResult.success) {
    return false;
  }
  return true;
});
export const ChunkSchema = z.object({
  text: z.string(),
  seq: z.int().positive(), // Stand for "sequence number"
  channel: z.enum(["stdout", "stderr"]),
  timestamp: z.int().positive(),
});
export type Chunk = z.infer<typeof ChunkSchema>;

export const RunIdSchema = z.custom<Branded<string, "RunId">>((value) => {
  const validationResult = z.uuidv7().safeParse(value);
  if (!validationResult.success) {
    return false;
  }
  return true;
});
export const RunSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title cannot be empty" })
    .max(MAX_TITLE_LENGTH, {
      error: (issues) => {
        return `Title is too long (${issues.input?.length} characters). Maximum allowed is ${MAX_TITLE_LENGTH}.`;
      },
    }),
  command: z.string().trim().min(1, { error: "Command cannot be empty" }),
  status: z.enum(["running", "finished"]),
  chunks: z.record(ChunkIdSchema, ChunkSchema),
  timestamp: z.int().positive(),
});
export type Run = z.infer<typeof RunSchema>;

export const DatabaseSchema = z.record(RunIdSchema, RunSchema);
export type Database = z.infer<typeof DatabaseSchema>;

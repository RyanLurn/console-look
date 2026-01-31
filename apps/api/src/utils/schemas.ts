import type { Branded } from "@console-look/types/brand";
import * as z from "zod";

const MAX_TITLE_LENGTH = 120;

export type ChunkId = Branded<string, "ChunkId">;
export const ChunkSchema = z.object({
  id: z.custom<ChunkId>((value) => {
    const validationResult = z.uuidv7().safeParse(value);
    if (!validationResult.success) {
      return false;
    }
    return true;
  }),
  text: z.string(),
  seq: z.int().positive(), // Stand for "sequence number"
  channel: z.enum(["stdout", "stderr"]),
  timestamp: z.int().positive(),
});
export type Chunk = z.infer<typeof ChunkSchema>;

export type RunId = Branded<string, "RunId">;
export const RunSchema = z.object({
  id: z.custom<RunId>((value) => {
    const validationResult = z.string().safeParse(value);
    if (!validationResult.success) {
      return false;
    }
    return true;
  }),
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
  chunks: z.array(ChunkSchema),
  timestamp: z.int().positive(),
});
export type Run = z.infer<typeof RunSchema>;

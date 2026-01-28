import { CliInputsSchema } from "#cli-inputs";
import * as z from "zod";

export const SessionIdSchema = z.uuidv7().brand<"SessionId">();

export const SessionSchema = z.object({
  ...CliInputsSchema.shape,
  id: SessionIdSchema,
  status: z.enum(["running", "finished", "crashed"]),
  exitCode: z.number().optional(),
  timestamp: z.number().positive(),
});

export type Session = z.infer<typeof SessionSchema>;

export const ChunkMetadataSchema = z.object({
  sessionId: SessionIdSchema,
  sequenceNumber: z.number().positive(),
  channel: z.enum(["stdout", "stderr"]),
  filePath: z.string(),
  timestamp: z.number().positive(),
});

export type ChunkMetadata = z.infer<typeof ChunkMetadataSchema>;

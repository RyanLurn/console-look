import { db } from "#connect";
import { chunkTable } from "#schema";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

export const InsertChunkInputSchema = createInsertSchema(chunkTable);

export type InsertChunkInput = z.infer<typeof InsertChunkInputSchema>;

export const InsertChunkOutputSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), chunkId: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

export type InsertChunkOutput = z.infer<typeof InsertChunkOutputSchema>;

export async function insertChunk(chunk: InsertChunkInput) {
  try {
    const insertResult = await db
      .insert(chunkTable)
      .values(chunk)
      .returning({ chunkId: chunkTable.id });

    if (insertResult.length === 1 && insertResult[0]) {
      const firstResult = insertResult[0];
      return { success: true, chunkId: firstResult.chunkId };
    }

    return { success: false, error: "Failed to insert chunk" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to insert chunk" };
  }
}

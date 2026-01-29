import { db } from "#connect";
import { chunkTable, type ChunkId } from "#schema";
import * as z from "zod";

export type InsertChunkInput = typeof chunkTable.$inferInsert;

export const InsertChunkOutputSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), chunkId: z.string<ChunkId>() }),
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

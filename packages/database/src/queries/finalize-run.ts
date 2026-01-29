import { db } from "#connect";
import { runTable } from "#schema";
import type { RunId } from "#schema";
import { eq } from "drizzle-orm";
import * as z from "zod";

export const FinalizeRunInputSchema = z.object({
  runId: z.string<RunId>(),
  status: z.enum(["finished", "crashed"]),
  exitCode: z.number(),
});

export type FinalizeRunInput = z.infer<typeof FinalizeRunInputSchema>;

export const FinalizeRunOutputSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.undefined(),
  }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

export type FinalizeRunOutput = z.infer<typeof FinalizeRunOutputSchema>;

export async function finalizeRun({
  runId,
  status,
  exitCode,
}: FinalizeRunInput) {
  try {
    await db
      .update(runTable)
      .set({ status, exitCode })
      .where(eq(runTable.id, runId));

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to finalize run" };
  }
}

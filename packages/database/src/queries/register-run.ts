import { db } from "#connect";
import { runTable } from "#schema";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

export const RegisterRunInputSchema = createInsertSchema(runTable);

export type RegisterRunInput = z.infer<typeof RegisterRunInputSchema>;

export const RegisterRunOutputSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), runId: z.string() }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

export type RegisterRunOutput = z.infer<typeof RegisterRunOutputSchema>;

export async function registerRun(
  run: RegisterRunInput
): Promise<RegisterRunOutput> {
  try {
    const insertResult = await db
      .insert(runTable)
      .values(run)
      .returning({ runId: runTable.id });

    if (insertResult.length === 1 && insertResult[0]) {
      const firstResult = insertResult[0];
      return { success: true, runId: firstResult.runId };
    }

    return { success: false, error: "Failed to register run" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to register run" };
  }
}

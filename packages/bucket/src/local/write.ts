import { LOCAL_BUCKET_PATH } from "#utils/constants";
import { join } from "node:path";
import * as z from "zod";

export const WriteChunkToLocalBucketInputSchema = z.object({
  data: z.instanceof(Uint8Array),
  runId: z.string(),
  sequenceNumber: z.int().positive(),
});

export type WriteChunkToLocalBucketInput = z.infer<
  typeof WriteChunkToLocalBucketInputSchema
>;

export const WriteChunkToLocalBucketOutputSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.object({
        filePath: z.string(),
      }),
    }),
    z.object({ success: z.literal(false), error: z.string() }),
  ]
);

export type WriteChunkToLocalBucketOutput = z.infer<
  typeof WriteChunkToLocalBucketOutputSchema
>;

export async function writeChunkToLocalBucket({
  data,
  runId,
  sequenceNumber,
}: WriteChunkToLocalBucketInput): Promise<WriteChunkToLocalBucketOutput> {
  try {
    const compressedData = await Bun.zstdCompress(data);

    const filePath = join(LOCAL_BUCKET_PATH, runId, `${sequenceNumber}.zstd`);

    await Bun.write(filePath, compressedData);

    return { success: true, data: { filePath } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to write chunk to local bucket" };
  }
}

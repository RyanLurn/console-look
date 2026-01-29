import * as z from "zod";

export const ReadChunkFromLocalBucketInputSchema = z.object({
  filePath: z.string(),
});

export type ReadChunkFromLocalBucketInput = z.infer<
  typeof ReadChunkFromLocalBucketInputSchema
>;

export const ReadChunkFromLocalBucketOutputSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.instanceof(Uint8Array),
    }),
    z.object({ success: z.literal(false), error: z.string() }),
  ]
);

export type ReadChunkFromLocalBucketOutput = z.infer<
  typeof ReadChunkFromLocalBucketOutputSchema
>;

export async function readChunkFromLocalBucket({
  filePath,
}: ReadChunkFromLocalBucketInput): Promise<ReadChunkFromLocalBucketOutput> {
  try {
    const chunkFile = Bun.file(filePath);

    if (!(await chunkFile.exists())) {
      return {
        success: false,
        error: "Chunk data does not exist in local bucket",
      };
    }

    const compressedChunkData = await chunkFile.bytes();

    const decompressedChunkData = await Bun.zstdDecompress(compressedChunkData);

    const chunkData = new Uint8Array(decompressedChunkData);

    return { success: true, data: chunkData };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to read chunk from local bucket" };
  }
}

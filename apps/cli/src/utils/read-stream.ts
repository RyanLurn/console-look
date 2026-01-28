export async function readStream(
  stream: ReadableStream<Uint8Array<ArrayBuffer>>,
  onChunk: (chunk: Uint8Array<ArrayBuffer>) => void
) {
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    onChunk(value);
  }
}

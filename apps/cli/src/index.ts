async function uploadStream({ name }: { name: string }) {
  const encoder = new TextEncoder();

  // Create a streaming body
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 50; i++) {
        const chunk = `${name}'s log line ${i}\n`;
        console.log(`${name} sending:`, chunk.trim());

        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 400)); // simulate real-time logs
      }

      controller.close();
    },
  });

  await fetch("http://localhost:3000/ingest", {
    method: "POST",
    body: stream, // <-- THIS triggers chunked transfer
    headers: {
      "Content-Type": "text/plain",
    },
  });

  console.log(`${name}: done`);
}

await uploadStream({ name: "Alice" });

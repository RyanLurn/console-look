const encoder = new TextEncoder();

// Create a streaming body
const stream = new ReadableStream({
  async start(controller) {
    for (let i = 1; i <= 20; i++) {
      const chunk = `log line ${i}\n`;
      console.log("sending:", chunk.trim());

      controller.enqueue(encoder.encode(chunk));
      await new Promise((r) => setTimeout(r, 500)); // simulate real-time logs
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

console.log("done");

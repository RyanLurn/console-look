import { cache } from "#cache";
import { API_SERVER_PORT } from "#utils/constants";
import type { Serve } from "bun";

const subscribers = new Set<(chunk: Uint8Array) => void>();

export const serveOptions: Serve.Options<undefined> = {
  port: API_SERVER_PORT,
  idleTimeout: 60,
  routes: {
    "/health": new Response("OK"),
    "/ingest": {
      POST: async (req) => {
        console.log("Ingest connected");

        if (!(req.body instanceof ReadableStream)) {
          return new Response("No body", { status: 400 });
        }

        const reader = req.body.getReader();

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          // Fanout immediately
          for (const sub of subscribers) {
            sub(value);
          }
        }

        console.log("Ingest disconnected");
        return new Response("OK");
      },
    },

    "/consume": {
      GET: () => {
        console.log("Consumer connected");

        const stream = new ReadableStream({
          start(controller) {
            const handler = (chunk: Uint8Array) => controller.enqueue(chunk);
            subscribers.add(handler);

            return () => {
              subscribers.delete(handler);
              console.log("Consumer disconnected");
            };
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain",
            "Transfer-Encoding": "chunked",
          },
        });
      },
    },
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
};

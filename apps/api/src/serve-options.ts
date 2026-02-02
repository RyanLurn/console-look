import { API_SERVER_PORT } from "#utils/constants";
import type { Serve } from "bun";

const consumer: {
  enqueue: (chunk: Uint8Array) => void;
  close: () => void;
} = {
  enqueue: () => {},
  close: () => {},
};

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
            consumer.close();
            break;
          }

          // Fanout immediately
          consumer.enqueue(value);
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
            consumer.enqueue = (chunk: Uint8Array) => controller.enqueue(chunk);
            consumer.close = () => {
              console.log("Consumer disconnected");
              controller.close();
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

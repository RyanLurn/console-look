import { cache } from "#cache";
import { API_SERVER_PORT } from "#utils/constants";
import type { Serve } from "bun";

export const serveOptions: Serve.Options<undefined> = {
  port: API_SERVER_PORT,
  routes: {
    "/health": new Response("OK"),
    "/ingest": {
      POST: async (request) => {
        console.log("Client connected");

        if (request.body instanceof ReadableStream) {
          cache.isDone = false;
          cache.logs.clear();

          const reader = request.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              cache.isDone = true;
              break;
            }

            const text = decoder.decode(value);
            cache.logs.add(text);
          }

          console.log("\nClient disconnected");

          return new Response("OK");
        }

        return new Response("Request body is required", { status: 400 });
      },
    },
    "/consume": {
      GET: async () => {
        const sentLogs = new Set<string>();

        const stream = new ReadableStream({
          type: "direct",
          pull(controller) {
            while (!cache.isDone) {
              const newLogs = cache.logs.difference(sentLogs);

              for (const log of newLogs) {
                controller.write(log);
                sentLogs.add(log);
              }
            }

            controller.close();
          },
        });

        return new Response(stream);
      },
    },
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
};

import { cache } from "#cache";
import {
  ChunkSchema,
  ChunksSchema,
  RunIdSchema,
  RunSchema,
  type RunId,
} from "#utils/schemas";
import * as z from "zod";

const WebSocketDataSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("publisher"),
    runId: RunIdSchema,
    run: RunSchema,
  }),
  z.object({
    role: z.literal("subscriber"),
    runId: RunIdSchema,
  }),
]);

type WebSocketData = z.infer<typeof WebSocketDataSchema>;

const server = Bun.serve({
  routes: {
    "/ws/publisher/:runId": async (request, server) => {
      const { runId } = request.params;
      const validateRunIdResult = RunIdSchema.safeParse(runId);
      if (!validateRunIdResult.success) {
        return new Response("Invalid run ID", { status: 400 });
      }

      const body = await request.json();
      const validateRunResult = RunSchema.safeParse(body);
      if (!validateRunResult.success) {
        return new Response("Invalid request", { status: 400 });
      }

      const websocketData: WebSocketData = {
        role: "publisher",
        runId: validateRunIdResult.data,
        run: validateRunResult.data,
      };

      if (server.upgrade(request, { data: websocketData })) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    },
  },
  websocket: {
    data: {} as WebSocketData,
    open: (ws) => {
      if (ws.data.role === "publisher") {
        console.log("A wild publisher appeared!");
        cache.set(ws.data.runId, ws.data.run);
      } else {
        console.log("A wild subscriber appeared!");
        ws.subscribe(ws.data.runId);
      }
    },
    message: (ws, message) => {
      if (ws.data.role === "publisher") {
        const jsonMessage = JSON.parse(message.toString());

        const validateChunksResult = z
          .object({ chunks: z.array(ChunkSchema) })
          .safeParse(jsonMessage);
        if (!validateChunksResult.success) {
          ws.send(JSON.stringify({ error: "Invalid message" }));
          return;
        }
        const { chunks } = validateChunksResult.data;

        if (!cache.has(ws.data.runId)) {
          ws.send(JSON.stringify({ error: "Run not found" }));
          return;
        }

        const run = cache.get(ws.data.runId)!;
        run.chunks = { ...run.chunks, ...chunks };
        cache.set(ws.data.runId, run);
      }
    },
    close: (ws, code, message) => {
      console.log("Client disconnected");
    },
  },
});

console.log(`API server is running at ${server.url}`);

import { printIssues } from "@console-look/validators/print-issues";
import {
  registerRun,
  RegisterRunInputSchema,
} from "@console-look/database/queries/register-run";
import { InsertChunkInputSchema } from "@console-look/database/queries/insert-chunk";

const server = Bun.serve({
  routes: {
    "/": new Response("OK"),
    "/runs": {
      POST: async (request) => {
        const requestBody = await request.json();

        const validationResult = RegisterRunInputSchema.safeParse(requestBody);

        if (!validationResult.success) {
          printIssues(validationResult.error);
          return new Response("Invalid request", { status: 400 });
        }

        const registerRunResult = await registerRun(validationResult.data);

        if (!registerRunResult.success) {
          return new Response(registerRunResult.error, { status: 500 });
        }

        return Response.json({ runId: registerRunResult.data.runId });
      },
    },
    "/runs/:id/chunks": {
      POST: async (request) => {
        const { id } = request.params;

        const sequenceNumber = parseInt(
          request.headers.get("x-sequence-number") || "0"
        );

        return Response.json({ success: true });
      },
    },
  },

  fetch(_req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);

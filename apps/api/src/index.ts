import { DATABASE_DIRECTORY } from "#utils/constants";
import { SessionSchema } from "@console-look/validators/database-schema";
import { printIssues } from "@console-look/validators/print-issues";
import { join } from "node:path";

const server = Bun.serve({
  routes: {
    "/": new Response("OK"),
    "/session": {
      POST: async (request) => {
        const body = await request.json();

        const validationResult = SessionSchema.omit({ id: true }).safeParse(
          body
        );

        if (!validationResult.success) {
          printIssues(validationResult.error);
          return new Response("Invalid request", { status: 400 });
        }

        const session = {
          ...validationResult.data,
          id: Bun.randomUUIDv7(),
        };

        await Bun.write(
          join(DATABASE_DIRECTORY, "sessions", `${session.id}.json`),
          JSON.stringify(session, null, 2)
        );

        return Response.json({ sessionId: session.id });
      },
    },
  },

  fetch(_req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);

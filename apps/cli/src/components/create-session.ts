import type { CliInputs } from "@console-look/validators/cli-inputs";
import type { Session } from "@console-look/validators/database-schema";
import * as z from "zod";

export async function createSession(inputs: CliInputs) {
  const session: Omit<Session, "id"> = {
    ...inputs,
    status: "running",
    timestamp: Date.now(),
  };

  const response = await fetch(`http://localhost:3000/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  const data = await response.json();

  const { sessionId } = z.object({ sessionId: z.string() }).parse(data);
  return sessionId;
}

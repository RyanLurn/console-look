import { env } from "#utils/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/migrations",
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.LOCAL_DB_FILE_PATH,
  },
});

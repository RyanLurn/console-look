import { env } from "#utils/env";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const db = drizzle(env.LOCAL_DB_FILE_PATH);

import { sql } from "drizzle-orm";

export const jsDateInSQLite = sql`(unixepoch('now', 'subsec') * 1000)`;

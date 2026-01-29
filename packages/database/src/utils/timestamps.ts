import { jsDateInSQLite } from "#utils/js-date";
import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(jsDateInSQLite),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(jsDateInSQLite)
    .$onUpdate(() => new Date()),
};

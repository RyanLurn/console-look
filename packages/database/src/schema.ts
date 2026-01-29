import { timestamps } from "#utils/timestamps";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const runTable = sqliteTable("runs", {
  id: text("id")
    .primaryKey()
    .$default(() => Bun.randomUUIDv7()),
  title: text("title"),
  noStream: integer({ mode: "boolean" }).notNull().default(false),
  command: text("command").notNull(),
  status: text("status", { enum: ["running", "finished", "crashed"] })
    .notNull()
    .default("running"),
  exitCode: integer("exit_code"),
  clientTimestamp: integer("client_timestamp").notNull(),
  ...timestamps,
});

export const chunkTable = sqliteTable("chunks", {
  id: text("id")
    .primaryKey()
    .$default(() => Bun.randomUUIDv7()),
  runId: text("run_id")
    .notNull()
    .references(() => runTable.id),
  sequenceNumber: integer("sequence_number").notNull(),
  channel: text("channel", { enum: ["stdout", "stderr"] }).notNull(),
  filePath: text("file_path").notNull(),
  clientTimestamp: integer("client_timestamp").notNull(),
  ...timestamps,
});

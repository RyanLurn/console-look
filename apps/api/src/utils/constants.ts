import { join } from "node:path";

export const DATABASE_DIRECTORY = join(import.meta.dir, "..", "database");
export const STORAGE_DIRECTORY = join(import.meta.dir, "..", "storage");

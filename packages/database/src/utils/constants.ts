import { join } from "node:path";

export const LOCAL_DB_FILE_PATH = join(
  import.meta.dir,
  "..",
  "..",
  "local-db.sqlite"
);

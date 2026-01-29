import { join } from "node:path";

export const LOCAL_BUCKET_PATH = join(
  import.meta.dir,
  "..",
  "..",
  "local-bucket"
);

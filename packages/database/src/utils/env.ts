import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    LOCAL_DB_FILE_PATH: z.string().min(1),
  },
  runtimeEnv: process.env,
});

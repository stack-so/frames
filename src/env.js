import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    STACK_API_KEY: z.string(),
    STACK_POINTS_ID: z.string(),
  },
  client: {
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    STACK_API_KEY: process.env.STACK_API_KEY,
    STACK_POINTS_ID: process.env.STACK_POINTS_ID
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

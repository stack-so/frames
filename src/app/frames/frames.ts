/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createFrames } from "frames.js/next";
import { env } from "~/env";
 
export const frames = createFrames({
  baseUrl: new URL(env.BASE_URL),
  basePath: "/frames",
});
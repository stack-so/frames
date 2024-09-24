/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createFrames } from "frames.js/next";
import { env } from "~/env";
import { getFont } from "~/lib/fonts";
import { farcasterHubContext } from "frames.js/middleware";
 
export const frames = createFrames({
  baseUrl: new URL(env.BASE_URL),
  basePath: "/frames",
  middleware: [
    farcasterHubContext({
      hubHttpUrl: "https://nemes.farcaster.xyz:2281",
    }),
  ],
  imageRenderingOptions: async () => {
    const [regular, thin, light, bold, semibold, medium] = await Promise.all([
      getFont("Regular"),
      getFont("Thin"),
      getFont("Light"),
      getFont("Bold"),
      getFont("SemiBold"),
      getFont("Medium"),
    ]);

    return {
      imageOptions: {
        fonts: [
          {
            name: "regular",
            data: regular,
          },
          {
            name: "light",
            data: light,
          },
          {
            name: "thin",
            data: thin,
          },
          {
            name: "bold",
            data: bold,
          },
          {
            name: "semibold",
            data: semibold,
          },
          {
            name: "medium",
            data: medium,
          },
        ],
      }
    }
  }
});
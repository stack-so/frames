import { stackClient } from "~/lib/stack";

import { fetchMetadata } from "frames.js/next";
import { env } from "~/env";
 
export async function generateMetadata({ searchParams }: { searchParams: { id: string | undefined } }) {
  const roundId = searchParams.id
  const frameParams = roundId ? `?id=${roundId}` : ""

  return {
    title: "Stack Leaderboard",
    // ...
    other: {
      // ...
      ...(await fetchMetadata(
        // provide a full URL to your /frames endpoint
        new URL(
          `/frames${frameParams}`,
          `${env.BASE_URL}`
        )
      )),
    },
  };
}

export default async function HomePage() {
  const lb = await stackClient.getLeaderboard({
    limit: 3,
    socials: {
      farcaster: true
    }
  })
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-full max-w-2xl">
        <pre>
          {JSON.stringify(lb, null, 2)}
        </pre>
      </div>
    </div>
  );
}

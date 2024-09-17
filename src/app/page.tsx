import Link from "next/link";
import { stackClient } from "~/lib/stack";

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

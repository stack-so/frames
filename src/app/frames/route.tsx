/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { stackClient } from "~/lib/stack";
import { fetchUsers } from "~/lib/neynar";

type LeaderboardPlace = {
  rank: number;
  name: string;
  score: number;
  avatar: string;
};
 
const handleRequest = frames(async (ctx) => {
  // id of the points system
  const id = ctx.searchParams.id;

  // fid of the user who's score to display
  // set during the share flow.
  const fid = ctx.searchParams.fid;

  // set if user intends to check own score
  const check = ctx.searchParams.check;

  const page = ctx.searchParams.page ? (isNaN(parseInt(ctx.searchParams.page)) || parseInt(ctx.searchParams.page) < 1 ? undefined : parseInt(ctx.searchParams.page)) : undefined;

  if (check) {
    // own score frame
  } else if (fid) {
    // user score frame
  } else {
    // leaderboard frame - use page to fetch an offset
    const limit = 3;
    const offset = page ? (page - 1) * limit : 0;
    const [lb] = await Promise.all([
      stackClient.getLeaderboard({
        limit,
        offset,
        socials: {
          farcaster: true
        }
      }),
    ]);

    const imageUrl: string | undefined = lb.metadata.bannerUrl ?? undefined
    const title = lb.metadata.name
    const subtitle = lb.metadata.description
    const numParcipants = lb.stats.total
    const primaryColor = lb.metadata.primaryColor

    const leaderboard: LeaderboardPlace[] = lb.leaderboard.map((entry, i) => ({
      rank: i + 1 + offset,
      name: entry.identities.Farcaster.displayName! as string,
      score: entry.points,
      avatar: entry.identities.Farcaster.profileImageUrl as string,
    }));

    return {
      image: (
        <Layout
          imageUrl={imageUrl}
          title={title}
          subtitle={subtitle}
          numParcipants={numParcipants}
          primaryColor={primaryColor}
        >
          <div tw="flex flex-col flex-grow mt-14">
            {leaderboard.map(({ rank, name, score, avatar }, i) => (
              <div
                tw="flex items-center mb-[30px]"
                key={rank}
                style={{
                  fontFamily: "medium",
                }}
              >
                <div tw="flex w-[75px] flex-none">
                  <div tw="flex w-12 h-12 rounded-full items-center justify-center text-white bg-black pt-1 text-[30px]">
                    {rank}
                  </div>
                </div>
                <img src={avatar} tw="w-20 h-20 rounded-full mr-[30px]" />
                <div tw="flex-grow flex">{name}</div>
                <div tw="flex">{formatNumber(score)}</div>
              </div>
            ))}
          </div>
        </Layout>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button action="post" target={{ query: { check: true } }}>
          Check my place
        </Button>,
        <Button action="link" target="https://stack.so">
          View on Stack
        </Button>,
        <Button action="post" target={{ query: { page: page ? page + 1 : 2 } }}>
          →
        </Button>,
      ],
    };
  }

  // Fetch the leaderboard and user rank in parallel.
  const [lb, userData] = await Promise.all([
    // Get the overall leaderboard
    stackClient.getLeaderboard({
      limit: 3,
      socials: {
        farcaster: true
      }
    }), 
    // If the user clicked a button, fetch their score
    (async () => {
      if (!ctx.message) {
        return null
      }
      const [user] = await fetchUsers([ctx.message.requesterFid])
      if (!user?.verified_addresses.eth_addresses[0]) {
        return null
      }
      return {
        user: user,
        rank: await stackClient.getLeaderboardRank(user.verified_addresses.eth_addresses[0])
      }
    })()
  ])

  if (!id) {
    // Return poor configuration
  }

  const imageUrl: string | undefined = lb.metadata.bannerUrl ?? undefined
  const title = lb.metadata.name
  const subtitle = lb.metadata.description
  const numParcipants = lb.stats.total
  const primaryColor = lb.metadata.primaryColor

  const leaderboard: LeaderboardPlace[] = lb.leaderboard.map((entry, i) => ({
    rank: i + 1,
    name: entry.identities.Farcaster.displayName! as string,
    score: entry.points,
    avatar: entry.identities.Farcaster.profileImageUrl as string,
  }));

  if (fid !== undefined) {
    if (!userData?.rank) {
      // Handle unable to fetch
      throw new Error("Unable to fetch user data")
    }

    console.log("User data", userData?.rank)

    const username = userData.user.display_name ?? userData?.user.username
    const avatar = userData.user.pfp_url
    const place = userData.rank.rank
    const points = userData.rank.points

    return {
      image: (
        <Layout 
          imageUrl={imageUrl} 
          title={title} 
          subtitle={subtitle} 
          numParcipants={numParcipants} 
          primaryColor={primaryColor}
        >
          <div tw="flex flex-col justify-center flex-grow">
            <div tw="flex flex-col">
              <div tw="flex items-center" style={{
                fontFamily: "medium",
              }}>
                <div tw="flex flex-none mr-7">
                  <div tw="flex p-[10px] flex-none rounded-full items-center justify-center text-white bg-black text-[30px]">
                    #{place}
                  </div>
                </div>
                <img src={avatar} tw="w-20 h-20 rounded-full mr-[30px]" />
                <div tw="flex-grow flex">{username}</div>
              </div>
            </div>
            <div tw="flex text-[100px] mt-10">{formatNumber(points)} points</div>
          </div>
        </Layout>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button action="post" target={{ query: { value: "No" } }}>
          Check Mine
        </Button>,
        <Button action="post" target={{ query: { value: "No" } }}>
          View Leaderboard
        </Button>,
      ],
    };
  } else {
    console.log("Image", imageUrl)
    return {
      image: (
        <Layout 
          imageUrl={imageUrl} 
          title={title} 
          subtitle={subtitle} 
          numParcipants={numParcipants} 
          primaryColor={primaryColor}
        >
          <div tw="flex flex-col flex-grow mt-14">
            {leaderboard.map(({ rank, name, score, avatar }, i) => (
              <div tw="flex items-center mb-[30px]" key={rank} style={{
                fontFamily: "medium",
              }}>
                <div tw="flex w-[75px] flex-none">
                  <div tw="flex w-12 h-12 rounded-full items-center justify-center text-white bg-black pt-1 text-[30px]">
                    {rank}
                  </div>
                </div>
                <img src={avatar} tw="w-20 h-20 rounded-full mr-[30px]" />
                <div tw="flex-grow flex">{name}</div>
                <div tw="flex">{formatNumber(score)}</div>
              </div>
            ))}
          </div>
        </Layout>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button action="post" target={{ query: { value: "No" } }}>
          Check my place
        </Button>,
        <Button action="post" target={{ query: { value: "Yes" } }}>
          View on Stack
        </Button>,
        <Button action="post" target={{ query: { value: "No" } }}>
          →
        </Button>,
      ],
    };
  }
});

function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type LayoutProps = {
  imageUrl?: string;
  title: string;
  subtitle: string;
  numParcipants: number;
  primaryColor: string;
  children: React.ReactNode;
};

function Layout(p: LayoutProps) {
  return (
    <div tw="w-full h-full flex flex-col bg-[#F5F5F5]">
      <div tw="w-full h-1/3 flex flex-col bg-orange-500">
        {p.imageUrl ? (
          <img src={p.imageUrl} tw="w-full h-full object-cover" />
        ) : (
          <div tw="w-full h-full flex items-center justify-center" style={{backgroundColor: p.primaryColor}}>
          </div>
        )}
      </div>
      <div tw="flex flex-grow flex-col p-[50px]">
        <div tw="flex items-center w-full" style={{fontFamily: "bold"}}>
          <div tw="flex flex-grow">
            {p.title}
          </div>
          <div tw="flex items-center flex-none text-[30px]" style={{fontFamily: "medium"}}>
            <Users />
            <div tw="flex ml-4">
              {formatNumber(p.numParcipants)}
            </div>
          </div>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          maxHeight: "150px",
          fontFamily: "regular", 
          lineHeight: "2"
        }}>
          {p.subtitle}
          <div style={{
            display: "flex",
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: 50,
            background: "linear-gradient(to bottom, rgba(245, 245, 245, 0), rgba(245, 245, 245, 1))",
          }}>
          </div>
        </div>
        <div tw="flex flex-col flex-grow">
          {p.children}
        </div>
        <div tw="flex items-center justify-end gap-30 text-[25px]">
          <div tw="flex mr-3">Powered by</div>
          <div tw="flex bg-black/10 items-center justify-center rounded-xl py-[8px] px-[10px] gap-1">
            <div tw="flex w-6 h-6 rounded bg-black mr-3">
            </div>
            Stack
          </div>
        </div>
      </div>
    </div>
  )
}

function Users() {
  return (
    <svg width="36" height="30" viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 27.9442C2 24.017 5.184 20.833 9.11112 20.833H16.2222C20.1494 20.833 22.3334 24.017 22.3334 27.9442" stroke="#090A0C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.1111 4.21289C27.6662 4.21289 29.5556 6.10222 29.5556 8.65734C29.5556 11.2124 27.6662 13.1018 25.1111 13.1018" stroke="#090A0C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.9419 4.82656C19.4031 7.28774 19.4031 11.016 16.9419 13.4772C14.4807 15.9384 10.7524 15.9384 8.29126 13.4772C5.83008 11.016 5.83008 7.28774 8.29126 4.82656C10.7524 2.36538 14.4807 2.36538 16.9419 4.82656Z" stroke="#090A0C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26.889 19.0557C30.816 19.0557 34 22.2396 34 26.1668" stroke="#090A0C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  )
}
 
export const GET = handleRequest;
export const POST = handleRequest;
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { env } from "~/env";

export async function fetchUsers(fids: number[]) {
  const client = new NeynarAPIClient(env.NEYNAR_API_KEY);
  const res = await client.fetchBulkUsers(fids)
  if (res.users.length === 0) {
    return []
  }
  return res.users
}
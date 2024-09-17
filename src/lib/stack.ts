import {StackClient} from "@stackso/js-core";
import { env } from "~/env";

export const stackClient = new StackClient({
  apiKey: env.STACK_API_KEY, 
  pointSystemId: Number(env.STACK_POINTS_ID),
});
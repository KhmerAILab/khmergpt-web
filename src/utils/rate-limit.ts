import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";

const redis = new Redis({
url: process.env.UPSTASH_REST_API_DOMAIN,
token: process.env.UPSTASH_REST_API_TOKEN,
})

// Create a new ratelimiter, that allows 10 requests per 60 seconds
const ratelimit = new Ratelimit({
redis: redis,
limiter: Ratelimit.fixedWindow(10, "60 s"),
});

export async function upstashRest(identifier: string){
  const result = await ratelimit.limit(identifier);
  return result;
}
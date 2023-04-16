import type { NextApiRequest, NextApiResponse } from 'next'
import { translateMessage} from '@/utils/translate'
import { generate } from '@/utils/generate';
import { v4 as uuidv4 } from 'uuid'
import rateLimit from '@/utils/rate-limit'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/server/auth"

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  if (session) {
      console.log(req.body);
      try{
      await limiter.check(res, 10, 'CACHE_TOKEN') // 10 requests per minute

      let msg = req.body.message;

      let translated = await translateMessage(msg, 'en');
      
      let resGPT = await generate(translated);
      
      let resGPTkm = await translateMessage(resGPT, 'km');

      return res.send({ success: true , data: resGPTkm});

      } catch(err){
        res.send({ success: false, data: 'Rate limit exceeded' })
        console.log(err);
      }
    } else {
        // Not Signed in
        res.status(401)
      }
    res.end()
}
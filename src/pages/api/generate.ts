import type { NextApiRequest, NextApiResponse } from 'next'
const { translate } = require('@vitalets/google-translate-api');
const { Configuration, OpenAIApi } = require("openai");
import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";

require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
// Create a new ratelimiter, that allows 10 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(10, "60 s"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const identifier = "api";
  const result = await ratelimit.limit(identifier);
  res.setHeader('X-RateLimit-Limit', result.limit)
  res.setHeader('X-RateLimit-Remaining', result.remaining)
  if (!result.success) {
    res.status(200).json({message: 'The request has been rate limited.', rateLimitState: result})
    return
  }
      console.log(req.body);
      const body = req.body

      let msg = body.message;

      let translated = await translate(msg, { to: 'en' });
  
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          "role": "system", "content": "You are ChatGPT, a helpful chatbot. You will be given a user question. You will answer the question to the best of your ability and not deviate to another topic. Do not make up false information. If you do not know, say 'I do not know'."
        },
        {
            "role": "user", "content": translated.text
        }]
      })
      
      let resGPT = completion.data.choices[0].message.content;
  
      let resGPTkm = await translate(resGPT, { to: 'km' });
    
    return res.send({ success: true , data: resGPTkm.text, rateLimitState: result})
}
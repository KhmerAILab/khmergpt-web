const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

export async function generate(input:string) {

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          "role": "system", "content": "You are ChatGPT, a helpful chatbot. You will be given a user question. You will answer the question to the best of your ability and not deviate to another topic. Do not make up false information. If you do not know, say 'I do not know'."
        },
        {
            "role": "user", "content": input
        }]
      })
      
      //let resGPT = completion.data.choices[0].message.content;
      let resGPT = "lol"
      console.log(resGPT);
    return resGPT
}
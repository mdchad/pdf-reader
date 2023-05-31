import { OpenAI } from "langchain/llms/openai";

console.log('pro', process.env.OPENAI_API_KEY)
export const model = new OpenAI({
  temperature: 0,
  modelName: "text-davinci-003",
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: -1
})


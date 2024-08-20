import { NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY); 
const sysPrompt = `You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
 "flashcards":[
    {
      "front": "Front of the card",
       "back": "Back of the card"
    }
   ]
}`;

export async function POST(req) {

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const data = await req.text();

  // Assuming data is an array of message objects (adjust if needed)
  const prompt = sysPrompt + "\n Input to generate flashcards for: " + data;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  //const text = response.text();
  console.log('Response from API:', response.text());

  
  const flashcards = JSON.parse(response.text()).flashcards;
  return NextResponse.json(flashcards);
}
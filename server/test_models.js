import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const modelsToTest = ["gemini-1.5-flash-latest", "gemini-1.5-flash-8b", "gemini-1.0-pro-latest", "gemini-1.0-pro", "gemini-1.5-pro", "gemini-pro"];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello!");
      console.log(`Success with ${modelName}`);
      return; // Stop on first success
    } catch (error) {
      console.error(`Failed with ${modelName}:`, error.status || error.message);
    }
  }
}

run();

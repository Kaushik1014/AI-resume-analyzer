import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sends a generic prompt to the Gemini API and returns the response.
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
export const generatePromptResponse = async (prompt, history = []) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Format generic history into Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    if (formattedHistory.length > 0) {
      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } else {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    throw new Error("Failed to generate response from AI.");
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Free-tier oriented fallback chain. If one model is rate-limited, we try the next.
const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

const isQuotaError = (error) => {
  const statusCode = error?.status || error?.statusCode;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 429 || message.includes("quota exceeded") || message.includes("too many requests");
};

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
    // Format generic history into Gemini format
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    let lastError;
    let quotaError;
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        if (formattedHistory.length > 0) {
          const chat = model.startChat({ history: formattedHistory });
          const result = await chat.sendMessage(prompt);
          return result.response.text();
        }

        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (modelErr) {
        lastError = modelErr;
        if (!quotaError && isQuotaError(modelErr)) {
          quotaError = modelErr;
        }
        console.warn(`Gemini model "${modelName}" failed:`, modelErr?.message || modelErr);
      }
    }

    const finalError = quotaError || lastError || new Error("No Gemini model candidates succeeded.");
    if (isQuotaError(finalError)) {
      const err = new Error("Gemini API quota exceeded. Check plan/billing or retry later.");
      err.statusCode = 429;
      throw err;
    }
    throw finalError;
  } catch (err) {
    console.error("Gemini API Error:", err?.message || err);
    if (err?.statusCode) {
      throw err;
    }
    throw new Error("Failed to generate response from AI.");
  }
};

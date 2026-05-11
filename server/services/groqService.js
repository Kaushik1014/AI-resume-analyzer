import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MODEL_CANDIDATES = [
  // Fast + cheap first, then more capable fallbacks.
  "mixtral-8x7b-32768",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
];

const isRateLimitError = (error) => {
  const statusCode = error?.status || error?.statusCode;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 429 || message.includes("too many requests") || message.includes("rate limit");
};

const toGroqMessages = (prompt, history = []) => {
  const msgs = [];
  for (const msg of history) {
    if (!msg) continue;
    const role = msg.role === "assistant" ? "assistant" : "user";
    const content = typeof msg.text === "string" ? msg.text : "";
    if (content.trim()) msgs.push({ role, content });
  }
  msgs.push({ role: "user", content: prompt });
  return msgs;
};

/**
 * Sends a generic prompt to the Groq API and returns the response text.
 * @param {string} prompt
 * @param {{role: "user"|"assistant", text: string}[]} history
 * @param {{ jsonMode?: boolean, maxTokens?: number }} options
 * @returns {Promise<string>}
 */
export const generatePromptResponse = async (prompt, history = [], options = {}) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const messages = toGroqMessages(prompt, history);
  const jsonMode = options?.jsonMode === true;
  const maxTokens = Number.isFinite(options?.maxTokens) ? options.maxTokens : 3500;

  let lastError;
  let rateLimitError;

  for (const model of MODEL_CANDIDATES) {
    try {
      const completion = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model,
          messages,
          temperature: 0.2,
          max_tokens: maxTokens,
          ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      const text = completion?.data?.choices?.[0]?.message?.content ?? "";
      if (!String(text).trim()) {
        throw new Error(`Empty response from model "${model}".`);
      }
      return text;
    } catch (err) {
      lastError = err;
      const statusCode = err?.response?.status ?? err?.status ?? err?.statusCode;
      const wrappedErr = statusCode ? { ...err, statusCode } : err;
      if (!rateLimitError && isRateLimitError(wrappedErr)) {
        rateLimitError = err;
      }
      console.warn(
        `Groq model "${model}" failed:`,
        err?.response?.data?.error?.message || err?.message || err
      );
    }
  }

  const finalError = rateLimitError || lastError || new Error("No Groq model candidates succeeded.");
  if (isRateLimitError(finalError)) {
    const err = new Error("Groq API rate limit exceeded. Retry later or check plan/billing.");
    err.statusCode = 429;
    throw err;
  }
  if (finalError?.statusCode) throw finalError;

  console.error("Groq API Error:", finalError?.message || finalError);
  throw new Error("Failed to generate response from AI.");
};


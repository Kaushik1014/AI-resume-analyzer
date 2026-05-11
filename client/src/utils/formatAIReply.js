function extractJsonCandidate(raw) {
  if (!raw || typeof raw !== "string") return null;
  let text = raw.trim();

  // Strip markdown fences if present.
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/i);
  if (fenceMatch) text = fenceMatch[1].trim();

  // Try direct parse.
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  // Try first { ... last }.
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const substr = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(substr);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Ensures AI responses render nicely in ReactMarkdown.
 * - If the response is JSON (or contains a JSON object), pretty-print it as a ```json code block.
 * - Otherwise, return the text unchanged.
 */
export function formatAIReply(raw) {
  if (!raw || typeof raw !== "string") return "";
  const obj = extractJsonCandidate(raw);
  if (!obj || typeof obj !== "object") return raw;
  return `\n\n\`\`\`json\n${JSON.stringify(obj, null, 2)}\n\`\`\`\n`;
}


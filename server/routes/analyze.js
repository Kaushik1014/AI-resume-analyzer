import express from "express";
import authMiddleware from "../middleware/auth.js";
import analysisRateLimit from "../middleware/rateLimit.js";
import { generatePromptResponse } from "../services/geminiService.js";
import Chat from "../models/Chat.js";
import AnalysisUsage from "../models/AnalysisUsage.js";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const ANALYSIS_LIMIT = 3;
const WINDOW_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

// @route   GET /api/analyze/usage
// @desc    Get the current user's analysis usage status
// @access  Private
router.get("/usage", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    let usage = await AnalysisUsage.findOne({ firebaseUid: uid });

    if (!usage) {
      return res.json({
        limit: ANALYSIS_LIMIT,
        used: 0,
        remaining: ANALYSIS_LIMIT,
        resetsAt: null,
      });
    }

    const now = new Date();
    const windowElapsed = now.getTime() - new Date(usage.windowStart).getTime();

    // If window has expired, report fresh usage
    if (windowElapsed >= WINDOW_MS) {
      return res.json({
        limit: ANALYSIS_LIMIT,
        used: 0,
        remaining: ANALYSIS_LIMIT,
        resetsAt: null,
      });
    }

    const remaining = Math.max(0, ANALYSIS_LIMIT - usage.analysisCount);
    const resetTime = new Date(new Date(usage.windowStart).getTime() + WINDOW_MS);

    res.json({
      limit: ANALYSIS_LIMIT,
      used: usage.analysisCount,
      remaining,
      resetsAt: resetTime.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    res.status(500).json({ error: "Failed to fetch usage info" });
  }
});

// @route   POST /api/analyze/prompt
// @desc    Generate AI response from a text prompt and save history
// @access  Private
router.post("/prompt", authMiddleware, async (req, res) => {
  try {
    const { prompt, historyContext = [], saveHistory = true } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const responseText = await generatePromptResponse(prompt, historyContext);

    // Only save to history when explicitly requested (resume analysis saves, chatbot skips)
    if (saveHistory !== false) {
      await Chat.create({
        firebaseUid: req.user.uid,
        prompt,
        response: responseText,
      });
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(error?.statusCode || 500).json({
      error: error?.message || "Failed to generate AI response",
    });
  }
});

// @route   GET /api/analyze/history
// @desc    Get user's chat history
// @access  Private
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await Chat.find({ firebaseUid: req.user.uid })
      .select("-firebaseUid") // No need to send back uid
      .sort({ createdAt: -1 });

    res.json({ history });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// @route   DELETE /api/analyze/history/:id
// @desc    Delete a specific user chat
// @access  Private
router.delete("/history/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChat = await Chat.findOneAndDelete({ _id: id, firebaseUid: req.user.uid });

    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found or unauthorized" });
    }

    res.json({ message: "Chat deleted", id });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});


// @route   POST /api/analyze/upload
// @desc    Upload resume, parse text, and get AI rating (rate limited: 3 per 5 days)
// @access  Private
router.post("/upload", authMiddleware, analysisRateLimit, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let parsedText = "";

    const mimeType = file.mimetype;
    const lowerName = file.originalname?.toLowerCase() || "";

    const isPdf = mimeType === "application/pdf" || lowerName.endsWith(".pdf");
    const isTxt = mimeType === "text/plain" || lowerName.endsWith(".txt");
    const isDocx =
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".docx");

    // Parse PDF, DOCX, or read plain text
    if (isPdf) {
      const pdfData = await pdfParse(file.buffer);
      parsedText = pdfData.text;
    } else if (isTxt) {
      parsedText = file.buffer.toString("utf8");
    } else if (isDocx) {
      const docxResult = await mammoth.extractRawText({ buffer: file.buffer });
      parsedText = docxResult.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only PDF, DOCX, and TXT are allowed." });
    }

    if (!parsedText || !parsedText.trim()) {
      return res.status(400).json({ error: "No readable text found in the uploaded file." });
    }

    const { prompt, historyContext } = req.body;
    let history = [];
    if (historyContext) {
      try { history = JSON.parse(historyContext); } catch (e) { }
    }

    let finalPrompt = `Analyze this resume against ATS (Applicant Tracking System) standards.
${prompt && prompt.trim() ? `\nCompare the resume specifically against the following Job Description to identify keyword gaps.\nJob Description:\n${prompt}\n` : ""}
You must respond with ONLY a valid JSON object. Do not include markdown formatting or backticks around the JSON. 
Use this exact structure:
{
  "atsScore": <a number between 0 and 100 representing the ATS score>,
  "executiveSummary": "<a short 2-3 sentence AI-curated analytical summary of top strengths and crucial areas for improvement intended for a high-level PDF report>",
  "roleSpecificFeedback": {
    "detectedRole": "<the inferred primary targeting role based on context (e.g. 'Software Engineer', 'Product Manager', 'UX Designer')>",
    "suggestions": ["<tailored suggestion 1 leveraging specific industry standards for the detected role>", "<tailored suggestion 2>"]
  },
  "sectionScores": {
    "Summary": <score out of 10>,
    "Skills": <score out of 10>,
    "Experience": <score out of 10>,
    "Education": <score out of 10>
  },
  "missingKeywords": [${prompt && prompt.trim() ? '"<missing keyword 1 string>", "<missing keyword 2>"' : ""}],
  "toneCheck": {
    "passiveVoice": ["<identify sentences using passive voice>", "<leave empty array if none>"],
    "weakVerbs": ["<identify weak or cliché verbs used>", "<leave empty array if none>"],
    "quantification": "<feedback on whether they used enough numbers and metrics to quantify their impact>"
  },
  "formattingTips": {
    "length": "<feedback assessing if the resume length is optimal (e.g. 1-2 pages)>",
    "bulletStructure": "<feedback assessing bullet point consistency, length, and formatting>",
    "datesFormat": "<feedback assessing chronological consistency and date formatting e.g. MM/YYYY>"
  },
  "feedback": "<detailed constructive feedback in markdown format focusing on structure, keywords, and impact>"
}

Resume Content:
${parsedText}`;

    const responseText = await generatePromptResponse(finalPrompt, history);

    // Save to history using original prompt or a generic string if empty
    const savedPrompt = prompt && prompt.trim() ? prompt : `Resume Evaluation (${file.originalname})`;

    await Chat.create({
      firebaseUid: req.user.uid,
      prompt: savedPrompt,
      response: responseText,
    });

    // ─── Increment analysis usage count after successful analysis ───
    const usage = req.analysisUsage;
    usage.analysisCount += 1;
    await usage.save();

    const remaining = Math.max(0, ANALYSIS_LIMIT - usage.analysisCount);
    const resetTime = new Date(new Date(usage.windowStart).getTime() + WINDOW_MS);

    res.json({
      response: responseText,
      usage: {
        limit: ANALYSIS_LIMIT,
        used: usage.analysisCount,
        remaining,
        resetsAt: resetTime.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error analyzing uploaded file:", error);
    res.status(error?.statusCode || 500).json({
      error: error?.message || "Failed to analyze uploaded resume",
    });
  }
});

export default router;

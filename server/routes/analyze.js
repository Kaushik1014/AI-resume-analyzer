import express from "express";
import authMiddleware from "../middleware/auth.js";
import { generatePromptResponse } from "../services/geminiService.js";
import Chat from "../models/Chat.js";
import multer from "multer";
import pdfParse from "pdf-parse";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/analyze/prompt
// @desc    Generate AI response from a text prompt and save history
// @access  Private
router.post("/prompt", authMiddleware, async (req, res) => {
  try {
    const { prompt, historyContext = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const responseText = await generatePromptResponse(prompt, historyContext);

    // Save to history
    await Chat.create({
      firebaseUid: req.user.uid,
      prompt,
      response: responseText,
    });

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
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
// @desc    Upload resume, parse text, and get AI rating
// @access  Private
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let parsedText = "";

    // Parse PDF or read plain text
    if (file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(file.buffer);
      parsedText = pdfData.text;
    } else if (file.mimetype === "text/plain") {
      parsedText = file.buffer.toString("utf8");
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only PDF and TXT are allowed." });
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

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error analyzing uploaded file:", error);
    res.status(500).json({ error: "Failed to analyze uploaded resume" });
  }
});

export default router;

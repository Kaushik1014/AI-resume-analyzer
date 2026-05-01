// Rate limit middleware: limits resume analysis to 3 per user per 5-day window
import AnalysisUsage from "../models/AnalysisUsage.js";

const ANALYSIS_LIMIT = 3;
const WINDOW_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

/**
 * Middleware that enforces per-user analysis rate limiting.
 * - Each user can analyze up to 3 resumes per 5-day window.
 * - The window resets automatically once 5 days have passed since the first analysis.
 * - Attaches usage info to req.analysisUsage for downstream use.
 */
const analysisRateLimit = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Authentication required" });
    }

    let usage = await AnalysisUsage.findOne({ firebaseUid: uid });

    if (!usage) {
      // First time user — create a fresh usage record
      usage = await AnalysisUsage.create({
        firebaseUid: uid,
        analysisCount: 0,
        windowStart: new Date(),
      });
    }

    const now = new Date();
    const windowElapsed = now.getTime() - new Date(usage.windowStart).getTime();

    // If 5 days have passed, reset the window
    if (windowElapsed >= WINDOW_MS) {
      usage.analysisCount = 0;
      usage.windowStart = now;
      await usage.save();
    }

    // Check if user has exceeded the limit
    if (usage.analysisCount >= ANALYSIS_LIMIT) {
      const resetTime = new Date(new Date(usage.windowStart).getTime() + WINDOW_MS);
      const timeLeftMs = resetTime.getTime() - now.getTime();

      const days = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((timeLeftMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((timeLeftMs % (60 * 60 * 1000)) / (60 * 1000));

      let timeLeftStr = "";
      if (days > 0) timeLeftStr += `${days}d `;
      if (hours > 0) timeLeftStr += `${hours}h `;
      timeLeftStr += `${minutes}m`;

      return res.status(429).json({
        error: "Analysis limit reached",
        message: `You've used all ${ANALYSIS_LIMIT} analyses. Your limit resets in ${timeLeftStr.trim()}.`,
        limit: ANALYSIS_LIMIT,
        used: usage.analysisCount,
        remaining: 0,
        resetsAt: resetTime.toISOString(),
      });
    }

    // Attach usage info for the route handler to increment after success
    req.analysisUsage = usage;
    next();
  } catch (err) {
    console.error("Rate limit middleware error:", err);
    return res.status(500).json({ error: "Internal server error checking usage limits" });
  }
};

export default analysisRateLimit;

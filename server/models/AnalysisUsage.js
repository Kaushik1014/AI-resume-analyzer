// AnalysisUsage model: tracks per-user resume analysis count within a rolling time window
import mongoose from "mongoose";

const analysisUsageSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    analysisCount: {
      type: Number,
      default: 0,
    },
    windowStart: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AnalysisUsage = mongoose.model("AnalysisUsage", analysisUsageSchema);
export default AnalysisUsage;

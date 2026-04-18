// Express app configuration: middleware setup, Firebase Admin init, route mounting
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import analyzeRoutes from "./routes/analyze.js";

dotenv.config();

// ─── Firebase Admin SDK initialization ───
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ─── Express setup ───
const app = express();

// CORS — allow requests from the Vite dev server
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));

// Rate limiting — 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// ─── Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;

// Auth routes: handles user sync from Firebase and profile retrieval
import { Router } from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// POST /api/auth/sync — called after Firebase sign-in to upsert user in MongoDB
router.post("/sync", authMiddleware, async (req, res) => {
  try {
    const { uid, email, name, picture, firebase } = req.user;

    // Determine auth provider
    const provider =
      firebase?.sign_in_provider === "google.com" ? "google" : "email";

    // Upsert: create if not exists, update if exists
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        email: email || "",
        displayName: name || req.body.displayName || "",
        photoURL: picture || req.body.photoURL || "",
        provider,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ user });
  } catch (err) {
    console.error("User sync error:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// GET /api/auth/me — returns the current user's profile from MongoDB
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

export default router;

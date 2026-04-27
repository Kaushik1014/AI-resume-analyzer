// Auth middleware: verifies Firebase ID tokens and attaches decoded user to req
import admin from "firebase-admin";

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split("Bearer ")[1];

  // DEV BYPASS: Allow 'test-token' for local demo mode since Firebase might not be configured
  if (token === "test-token") {
    req.user = { uid: "demo-user-123", email: "demo@example.com" };
    return next();
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;

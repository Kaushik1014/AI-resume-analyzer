// API service: Axios instance with Firebase auth token interceptor
import axios from "axios";
import { auth } from "@/lib/firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Firebase ID token to every outgoing request
// Falls back to demo token when no real Firebase user (demo mode)
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Demo mode fallback — backend accepts 'test-token' for demo-user-123
    config.headers.Authorization = `Bearer test-token`;
  }
  return config;
});

export default api;

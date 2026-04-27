// AuthContext: React context provider for global authentication state management
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import api from "@/services/api";

// ─── Types ───
interface MongoUser {
  _id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: string;
  createdAt: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: MongoUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Hook ───
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// ─── Provider ───
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user to MongoDB after Firebase sign-in
  const syncUser = useCallback(async (user: FirebaseUser) => {
    try {
      const { data } = await api.post("/auth/sync", {
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
      setDbUser(data.user);
    } catch (err: any) {
      console.error("Failed to sync user:", err);
      // Don't block login — user can still use the app,
      // the DB profile just won't be populated yet
    }
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncUser(user);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [syncUser]);

  // ─── Auth Methods ───

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(user);
    } catch (err: any) {
      const msg = firebaseErrorMessage(err.code);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [syncUser]);

  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name on the Firebase profile
      await updateProfile(user, { displayName });
      await syncUser(user);
    } catch (err: any) {
      const msg = firebaseErrorMessage(err.code);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [syncUser]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await syncUser(user);
    } catch (err: any) {
      console.error("Google login error code:", err.code, "message:", err.message);
      // Don't show error for popup-closed-by-user
      if (err.code !== "auth/popup-closed-by-user") {
        const msg = firebaseErrorMessage(err.code);
        setError(msg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [syncUser]);

  const demoLogin = useCallback(async () => {
    setLoading(true);
    // Provide a mocked firebase user
    const mockUser: any = {
      uid: "demo-user-123",
      email: "demo@example.com",
      displayName: "Demo User",
      photoURL: "",
      getIdToken: async () => "test-token"
    };
    setFirebaseUser(mockUser);
    setDbUser({
      _id: "demo-id",
      firebaseUid: "demo-user-123",
      email: "demo@example.com",
      displayName: "Demo User",
      photoURL: "",
      provider: "demo",
      createdAt: new Date().toISOString()
    });
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setDbUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        error,
        login,
        signup,
        loginWithGoogle,
        demoLogin,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Firebase error code → friendly message ───
function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for sign-in. Add it to Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.";
    case "auth/cancelled-popup-request":
      return "Another sign-in popup is already open.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by the browser. Please allow popups and try again.";
    case "auth/internal-error":
      return "An internal authentication error occurred. Please try again.";
    default:
      console.warn("Unhandled Firebase error code:", code);
      return `Authentication failed (${code || "unknown"}). Please try again.`;
  }
}

export default AuthContext;

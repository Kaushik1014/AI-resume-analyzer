// AuthPage: Login / Sign Up with Image 5 background, glassmorphism card
import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  Rocket,
  Loader2,
  ShieldCheck,
  AlertCircle,
  FlaskConical,
} from "lucide-react";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    firebaseUser,
    loading: authLoading,
    error: authError,
    login,
    signup,
    loginWithGoogle,
    demoLogin,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isLogin = mode === "login";

  // Redirect if already logged in
  useEffect(() => {
    if (firebaseUser && !authLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [firebaseUser, authLoading, navigate]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLocalError(null);
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!isLogin && password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (!isLogin && password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch {
      // Error is already set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch {
      // Error handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setLocalError(null);
    clearError();
    setSubmitting(true);
    try {
      await demoLogin();
      navigate("/dashboard", { replace: true });
    } catch {
      setLocalError("Demo mode failed to start. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ─── Image 5 Background ─── */}
      <div className="absolute inset-0">
        <img
          src="/image-5.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ─── Back to Home ─── */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-10 z-20 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="tracking-widest uppercase text-xs font-bold">Resume IQ</span>
      </Link>

      {/* ─── Auth Card ─── */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
            boxShadow:
              "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="px-8 py-10 sm:px-10 sm:py-12">
            {/* ── Heading ── */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-white/50 text-sm">
                {isLogin
                  ? "Sign in to continue analyzing resumes"
                  : "Start optimizing your career today"}
              </p>
            </div>

            {/* ── Mode Toggle Tabs ── */}
            <div className="flex rounded-full bg-white/5 border border-white/10 p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setLocalError(null);
                  clearError();
                }}
                className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLogin
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setLocalError(null);
                  clearError();
                }}
                className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isLogin
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </div>

            {/* ── Error Banner ── */}
            {displayError && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name — sign up only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-name"
                    className="text-xs font-medium tracking-widest uppercase text-white/40"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required={!isLogin}
                      disabled={submitting}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className="text-xs font-medium tracking-widest uppercase text-white/40"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={submitting}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-password"
                  className="text-xs font-medium tracking-widest uppercase text-white/40"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={submitting}
                    className="w-full h-12 pl-11 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password — sign up only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-confirm-password"
                    className="text-xs font-medium tracking-widest uppercase text-white/40"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required={!isLogin}
                      disabled={submitting}
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot password — login only */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-red-400/80 hover:text-red-400 transition-colors tracking-wide"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-13 py-3.5 text-sm font-bold tracking-widest uppercase bg-red-500 text-white hover:bg-red-600 rounded-xl border border-red-400/20 shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.55)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? (
                      <LogIn className="w-4 h-4" />
                    ) : (
                      <Rocket className="w-4 h-4" />
                    )}
                    {isLogin ? "Sign In" : "Create Account"}
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 tracking-widest uppercase">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="flex items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors font-medium">
                    Continue with Google
                  </span>
                </button>

                {/* Demo Mode Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={submitting}
                  className="flex items-center justify-center gap-3 h-12 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  <FlaskConical className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                  <span className="text-sm text-red-400 group-hover:text-red-300 transition-colors font-medium tracking-wide">
                    Try Demo Local Mode (Skip Auth)
                  </span>
                </button>
              </div>
            </form>

            {/* ── Bottom toggle link ── */}
            <p className="text-center text-sm text-white/40 mt-8">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>

            {/* Trust line */}
            <p className="text-center text-xs text-white/25 mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-red-400/40" />
              Secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

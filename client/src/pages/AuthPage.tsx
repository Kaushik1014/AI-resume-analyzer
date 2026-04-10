// AuthPage: Login / Sign Up page with Spline 3D background, BorderGlow card, and Firebase auth
import React, { Suspense, useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BorderGlow from "@/components/BorderGlow";
import { useAuth } from "@/context/AuthContext";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, loading: authLoading, error: authError, login, signup, loginWithGoogle, clearError } = useAuth();

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

    // Client-side validation
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
      // Navigate is handled by the useEffect above when firebaseUser changes
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
      // Error handled by AuthContext (popup-closed-by-user is silenced)
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-hero-bg overflow-hidden">
      {/* ─── Spline 3D Background ─── */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[50%] h-[50%] origin-top-left scale-[2]">
          <Suspense fallback={<div className="absolute inset-0 bg-hero-bg" />}>
            <Spline
              scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
        </div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />

      {/* ─── Back to Home (top-left) ─── */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-10 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <i className="fa-solid fa-arrow-left group-hover:-translate-x-0.5 transition-transform" />
        <span className="tracking-widest uppercase text-xs font-bold">Resume IQ</span>
      </Link>

      {/* ─── Auth Card ─── */}
      <div className="relative z-10 w-full max-w-md mx-4 opacity-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <BorderGlow
          borderRadius={20}
          glowColor="142 100 60"
          backgroundColor="rgba(10, 10, 10, 0.75)"
          glowIntensity={2.5}
          coneSpread={140}
          colors={["#86efac", "#4ade80", "#bbf7d0"]}
        >
          <div className="px-8 py-10 sm:px-10 sm:py-12">
            {/* ── Heading ── */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Sign in to continue analyzing resumes"
                  : "Start optimizing your career today"}
              </p>
            </div>

            {/* ── Mode Toggle Tabs ── */}
            <div className="flex rounded-full bg-secondary/60 p-1 mb-8">
              <button
                type="button"
                onClick={() => { setMode("login"); setLocalError(null); clearError(); }}
                className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
                  isLogin
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <i className="fa-solid fa-right-to-bracket mr-2" />
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setLocalError(null); clearError(); }}
                className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
                  !isLogin
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <i className="fa-solid fa-user-plus mr-2" />
                Sign Up
              </button>
            </div>

            {/* ── Error Banner ── */}
            {displayError && (
              <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2 animate-fade-up">
                <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name — sign up only */}
              {!isLogin && (
                <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
                  <label htmlFor="auth-name" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required={!isLogin}
                      disabled={submitting}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={submitting}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm" />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={submitting}
                    className="w-full h-12 pl-11 pr-12 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                    tabIndex={-1}
                  >
                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
                  </button>
                </div>
              </div>

              {/* Confirm Password — sign up only */}
              {!isLogin && (
                <div className="space-y-1.5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
                  <label htmlFor="auth-confirm-password" className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm" />
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required={!isLogin}
                      disabled={submitting}
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      tabIndex={-1}
                    >
                      <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot password — login only */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-primary/80 hover:text-primary transition-colors tracking-wide"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full h-13 text-sm font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl border border-primary/20 shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:shadow-[0_0_35px_rgba(34,197,94,0.55)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    <i className={`fa-solid ${isLogin ? "fa-arrow-right-to-bracket" : "fa-rocket"} mr-2`} />
                    {isLogin ? "Sign In" : "Create Account"}
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">or continue with</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="flex items-center justify-center gap-3 h-12 rounded-xl bg-secondary/40 border border-border/40 hover:bg-secondary/70 hover:border-border transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-brands fa-google text-lg text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                    Continue with Google
                  </span>
                </button>
              </div>
            </form>

            {/* ── Bottom toggle link ── */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>

            {/* Trust line */}
            <p className="text-center text-xs text-muted-foreground/40 mt-4">
              <i className="fa-solid fa-shield-halved text-primary/40 mr-1" />
              Secured with end-to-end encryption
            </p>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
};

export default AuthPage;

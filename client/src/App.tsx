// Root application component: sets up routing with lazy-loaded pages, wrapped in AuthProvider
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import Index from "@/pages/Index";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./index.css";

// Lazy-load secondary pages — only the landing page is bundled eagerly.
// Features, HowItWorks, FAQ and their heavy dependencies (Spline, BorderGlow)
// are loaded on-demand when the user navigates, keeping initial bundle small.
const Features = React.lazy(() => import("@/pages/Features"));
const HowItWorks = React.lazy(() => import("@/pages/HowItWorks"));
const Faq = React.lazy(() => import("@/pages/Faq"));
const AuthPage = React.lazy(() => import("@/pages/AuthPage"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));

// Protected route wrapper — redirects to /login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-hero-bg" />;
  if (!firebaseUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hero-bg" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

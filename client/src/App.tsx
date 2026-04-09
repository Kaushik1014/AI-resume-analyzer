// Root application component: sets up routing with lazy-loaded pages
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Index from "@/pages/Index";
import "./index.css";

// Lazy-load secondary pages — only the landing page is bundled eagerly.
// Features, HowItWorks, FAQ and their heavy dependencies (Spline, BorderGlow)
// are loaded on-demand when the user navigates, keeping initial bundle small.
const Features = React.lazy(() => import("@/pages/Features"));
const HowItWorks = React.lazy(() => import("@/pages/HowItWorks"));
const Faq = React.lazy(() => import("@/pages/Faq"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-hero-bg" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

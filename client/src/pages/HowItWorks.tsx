import React, { Suspense, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HowItWorksSection from "@/components/HowItWorksSection";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const HowItWorks = () => {
  // Forward wheel events from Spline canvas to page scroll
  const handleBackgroundWheel = useCallback((e: React.WheelEvent) => {
    window.scrollBy(0, e.deltaY);
  }, []);

  return (
    <div className="relative min-h-screen bg-hero-bg overflow-x-hidden flex flex-col">
      {/* Spline 3D Background — fixed, cursor-tracking enabled, wheel forwarded for scroll */}
      <div className="fixed inset-0 z-0 overflow-hidden" onWheel={handleBackgroundWheel}>
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
      <div className="fixed inset-0 bg-black/40 z-[1] pointer-events-none" />

      {/* Content Container — pointer-events-none lets cursor reach Spline for glow tracking */}
      <div className="relative z-10 w-full pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
        <HowItWorksSection />
      </div>
    </div>
  );
};

export default HowItWorks;

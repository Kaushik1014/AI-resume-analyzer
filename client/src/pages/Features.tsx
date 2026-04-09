import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import FeaturesSection from "@/components/FeaturesSection";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const Features = () => {
  return (
    <div className="relative min-h-screen bg-hero-bg overflow-hidden flex flex-col">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-hero-bg" />}>
          <Spline
            scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* Navbar needs pointer events to click links */}
        <div className="pointer-events-auto">
          <Navbar />
        </div>
        
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Features;

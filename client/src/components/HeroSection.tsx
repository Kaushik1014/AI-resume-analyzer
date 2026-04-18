// HeroSection: full-screen hero with Spline 3D background and staggered fade-up content
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden">
      {/* Spline 3D Background — rendered at 50% res and scaled up for performance */}
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
      <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

      {/* Content container — anchored bottom-left */}
      <div className="relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-10 md:pb-10 pt-32">
        {/* Heading */}
        <h1
          className="opacity-0 animate-fade-up text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-2 md:mb-4 uppercase"
          style={{ animationDelay: "0.2s" }}
        >
          RESUME <span className="text-primary">IQ</span>
        </h1>

        {/* Subheading */}
        <p
          className="opacity-0 animate-fade-up text-foreground/80 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6"
          style={{ animationDelay: "0.4s" }}
        >
          Unlock your career potential.
        </p>

        {/* Description */}
        <p
          className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8"
          style={{ animationDelay: "0.55s" }}
        >
          Upload your resume and get instant, AI-driven feedback. Our deep analysis scans everything from formatting to crucial keywords, ensuring your application gets past ATS filters and into human hands.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up pointer-events-auto" style={{ animationDelay: "0.4s" }}>
          <Button onClick={() => navigate("/login")} size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-[background-color,box-shadow] duration-300">
            <i className="fa-solid fa-wand-magic-sparkles mr-2" />
            Analyze My Resume
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-medium rounded-full bg-transparent border-border hover:bg-secondary/50 text-foreground hover:text-white transition-[background-color,color] duration-300" asChild>
            <a href="https://www.canva.com/resumes/templates/" target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-arrow-up-right-from-square mr-2" />
              View examples
            </a>
          </Button>
        </div>

        {/* Trust line */}
        <p
          className="opacity-0 animate-fade-up text-muted-foreground/60 text-xs font-light mt-4 md:mt-6"
          style={{ animationDelay: "0.85s" }}
        >
          Powered by Google Gemini AI. <i className="fa-solid fa-rocket text-primary/60 mx-1" /> Over 10k careers accelerated.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

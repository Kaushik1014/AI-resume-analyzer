// Dashboard: Hero section with looping video background, custom fade,
// navigation bar, badge, headline, and prompt input — shown after login.
import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";

// ─── SVG Icon Components ───
const ArrowUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 14.25V3.75M9 3.75L4.5 8.25M9 3.75L13.5 8.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1L8.854 5.146L13 7L8.854 8.854L7 13L5.146 8.854L1 7L5.146 5.146L7 1Z" fill="#FFD700" />
  </svg>
);



const AttachIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.657 7.121L8.121 12.657C7.158 13.621 5.605 13.621 4.643 12.657C3.679 11.695 3.679 10.142 4.643 9.179L10.179 3.643C10.765 3.057 11.714 3.057 12.299 3.643C12.885 4.228 12.885 5.178 12.299 5.764L7.47 10.593C7.276 10.787 6.96 10.787 6.763 10.593C6.569 10.399 6.569 10.083 6.763 9.886L10.886 5.764" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 12C9.761 12 12 9.761 12 7C12 4.239 9.761 2 7 2C4.239 2 2 4.239 2 7C2 9.761 4.239 12 7 12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 14L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Video Background with Custom JS Fade System ───
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";

function VideoBackground() {
  const videoRef = useRef(null);
  const fadeRafRef = useRef(null);
  const fadingOutRef = useRef(false);

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }, []);

  const animateOpacity = useCallback(
    (target, duration) => {
      cancelFade();
      const el = videoRef.current;
      if (!el) return;
      const start = parseFloat(el.style.opacity || "0");
      const diff = target - start;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.style.opacity = String(start + diff * progress);
        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          fadeRafRef.current = null;
        }
      };
      fadeRafRef.current = requestAnimationFrame(step);
    },
    [cancelFade]
  );

  const fadeIn = useCallback(() => {
    fadingOutRef.current = false;
    animateOpacity(1, 250);
  }, [animateOpacity]);

  const fadeOut = useCallback(() => {
    animateOpacity(0, 250);
  }, [animateOpacity]);

  const handleCanPlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
    fadeIn();
  }, [fadeIn]);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    const remaining = vid.duration - vid.currentTime;
    
    // Instead of fading out at 0.55s and sitting at black, 
    // fade out exactly as it ends (0.25s) to reduce the gap
    if (remaining <= 0.25 && !fadingOutRef.current) {
      fadingOutRef.current = true;
      fadeOut();
    }
  }, [fadeOut]);

  const handleEnded = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    cancelFade();
    vid.style.opacity = "0";
    
    // Remove the 100ms artificial delay so it starts playing immediately
    vid.currentTime = 0;
    vid.play().catch(() => {});
    fadingOutRef.current = false;
    fadeIn();
  }, [cancelFade, fadeIn]);

  useEffect(() => {
    return () => cancelFade();
  }, [cancelFade]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-hero-bg">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        loop
        preload="auto"
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        style={{
          opacity: 0,
          width: "115%",
          height: "115%",
          objectFit: "cover",
          objectPosition: "center top",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

// ─── Badge Component ───
function NewBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full shadow-sm border border-white/10"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        padding: "4px 4px 4px 4px",
      }}
    >
      <span
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{ background: "rgba(255, 255, 255, 0.1)" }}
      >
        <StarIcon />
        <span
          className="font-inter text-foreground"
          style={{ fontSize: 14, fontWeight: 500 }}
        >
          New
        </span>
      </span>
      <span
        className="font-inter pr-3"
        style={{ fontSize: 14, fontWeight: 400, color: "rgba(255, 255, 255, 0.8)" }}
      >
        Discover what's possible
      </span>
    </div>
  );
}

// ─── Search / Prompt Input Box ───
function PromptInput() {
  const [query, setQuery] = useState("");
  const maxChars = 3000;

  return (
    <div
      className="w-full rounded-[18px] overflow-hidden border border-white/10 shadow-2xl"
      style={{
        maxWidth: 728,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="p-3">
        <div
          className="bg-white/10 rounded-xl shadow-inner flex items-center px-4 border border-white/10 focus-within:border-primary/50 transition-colors"
          style={{ height: 80 }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) setQuery(e.target.value);
            }}
            placeholder="Type question..."
            className="flex-1 bg-transparent outline-none font-schibsted relative z-10"
            style={{
              fontSize: 16,
              color: "#ffffff",
              caretColor: "#ffffff",
            }}
          />
          <button
            className="flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex-shrink-0"
            style={{ width: 36, height: 36 }}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-5 pb-4"
      >
        <div className="flex items-center gap-2 text-white/70">
          {[
            { label: "Attach", Icon: AttachIcon },
            { label: "Prompts", Icon: SearchIcon },
          ].map(({ label, Icon }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors hover:text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                fontSize: 12,
              }}
            >
              <Icon />
              <span className="font-schibsted font-medium">
                {label}
              </span>
            </button>
          ))}
        </div>
        <span
          className="font-schibsted text-white/50"
          style={{ fontSize: 12 }}
        >
          {query.length}/{maxChars.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ───
const Dashboard = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-bg">
      <VideoBackground />

      <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div
          className="flex-1 flex flex-col items-center justify-center -mt-[50px] px-6 sm:px-10"
          style={{ gap: 44 }}
        >
          <div
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            style={{ gap: 34 }}
          >
            <NewBadge />

            <h1
              className="font-fustat font-bold text-foreground opacity-0 animate-fade-up uppercase"
              style={{
                fontSize: "clamp(3rem,8vw,5.5rem)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                animationDelay: "0.2s"
              }}
            >
              Transform Data <span className="text-primary">Quickly</span>
            </h1>

            <p
              className="font-fustat font-light text-center text-foreground/80 opacity-0 animate-fade-up"
              style={{
                fontSize: "clamp(1.125rem,2vw,1.25rem)",
                letterSpacing: "-0.02em",
                maxWidth: 736,
                width: "100%",
                animationDelay: "0.4s"
              }}
            >
              Upload your information and get powerful insights right away. Work
              smarter and achieve goals effortlessly.
            </p>
          </div>

          <div className="w-full flex justify-center opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <PromptInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

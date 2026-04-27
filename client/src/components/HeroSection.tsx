// HeroSection: Scroll-driven frame-by-frame canvas animation with GSAP ScrollTrigger
// 257 frames scrubbed by scroll position, with text elements fading in sequentially (never fading out)
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ExternalLink, Sparkles, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 257;
const FRAME_PATH = (i: number) =>
  `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 });
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // ── Preload all frames into memory ──
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  // ── Draw a specific frame on canvas ──
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dx = (cw - iw * scale) / 2;
    const dy = (ch - ih * scale) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
  };

  // ── Resize canvas to window ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (loaded) drawFrame(frameIndexRef.current.value);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [loaded]);

  // ── GSAP ScrollTrigger: scrub frame index + text reveals (no fade-out) ──
  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    drawFrame(0);

    const ctx = gsap.context(() => {
      // Animate frame index from 0 → 256 as user scrolls
      gsap.to(frameIndexRef.current, {
        value: FRAME_COUNT - 1,
        ease: "none",
        snap: { value: 1 },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          drawFrame(Math.round(frameIndexRef.current.value));
        },
      });

      // ── Text animations — fade in only, never fade out ──

      // Scroll indicator: fade OUT as user starts scrolling
      gsap.to(".hero-scroll-hint", {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "2% top",
          end: "8% top",
          scrub: true,
        },
      });

      // Title: fade in at 0-10%
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "10% top",
            scrub: true,
          },
        }
      );

      // Subtitle: fade in at 20-30%
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "20% top",
            end: "30% top",
            scrub: true,
          },
        }
      );

      // Description: fade in at 42-52%
      gsap.fromTo(
        ".hero-description",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "42% top",
            end: "52% top",
            scrub: true,
          },
        }
      );

      // CTA: fade in at 65-75%
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "65% top",
            end: "75% top",
            scrub: true,
          },
        }
      );

      // Trust line: fade in at 80-88%
      gsap.fromTo(
        ".hero-trust",
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "80% top",
            end: "88% top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <>
      {/* Loading screen */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-white/40 text-sm font-mono">{loadProgress}%</p>
        </div>
      )}

      {/* Scroll container — 500vh of scroll room */}
      <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
        {/* Sticky canvas — stays pinned as user scrolls */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Text layers — all positioned absolute center, stacked vertically */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-6 max-w-4xl flex flex-col items-center gap-4">
              {/* Title */}
              <h1 className="hero-title opacity-0 text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
                RESUME <span className="text-red-500">IQ</span>
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle opacity-0 text-xl sm:text-2xl md:text-3xl font-light text-white/90 drop-shadow-lg">
                Unlock your career potential.
              </p>

              {/* Description */}
              <p className="hero-description opacity-0 text-base sm:text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl drop-shadow-lg">
                Upload your resume and get instant, AI-driven feedback to get past ATS filters and into human hands.
              </p>

              {/* CTA */}
              <div className="hero-cta opacity-0 flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto mt-4">
                <a
                  href="/login"
                  className="px-10 py-4 bg-white text-black rounded-md font-semibold text-lg hover:bg-white/90 transition-colors shadow-xl flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Analyze My Resume
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="https://www.canva.com/resumes/templates/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 border-2 border-white/30 rounded-md text-white/90 font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  View Examples
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Trust line */}
              <p className="hero-trust opacity-0 text-white/30 text-xs mt-2 flex items-center gap-2 justify-center">
                <Sparkles className="w-3 h-3" />
                Powered by Google Gemini AI · Over 10k careers accelerated
                <Sparkles className="w-3 h-3" />
              </p>
            </div>
          </div>

          {/* Scroll indicator — fades out as user starts scrolling */}
          <div className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
            <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

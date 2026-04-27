// HowItWorksSection: Scroll-driven frame animation with steps appearing one by one
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Upload, Brain, ScanSearch, Lightbulb } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const HIW_FRAME_COUNT = 192;
const HIW_FRAME_PATH = (i: number) =>
  `/frames-hiw/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const steps = [
  {
    id: "01",
    title: "Upload Document",
    description:
      "Simply drag and drop your PDF or DOCX file into our secure platform. Your data remains completely private and encrypted.",
    icon: Upload,
  },
  {
    id: "02",
    title: "AI Analysis",
    description:
      "Our application sends your document directly to Google Gemini AI to analyze your syntax, grammar, and career experience accurately.",
    icon: Brain,
  },
  {
    id: "03",
    title: "Deep ATS Analysis",
    description:
      "We cross-reference your structure and keyword density against thousands of modern Applicant Tracking System algorithm benchmarks.",
    icon: ScanSearch,
  },
  {
    id: "04",
    title: "Actionable Insights",
    description:
      "Receive a comprehensive granular report detailing your exact score alongside personalized, line-by-line recommendations.",
    icon: Lightbulb,
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 });
  const [loaded, setLoaded] = useState(false);

  // ── Preload all HIW frames ──
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= HIW_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = HIW_FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === HIW_FRAME_COUNT) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  // ── Draw frame on canvas ──
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

  // ── Resize canvas ──
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

  // ── GSAP ScrollTrigger animations ──
  useEffect(() => {
    if (!loaded || !sectionRef.current) return;

    drawFrame(0);

    const ctx = gsap.context(() => {
      // Scrub frame index across the full scroll
      gsap.to(frameIndexRef.current, {
        value: HIW_FRAME_COUNT - 1,
        ease: "none",
        snap: { value: 1 },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          drawFrame(Math.round(frameIndexRef.current.value));
        },
      });

      // Section heading — fade in at 0-6%
      gsap.fromTo(
        ".hiw-heading",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "6% top",
            scrub: true,
          },
        }
      );

      // Step 1 — fade in at 10-18%
      gsap.fromTo(
        ".hiw-step-0",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "10% top",
            end: "18% top",
            scrub: true,
          },
        }
      );

      // Step 2 — fade in at 28-36%
      gsap.fromTo(
        ".hiw-step-1",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "28% top",
            end: "36% top",
            scrub: true,
          },
        }
      );

      // Step 3 — fade in at 48-56%
      gsap.fromTo(
        ".hiw-step-2",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "48% top",
            end: "56% top",
            scrub: true,
          },
        }
      );

      // Step 4 — fade in at 68-76%
      gsap.fromTo(
        ".hiw-step-3",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "68% top",
            end: "76% top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <div
      ref={sectionRef}
      id="how-it-works"
      className="relative"
      style={{ height: "400vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Canvas background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* Top gradient fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Content overlay — 2×2 grid layout */}
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-20">
            {/* Section heading — compact */}
            <div className="hiw-heading opacity-0 mb-5">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                Process
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                How <span className="text-red-500">Resume IQ</span> Works
              </h2>
            </div>

            {/* Steps in a 2×2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`hiw-step-${index} opacity-0`}
                  >
                    <div
                      className="p-4 rounded-xl border border-white/10 h-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                        backdropFilter: "blur(16px) saturate(150%)",
                        WebkitBackdropFilter: "blur(16px) saturate(150%)",
                        boxShadow:
                          "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20 flex-shrink-0">
                          <Icon className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-red-500 font-mono text-xs font-bold tracking-widest">
                          STEP {step.id}
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;

import {
  faFileLines,
  faTachometerAlt,
  faListUl,
  faSearch,
  faCommentDots,
  faPen,
  faTrophy,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    title: "Resume parsing",
    description: "Extract text seamlessly from PDF/DOCX uploads without losing formatting details.",
    faIcon: faFileLines,
  },
  {
    title: "ATS score",
    description: "Find out exactly how well your resume reads to modern Applicant Tracking Systems.",
    faIcon: faTachometerAlt,
  },
  {
    title: "Section analysis",
    description: "Get individualized scores for your Summary, Skills, Experience, and Education.",
    faIcon: faListUl,
  },
  {
    title: "Keyword gap analysis",
    description: "Paste a job description and instantly discover the critical keywords you're missing.",
    faIcon: faSearch,
  },
  {
    title: "Tone & language check",
    description: "Identify and eliminate passive voice, weak verbs, and unquantified statements.",
    faIcon: faCommentDots,
  },
  {
    title: "Formatting tips",
    description: "Optimize document length, bullet structure, date formatting, and layout consistency.",
    faIcon: faPen,
  },
  {
    title: "Tailored suggestions",
    description: "Receive role-specific feedback structured specifically for engineers, designers, or managers.",
    faIcon: faTrophy,
  },
  {
    title: "Downloadable report",
    description: "Export a beautiful, shareable PDF summary of your analysis and improved metrics.",
    faIcon: faDownload,
  },
];

import { useMemo } from "react";
import CircularGallery from "./CircularGallery";

// Reusable offscreen canvas — avoids creating and GC-ing 8 canvases on every call
let _sharedCanvas: HTMLCanvasElement | null = null;
function getSharedCanvas(w: number, h: number) {
  if (!_sharedCanvas) _sharedCanvas = document.createElement("canvas");
  _sharedCanvas.width = w;
  _sharedCanvas.height = h;
  return _sharedCanvas;
}

function createFeatureCard(title: string, description: string, faIcon: any) {
  const canvas = getSharedCanvas(800, 1000);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background
  ctx.fillStyle = "#161616"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft border gradient feeling
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // Draw FontAwesome Vector Icon
  if (faIcon && faIcon.icon) {
    const svgPathData = faIcon.icon[4];
    const iconWidth = faIcon.icon[0];
    const iconHeight = faIcon.icon[1];
    
    // Scale safely so the icon bounds are 120x120
    const maxIconSize = 120;
    const scale = Math.min(maxIconSize / iconWidth, maxIconSize / iconHeight);
    
    const drawX = canvas.width / 2 - (iconWidth * scale) / 2;
    const drawY = 100; // Place closer to the top
    
    ctx.save();
    ctx.translate(drawX, drawY);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff"; // White icon with primary title stands out
    const p = new Path2D(svgPathData as string);
    ctx.fill(p);
    ctx.restore();
  }

  // Title
  ctx.fillStyle = "#22c55e"; 
  ctx.font = "bold 65px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, canvas.width / 2, 300);

  // Description - Multiline wrap
  ctx.fillStyle = "#e5e5e5"; 
  ctx.font = "40px 'Sora', sans-serif";
  const words = description.split(" ");
  let line = "";
  let y = 430;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > canvas.width - 120 && n > 0) {
      ctx.fillText(line.trim(), canvas.width / 2, y);
      line = words[n] + " ";
      y += 65;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), canvas.width / 2, y);

  // Use JPEG at 85% quality instead of PNG — ~60% smaller data URIs for the same visual output
  return canvas.toDataURL("image/jpeg", 0.85);
}

const FeaturesSection = () => {
  // Translate features to gallery items formatting ONCE
  // Wrapping in useMemo prevents massive stutter caused by creating 8 heavy HTML canvases and converting them to Base64 strings on every internal React render/paint loop.
  const galleryItems = useMemo(() => features.map((feature) => ({
    image: createFeatureCard(feature.title, feature.description, feature.faIcon),
    text: "", 
  })), []);

  return (
    <section id="features" className="relative bg-transparent overflow-hidden pointer-events-none">
      {/* Content wrapper matching Hero section left-aligned layout */}
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md lg:max-w-3xl px-6 md:px-10 pt-32 pb-4 pointer-events-none">
        
        {/* 'Capabilities' as small highlight */}
        <p 
          className="opacity-0 animate-fade-up text-primary font-semibold tracking-wide uppercase text-sm mb-4 md:mb-6" 
          style={{ animationDelay: "0.1s" }}
        >
          Capabilities
        </p>

        {/* Heading matching Hero 'clamp(3rem,8vw,6rem)' */}
        <h1
          className="opacity-0 animate-fade-up text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-3 md:mb-6 uppercase"
          style={{ animationDelay: "0.2s" }}
        >
          Everything you need for the <span className="text-primary">perfect</span> application
        </h1>

        {/* Subheading/Description matching Hero font-light structure */}
        <p
          className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8"
          style={{ animationDelay: "0.3s" }}
        >
          Our granular AI engine evaluates every word on your resume against proven hiring benchmarks.
        </p>
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 pb-20 mt-8">
        <div className="relative w-full h-[50vh] md:h-[60vh] pointer-events-auto rounded-3xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-sm border border-white/10">
           <CircularGallery items={galleryItems} bend={3} textColor="#ffffff" borderRadius={0.05} font="bold 30px Sora" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

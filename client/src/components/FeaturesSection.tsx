// FeaturesSection: feature cards overlaid on Image 2 background, with Lucide icons
import {
  FileSearch,
  BarChart3,
  LayoutList,
  Search,
  MessageSquareText,
  AlignLeft,
  UserCheck,
  Download,
} from "lucide-react";

const features = [
  {
    title: "Resume parsing",
    description: "Extract text seamlessly from PDF/DOCX uploads without losing formatting details.",
    icon: FileSearch,
  },
  {
    title: "ATS score",
    description: "Find out exactly how well your resume reads to modern Applicant Tracking Systems.",
    icon: BarChart3,
  },
  {
    title: "Section analysis",
    description: "Get individualized scores for your Summary, Skills, Experience, and Education.",
    icon: LayoutList,
  },
  {
    title: "Keyword gap analysis",
    description: "Paste a job description and instantly discover the critical keywords you're missing.",
    icon: Search,
  },
  {
    title: "Tone & language check",
    description: "Identify and eliminate passive voice, weak verbs, and unquantified statements.",
    icon: MessageSquareText,
  },
  {
    title: "Formatting tips",
    description: "Optimize document length, bullet structure, date formatting, and layout consistency.",
    icon: AlignLeft,
  },
  {
    title: "Tailored suggestions",
    description: "Receive role-specific feedback structured specifically for engineers, designers, or managers.",
    icon: UserCheck,
  },
  {
    title: "Downloadable report",
    description: "Export a beautiful, shareable PDF summary of your analysis and improved metrics.",
    icon: Download,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative min-h-screen overflow-hidden">
      {/* Background image — fixed for parallax feel */}
      <div className="absolute inset-0">
        <img
          src="/image-2.png"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        {/* Top gradient fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-white/40 uppercase tracking-wider mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need for the <span className="text-red-500">perfect</span> application
          </h2>
          <p className="text-white/50 mb-12 max-w-2xl">
            Our granular AI engine evaluates every word on your resume against proven hiring benchmarks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(16px) saturate(150%)",
                    WebkitBackdropFilter: "blur(16px) saturate(150%)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-red-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import { UploadCloud, Cpu, Target, FileCheck } from "lucide-react";

import BorderGlow from "./BorderGlow";

const steps = [
  {
    id: "01",
    title: "Upload Document",
    description: "Simply drag and drop your PDF or DOCX file into our secure platform. Your data remains completely private and encrypted.",
    icon: UploadCloud,
  },
  {
    id: "02",
    title: "AI Analysis",
    description: "Our application sends your document directly to Google Gemini AI to analyze your syntax, grammar, and career experience accurately.",
    icon: Cpu,
  },
  {
    id: "03",
    title: "Deep ATS Analysis",
    description: "We cross-reference your structure and keyword density against thousands of modern Applicant Tracking System algorithm benchmarks.",
    icon: Target,
  },
  {
    id: "04",
    title: "Actionable Insights",
    description: "Receive a comprehensive granular report detailing your exact score alongside personalized, line-by-line recommendations.",
    icon: FileCheck,
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative bg-transparent overflow-hidden pointer-events-none pb-20">
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md lg:max-w-4xl px-6 md:px-10 pt-32 pb-12 pointer-events-none">
        <p 
          className="opacity-0 animate-fade-up text-primary font-semibold tracking-wide uppercase text-sm mb-4 md:mb-6" 
          style={{ animationDelay: "0.1s" }}
        >
          Process
        </p>

        <h1
          className="opacity-0 animate-fade-up text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-3 md:mb-6 uppercase"
          style={{ animationDelay: "0.2s" }}
        >
          How <span className="text-primary">Resume IQ</span> Works
        </h1>

        <p
          className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8 max-w-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          Four simple steps to transform your application from a standard document into an interview-generating asset.
        </p>
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 pointer-events-auto">
        <div className="max-w-5xl mx-auto relative pt-10 pb-20">
          {/* Central line design for timeline look - Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary to-transparent -translate-x-1/2 rounded-full" />
          
           {/* Left-aligned line for mobile */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary to-transparent rounded-full" />

          <div className="flex flex-col gap-12 md:gap-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0; // Left side

              return (
                <div 
                  key={step.id} 
                  className={`relative flex w-full ${isEven ? "md:justify-start" : "md:justify-end"} ${index !== 0 ? "md:-mt-12 lg:-mt-24" : ""}`}
                >
                  {/* Connecting Node Desktop */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 w-5 h-5 rounded-full bg-black border-[4px] border-primary shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10 -translate-x-1/2 -translate-y-1/2" />
                  
                  {/* Connecting Node Mobile */}
                  <div className="md:hidden absolute top-1/2 left-8 w-5 h-5 rounded-full bg-black border-[4px] border-primary shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10 -translate-x-1/2 -translate-y-1/2" />

                  {/* Card Container */}
                  <div 
                    className={`w-full md:w-[calc(50%-3rem)] opacity-0 animate-fade-up pl-16 md:pl-0`}
                    style={{ animationDelay: `${0.4 + index * 0.15}s` }}
                  >
                    <BorderGlow 
                      className={`w-full group ${isEven ? "md:text-right" : "md:text-left"}`}
                      borderRadius={24}
                    >
                      <div className="flex flex-col p-8 backdrop-blur-md">
                        <dt className={`flex items-center gap-x-5 mb-5 ${isEven ? "md:flex-row-reverse" : "md:flex-row"}`}>
                          <div className="flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <step.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                          </div>
                          <div className={`flex flex-col ${isEven ? "md:items-end" : "md:items-start"}`}>
                            <span className="text-primary/80 text-sm font-bold font-mono tracking-widest">STEP {step.id}</span>
                            <span className="text-2xl font-bold leading-tight text-foreground mt-1">{step.title}</span>
                          </div>
                        </dt>

                        <dd className={`flex flex-auto flex-col text-base leading-relaxed text-muted-foreground/90 font-light ${isEven ? "md:items-end" : "md:items-start"}`}>
                          <p className="flex-auto max-w-sm">{step.description}</p>
                        </dd>
                      </div>
                    </BorderGlow>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

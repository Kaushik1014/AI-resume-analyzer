import { useState, useCallback } from "react";
import { ChevronDown, HelpCircle, Shield, FileText, Cpu, Target } from "lucide-react";
import BorderGlow from "./BorderGlow";

const faqs = [
  {
    question: "How does Resume IQ actually score my document?",
    answer: "Our application uses Google Gemini AI to analyze your syntax, layout constraints, and keyword density. We prompt the AI to evaluate this against standard Applicant Tracking System (ATS) benchmarks to generate a precise viability score.",
    icon: Cpu
  },
  {
    question: "Is my uploaded resume data completely secure?",
    answer: "Absolutely. We adhere to strict zero-retention policies. Your private contact information and career history are processed ephemerally on heavily encrypted instances—we do not store, log, or sell your documents.",
    icon: Shield
  },
  {
    question: "Which file formats are supported for analysis?",
    answer: "Resume IQ seamlessly parses both standard Adobe PDF (.pdf) and Microsoft Word (.docx) file formats, ensuring no structural formatting or text data is lost during the extraction process.",
    icon: FileText
  },
  {
    question: "What exactly is an ATS algorithm?",
    answer: "An Applicant Tracking System (ATS) is automated filtering software utilized by over 99% of Fortune 500 companies. It scans and scores resumes before a human recruiter ever sees them. Our goal is to optimize your document specifically to pass these robotic gates.",
    icon: Target
  },
  {
    question: "Are the recommendations tailored to a specific industry?",
    answer: "Yes. Before running the full diagnostic, our AI models dynamically adjust the keyword scoring thresholds based on the specific job description and industry umbrella you provide.",
    icon: HelpCircle
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Initialize first open

  // Stable callback — avoids creating a new closure on every render for each FAQ item
  const handleToggle = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <section className="relative bg-transparent overflow-hidden pointer-events-none pb-24">
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md lg:max-w-4xl px-6 md:px-10 pt-32 pb-8 pointer-events-none">
        <p
          className="opacity-0 animate-fade-up text-primary font-semibold tracking-wide uppercase text-sm mb-4 md:mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          Knowledge Base
        </p>

        <h1
          className="opacity-0 animate-fade-up text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-4 uppercase"
          style={{ animationDelay: "0.2s" }}
        >
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>

        <p
          className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.125rem)] font-light mb-4 md:mb-8 max-w-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          Everything you need to know about our AI processing, data security protocol, and resume optimizations.
        </p>
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 pointer-events-auto">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 relative">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;

            return (
              <div
                key={index}
                className="opacity-0 w-full animate-fade-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <BorderGlow
                  className="w-full cursor-pointer"
                  borderRadius={24}
                >
                  <div
                    className="relative p-6 md:px-8 md:py-6 bg-black/40 backdrop-blur-md outline-none transition-colors duration-500"
                    onClick={() => handleToggle(index)}
                  >
                    <div className="flex items-center justify-between pointer-events-none gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex shrink-0 items-center justify-center w-12 h-12 rounded-xl border transition-colors duration-500 ${isOpen ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className={`text-lg sm:text-xl font-medium transition-colors duration-300 ${isOpen ? "text-primary shadow-primary" : "text-foreground"}`}>
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-full transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${isOpen ? "rotate-180 bg-primary text-black" : "bg-white/5 text-muted-foreground"}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Expandable Answer using Grid rows animation */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${isOpen ? "grid-rows-[1fr] opacity-100 mt-6 md:ml-16" : "grid-rows-[0fr] opacity-0 mt-0 md:ml-16"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-muted-foreground/90 font-light leading-relaxed pb-2 text-[0.95rem] sm:text-base pr-4">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </BorderGlow>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

import { useState, useCallback } from "react";
import { ChevronDown, HelpCircle, Shield, FileType, Bot, Target } from "lucide-react";

const faqs = [
  { question: "How does Resume IQ actually score my document?", answer: "Our application uses Google Gemini AI to analyze your syntax, layout constraints, and keyword density. We prompt the AI to evaluate this against standard Applicant Tracking System (ATS) benchmarks to generate a precise viability score.", icon: Bot },
  { question: "Is my uploaded resume data completely secure?", answer: "Absolutely. We adhere to strict zero-retention policies. Your private contact information and career history are processed ephemerally on heavily encrypted instances—we do not store, log, or sell your documents.", icon: Shield },
  { question: "Which file formats are supported for analysis?", answer: "Resume IQ seamlessly parses both standard Adobe PDF (.pdf) and Microsoft Word (.docx) file formats, ensuring no structural formatting or text data is lost during the extraction process.", icon: FileType },
  { question: "What exactly is an ATS algorithm?", answer: "An Applicant Tracking System (ATS) is automated filtering software utilized by over 99% of Fortune 500 companies. It scans and scores resumes before a human recruiter ever sees them. Our goal is to optimize your document specifically to pass these robotic gates.", icon: HelpCircle },
  { question: "Are the recommendations tailored to a specific industry?", answer: "Yes. Before running the full diagnostic, our AI models dynamically adjust the keyword scoring thresholds based on the specific job description and industry umbrella you provide.", icon: Target },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section id="faq" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src="/image-4.png" alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>
      <div className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-white/40" />
            <p className="text-sm text-white/40 uppercase tracking-wider">Knowledge Base</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>
          <p className="text-white/50 mb-12">Everything you need to know about our AI processing, data security protocol, and resume optimizations.</p>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const Icon = faq.icon;
              return (
                <div key={index} className="rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)", backdropFilter: "blur(16px) saturate(150%)", WebkitBackdropFilter: "blur(16px) saturate(150%)", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                  <button onClick={() => handleToggle(index)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isOpen ? "bg-red-500/20 border-red-500/30" : "bg-white/5 border-white/10"} border`}>
                        <Icon className={`w-4 h-4 transition-colors duration-300 ${isOpen ? "text-red-400" : "text-white/40"}`} />
                      </div>
                      <span className={`text-base font-medium transition-colors duration-300 ${isOpen ? "text-red-400" : "text-white"}`}>{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 pl-[4.25rem] text-sm text-white/50 leading-relaxed">{faq.answer}</p>
                    </div>
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

export default FaqSection;

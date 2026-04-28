// Analyzer: Hero section with file upload zone and floating chatbot
import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import HistoryPanel from "@/components/HistoryPanel";
import ATSGraph from "@/components/ATSGraph";
import SectionScores from "@/components/SectionScores";
import MissingKeywords from "@/components/MissingKeywords";
import ToneAnalysis from "@/components/ToneAnalysis";
import FormattingTips from "@/components/FormattingTips";
import RoleSuggestions from "@/components/RoleSuggestions";
import ResumePDFReport from "@/components/ResumePDFReport";
import FileUploadZone, { AttachIcon } from "@/components/FileUploadZone";
import ChatbotWidget from "@/components/ChatbotWidget";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Robustly extract JSON from an AI response string.
 * Handles: raw JSON, ```json fences, ``` fences, mixed text around JSON.
 */
function parseAIResponse(raw) {
  if (!raw || typeof raw !== "string") return null;
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && parsed.atsScore !== undefined) return parsed;
  } catch (e) {
    // continue
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const substr = text.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(substr);
      if (parsed && typeof parsed === "object" && parsed.atsScore !== undefined) return parsed;
    } catch (e) {
      // not valid JSON
    }
  }

  return null;
}

const Analyzer = () => {
  const { firebaseUser } = useAuth();
  const [chatSession, setChatSession] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [lastParsedData, setLastParsedData] = useState(null);
  const pdfReportRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!pdfReportRef.current) return;
    try {
      const canvas = await html2canvas(pdfReportRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = pdfWidth / canvas.width;
      let heightLeft = canvas.height * ratio;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, canvas.height * ratio);
      heightLeft -= pdfHeight;
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, canvas.height * ratio);
        heightLeft -= pdfHeight;
      }
      pdf.save("Resume_Analysis_Report.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const handleFileUpload = async ({ prompt, file }) => {
    if (!firebaseUser) {
      setError("You must be logged in to use this feature.");
      return;
    }
    const historyContext = [...chatSession];
    const newUserMsg = { role: "user", text: prompt || "", fileName: file?.name };
    setChatSession((prev) => [...prev, newUserMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const token = await firebaseUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      let res;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        if (prompt) formData.append("prompt", prompt);
        formData.append("historyContext", JSON.stringify(historyContext));
        res = await fetch(`${apiUrl}/analyze/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch(`${apiUrl}/analyze/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ prompt, historyContext }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate response");

      setChatSession((prev) => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setChatSession((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-hero-bg overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/image-6.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 bg-black/50 z-[1] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <div><Navbar /></div>

        <div className="flex-1 flex flex-col items-center justify-start mt-16 sm:mt-20 px-3 sm:px-6 md:px-10 pb-24 sm:pb-32" style={{ gap: 44 }}>
          {chatSession.length === 0 ? (
            <>
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto" style={{ gap: 34 }}>
                <h1 className="font-fustat font-bold text-foreground opacity-0 animate-fade-up uppercase" style={{ fontSize: "clamp(3rem,8vw,5.5rem)", letterSpacing: "-0.05em", lineHeight: 1, animationDelay: "0.2s" }}>
                  Analyze Your <span className="text-red-500">Resume</span>
                </h1>
                <p className="font-fustat font-light text-center text-foreground/80 opacity-0 animate-fade-up" style={{ fontSize: "clamp(1.125rem,2vw,1.25rem)", letterSpacing: "-0.02em", maxWidth: 736, width: "100%", animationDelay: "0.4s" }}>
                  Upload your resume to get powerful AI-driven insights, ratings, and personalized feedback. Land your dream job effortlessly.
                </p>
              </div>
              <div className="w-full flex justify-center">
                <FileUploadZone onUpload={handleFileUpload} isLoading={isLoading} onOpenHistory={() => setIsHistoryOpen(true)} />
              </div>
            </>
          ) : (
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 mb-8 animate-fade-in mt-4 sm:mt-6">
              {chatSession.map((msg, idx) => (
                <div key={idx} className={`w-full p-4 sm:p-6 sm:px-8 rounded-2xl sm:rounded-[24px] border shadow-lg ${msg.role === "user" ? "bg-white/10 ml-auto max-w-2xl border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "bg-black/60 backdrop-blur-2xl max-w-3xl border-white/10"}`}>
                  {msg.role === "user" ? (
                    <div className="text-white/95">
                      {msg.fileName && (<div className="flex items-center gap-2 text-red-500 text-sm mb-3 font-semibold bg-red-500/10 w-fit px-3 py-1.5 rounded-lg"><AttachIcon /> {msg.fileName}</div>)}
                      {msg.text && <p className="font-schibsted text-lg leading-relaxed">{msg.text}</p>}
                    </div>
                  ) : (
                    <div className="font-schibsted text-white/90 text-sm md:text-base leading-relaxed [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1 [&>strong]:text-white">
                      {(() => {
                        const parsedData = parseAIResponse(msg.text);

                        if (parsedData) {
                          if (!lastParsedData || lastParsedData.atsScore !== parsedData.atsScore) {
                            setTimeout(() => setLastParsedData(parsedData), 0);
                          }
                          return (
                            <>
                              <ATSGraph score={parsedData.atsScore} />
                              {parsedData.sectionScores && <SectionScores scores={parsedData.sectionScores} />}
                              {parsedData.roleSpecificFeedback && <RoleSuggestions roleData={parsedData.roleSpecificFeedback} />}
                              {parsedData.missingKeywords && <MissingKeywords keywords={parsedData.missingKeywords} />}
                              {parsedData.toneCheck && <ToneAnalysis toneData={parsedData.toneCheck} />}
                              {parsedData.formattingTips && <FormattingTips formattingData={parsedData.formattingTips} />}
                              <ReactMarkdown>{parsedData.feedback}</ReactMarkdown>
                              <button onClick={handleDownloadPDF} className="mt-6 flex items-center gap-2.5 px-6 py-3 rounded-xl font-schibsted font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 mx-auto" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Download PDF Report
                              </button>
                            </>
                          );
                        }
                        return <ReactMarkdown>{msg.text}</ReactMarkdown>;
                      })()}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="w-full max-w-3xl p-6 sm:px-8 rounded-[24px] border border-white/10 shadow-lg bg-black/60 backdrop-blur-2xl flex items-center gap-4 text-white/70 h-20">
                  <div className="w-6 h-6 border-[3px] border-red-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="font-schibsted animate-pulse text-base font-medium">Generating AI insights...</span>
                </div>
              )}

              {error && (
                <div className="w-full max-w-3xl text-red-400 font-schibsted p-5 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <strong className="block mb-1 text-lg">Error</strong>
                  <span className="opacity-80">{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ChatbotWidget firebaseUser={firebaseUser} />
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <ResumePDFReport ref={pdfReportRef} data={lastParsedData} />
    </div>
  );
};

export default Analyzer;

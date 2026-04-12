// Dashboard: Hero section with looping video background, custom fade,
// navigation bar, badge, headline, and prompt input — shown after login.
import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";

const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import HistoryPanel from "@/components/HistoryPanel";

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





// ─── Search / Prompt Input Box ───
function PromptInput({ onSubmit, isLoading, onOpenHistory }) {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const maxChars = 3000;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((query.trim() || file) && !isLoading) {
        onSubmit({ prompt: query.trim(), file });
        setQuery("");
        setFile(null);
      }
    }
  };

  const handleSend = () => {
    if ((query.trim() || file) && !isLoading) {
      onSubmit({ prompt: query.trim(), file });
      setQuery("");
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="p-3">
        <div
          className={`bg-white/10 rounded-xl shadow-inner flex items-center px-4 border transition-colors ${
            isLoading ? "border-white/5 opacity-70" : "border-white/10 focus-within:border-primary/50"
          }`}
          style={{ height: 80 }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) setQuery(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Analyzing prompt..." : "Type question..."}
            className="flex-1 bg-transparent outline-none font-schibsted relative z-10"
            style={{
              fontSize: 16,
              color: "#ffffff",
              caretColor: "#ffffff",
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${
              isLoading 
                ? "bg-primary/50 cursor-not-allowed" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
            style={{ width: 36, height: 36 }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </button>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-5 pb-4"
      >
        <div className="flex items-center gap-2 text-white/70">
          <input 
            type="file" 
            accept=".pdf,.txt" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors hover:text-white"
            style={{
              background: "rgba(255,255,255,0.08)",
              fontSize: 12,
            }}
          >
            <AttachIcon />
            <span className="font-schibsted font-medium">Attach</span>
          </button>
          
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors hover:text-white"
            style={{
              background: "rgba(255,255,255,0.08)",
              fontSize: 12,
            }}
          >
            <SearchIcon />
            <span className="font-schibsted font-medium">History</span>
          </button>

          {file && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/20 text-primary-foreground border border-primary/30" style={{ fontSize: 12 }}>
              <span className="font-schibsted font-medium truncate max-w-[150px]">{file.name}</span>
              <button onClick={() => setFile(null)} className="hover:text-red-400 transition-colors">
                &times;
              </button>
            </div>
          )}
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
  const { firebaseUser } = useAuth();
  const [chatSession, setChatSession] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleNewChat = () => {
    setChatSession([]);
    setError(null);
  };

  // Forward wheel events from Spline canvas to page scroll
  const handleBackgroundWheel = useCallback((e) => {
    window.scrollBy(0, e.deltaY);
  }, []);

  const handlePromptSubmit = async ({ prompt, file }) => {
    if (!firebaseUser) {
      setError("You must be logged in to use this feature.");
      return;
    }

    // Capture current session for history before updating state
    const historyContext = [...chatSession];
    
    // Add user message temporarily
    const newUserMsg = { role: "user", text: prompt || "", fileName: file?.name };
    setChatSession(prev => [...prev, newUserMsg]);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(`${apiUrl}/analyze/prompt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt, historyContext }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate response");
      }

      setChatSession(prev => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Remove temporary message on error
      setChatSession(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-hero-bg overflow-x-hidden flex flex-col"> {/* Updated background to match AuthPage */}
      {/* ─── Spline 3D Background ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden" onWheel={handleBackgroundWheel}>
        <div className="w-[50%] h-[50%] origin-top-left scale-[2]">
          <Suspense fallback={<div className="absolute inset-0 bg-hero-bg" />}>
            <Spline
              scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
              className="w-full h-full"
            />
          </Suspense>
        </div>
      </div>

      <div className="fixed inset-0 bg-black/40 z-[1] pointer-events-none" />

      <div className="relative z-10 w-full pointer-events-none flex flex-col min-h-screen">
        <div className="pointer-events-auto">
          <Navbar onNewChat={chatSession.length > 0 ? handleNewChat : undefined} />
        </div>

        <div
          className="flex-1 flex flex-col items-center justify-start mt-20 px-6 sm:px-10 pb-32"
          style={{ gap: 44 }}
        >
          {chatSession.length === 0 ? (
            <div
              className="flex flex-col items-center text-center max-w-4xl mx-auto pointer-events-auto"
              style={{ gap: 34 }}
            >
              <h1
                className="font-fustat font-bold text-foreground opacity-0 animate-fade-up uppercase"
                style={{
                  fontSize: "clamp(3rem,8vw,5.5rem)",
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  animationDelay: "0.2s"
                }}
              >
                Analyze Your <span className="text-primary">Resume</span>
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
                Paste your resume details or ask specific career questions to get powerful AI-driven insights right away. Land your dream job effortlessly.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pointer-events-auto mb-8 animate-fade-in mt-6">
               
               {chatSession.map((msg, idx) => (
                 <div key={idx} className={`w-full p-6 sm:px-8 rounded-[24px] border shadow-lg ${msg.role === 'user' ? 'bg-white/10 ml-auto max-w-2xl border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'bg-black/60 backdrop-blur-2xl max-w-3xl border-white/10'}`}>
                   {msg.role === 'user' ? (
                     <div className="text-white/95">
                       {msg.fileName && (
                         <div className="flex items-center gap-2 text-primary text-sm mb-3 font-semibold bg-primary/10 w-fit px-3 py-1.5 rounded-lg">
                           <AttachIcon /> {msg.fileName}
                         </div>
                       )}
                       {msg.text && <p className="font-schibsted text-lg leading-relaxed">{msg.text}</p>}
                     </div>
                   ) : (
                     <div className="font-schibsted text-white/90 text-sm md:text-base leading-relaxed [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>li]:mb-1 [&>strong]:text-white">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                     </div>
                   )}
                 </div>
               ))}
               
               {isLoading && (
                 <div className="w-full max-w-3xl p-6 sm:px-8 rounded-[24px] border border-white/10 shadow-lg bg-black/60 backdrop-blur-2xl flex items-center gap-4 text-white/70 h-20">
                   <div className="w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
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

          <div 
            className={`w-full flex justify-center flex-col items-center pointer-events-auto transition-all duration-500 ${chatSession.length > 0 ? 'sticky bottom-10 z-20 max-w-4xl opacity-100' : 'opacity-0 animate-fade-up max-w-[728px]'}`} 
            style={{ animationDelay: chatSession.length > 0 ? "0s" : "0.6s" }}
          >
            <div className="w-full bg-black/40 backdrop-blur-3xl rounded-[24px] p-2 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <PromptInput 
                onSubmit={handlePromptSubmit} 
                isLoading={isLoading} 
                onOpenHistory={() => setIsHistoryOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Off-canvas History Panel */}
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};

export default Dashboard;

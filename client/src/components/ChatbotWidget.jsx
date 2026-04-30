import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ArrowUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 14.25V3.75M9 3.75L4.5 8.25M9 3.75L13.5 8.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.5 13.417C24.503 14.884 24.157 16.332 23.492 17.644C22.703 19.224 21.489 20.555 19.990 21.487C18.491 22.420 16.763 22.917 15.000 22.917C13.533 22.920 12.085 22.574 10.773 21.908L3.500 24.500L6.092 17.227C5.427 15.915 5.080 14.467 5.083 13.000C5.083 11.237 5.580 9.509 6.513 8.010C7.445 6.511 8.776 5.297 10.356 4.508C11.668 3.843 13.116 3.497 14.583 3.500H15.000C17.340 3.629 19.553 4.593 21.230 6.270C22.907 7.947 23.871 10.160 24.000 12.500V13.417Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function ChatbotWidget({ firebaseUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Hi! I'm your Resume AI assistant. Ask me anything about resumes, career advice, or interview tips!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);
  useEffect(() => { if (!isLoading && isOpen && inputRef.current) inputRef.current.focus(); }, [isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !firebaseUser) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/analyze/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: userMsg, saveHistory: false, historyContext: messages.filter((m) => m.role !== "ai" || messages.indexOf(m) !== 0) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");
      setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I encountered an error. Please try again." }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <div className={`transition-all duration-400 origin-bottom-right ${isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 translate-y-4 pointer-events-none"}`} style={{ width: 380, maxWidth: "calc(100vw - 48px)" }}>
        <div className="rounded-[24px] overflow-hidden flex flex-col" style={{ height: 520, maxHeight: "calc(100vh - 140px)", background: "linear-gradient(180deg, rgba(18,18,22,0.97) 0%, rgba(10,10,14,0.98) 100%)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)", backdropFilter: "blur(40px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 72%, 45%))", boxShadow: "0 2px 12px rgba(239,68,68,0.3)" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L11 5L15 5.5L12 8.5L13 13L9 11L5 13L6 8.5L3 5.5L7 5L9 1Z" fill="#000" /></svg>
              </div>
              <div>
                <h3 className="font-fustat font-bold text-white text-sm tracking-wide">Resume AI</h3>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /><span className="font-schibsted text-white/40 text-xs">Online</span></div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><MinimizeIcon /></button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl font-schibsted text-sm leading-relaxed ${msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                  style={{ background: msg.role === "user" ? "linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 72%, 51%))" : "rgba(255,255,255,0.06)", color: msg.role === "user" ? "#000" : "rgba(255,255,255,0.85)", border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
                  {msg.role === "ai" ? (<div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>li]:mb-0.5 [&>strong]:text-white"><ReactMarkdown>{msg.text}</ReactMarkdown></div>) : (<p>{msg.text}</p>)}
                </div>
              </div>
            ))}
            {isLoading && (<div className="flex justify-start"><div className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}><div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} /><div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} /><div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} /></div></div></div>)}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2 rounded-xl px-4 transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", height: 46 }}>
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} placeholder={isLoading ? "Thinking..." : "Ask me anything..."} className="flex-1 bg-transparent outline-none font-schibsted text-sm" style={{ color: "#fff", caretColor: "#fff" }} />
              <button onClick={handleSend} disabled={!input.trim() || isLoading} className="flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed" style={{ width: 32, height: 32, background: input.trim() ? "linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 72%, 51%))" : "rgba(255,255,255,0.08)", color: input.trim() ? "#000" : "rgba(255,255,255,0.4)" }}><ArrowUpIcon /></button>
            </div>
          </div>
        </div>
      </div>
      {/* FAB */}
      <button onClick={() => setIsOpen(!isOpen)} className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto"
        style={{ background: isOpen ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 72%, 45%))", boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 30px rgba(239,68,68,0.4), 0 0 60px rgba(239,68,68,0.15)", color: isOpen ? "#fff" : "#000", border: isOpen ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
        <div className="transition-transform duration-300">{isOpen ? <CloseIcon /> : <ChatBubbleIcon />}</div>
        {!isOpen && <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(239,68,68,0.2)", animationDuration: "2s" }} />}
      </button>
    </div>
  );
}

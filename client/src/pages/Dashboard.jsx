// Dashboard: Hero section with file upload zone and floating chatbot,
// navigation bar, badge, headline — shown after login.
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

const UploadCloudIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 32L24 24L16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 24V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40.78 36.78C42.732 35.715 44.197 33.942 44.8948 31.8284C45.5926 29.7147 45.4737 27.4207 44.5607 25.3878C43.6477 23.3549 41.9999 21.7342 39.9373 20.8536C37.8746 19.9729 35.5466 19.8976 33.44 20.64L32 20.64C31.3084 17.682 29.8136 14.9806 27.6914 12.842C25.5693 10.7033 22.9044 9.2003 20.0086 8.49803C17.1128 7.79576 14.0986 7.91999 11.2641 8.85752C8.42963 9.79506 5.88458 11.5089 3.92563 13.8112C1.96669 16.1134 0.667082 18.913 0.167148 21.8992C-0.332787 24.8855 -0.0140946 27.948 1.08949 30.7704C2.19308 33.5928 4.03695 36.0563 6.42285 37.8833C8.80876 39.7102 11.6401 40.8297 14.64 41.12H32C34.0288 41.12 35.998 40.4432 37.5869 39.1943C39.1758 37.9455 40.2922 36.1953 40.78 34.22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 32L24 24L16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.667 1.667H5.000C4.558 1.667 4.135 1.842 3.822 2.155C3.510 2.467 3.334 2.891 3.334 3.334V16.667C3.334 17.109 3.510 17.533 3.822 17.845C4.135 18.158 4.558 18.334 5.000 18.334H15.000C15.442 18.334 15.866 18.158 16.178 17.845C16.491 17.533 16.667 17.109 16.667 16.667V6.667L11.667 1.667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.667 1.667V6.667H16.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.333 9.233V10.000C18.332 11.797 17.748 13.545 16.675 14.987C15.601 16.428 14.095 17.487 12.379 18.012C10.663 18.536 8.828 18.498 7.134 17.903C5.441 17.309 3.979 16.188 2.964 14.703C1.949 13.218 1.434 11.447 1.496 9.652C1.558 7.856 2.192 6.125 3.306 4.714C4.420 3.303 5.955 2.285 7.687 1.807C9.418 1.329 11.255 1.416 12.933 2.058" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.333 3.333L10 11.675L7.5 9.175" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M5.333 4V2.667C5.333 2.313 5.474 1.974 5.724 1.724C5.974 1.474 6.313 1.333 6.667 1.333H9.333C9.687 1.333 10.026 1.474 10.276 1.724C10.526 1.974 10.667 2.313 10.667 2.667V4M12 4V13.333C12 13.687 11.860 14.026 11.610 14.276C11.360 14.526 11.020 14.667 10.667 14.667H5.333C4.980 14.667 4.640 14.526 4.390 14.276C4.140 14.026 4 13.687 4 13.333V4H12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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


// ─── File Upload Zone ───
function FileUploadZone({ onUpload, isLoading, onOpenHistory }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const acceptedTypes = [".pdf", ".txt", ".doc", ".docx"];

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file) => {
    if (!file) return;
    setUploadedFile(file);
    setIsUploaded(false);
    setUploadProgress(0);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploaded(true);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploaded(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (uploadedFile && isUploaded && !isLoading) {
      onUpload({ prompt: "", file: uploadedFile });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto opacity-0 animate-fade-up"
      style={{ animationDelay: "0.6s" }}
    >
      {/* Upload Card */}
      <div
        className="relative rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Glow effect on drag */}
        <div
          className="absolute inset-0 rounded-[28px] transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: isDragging ? 1 : 0,
            background: "radial-gradient(600px circle at center, rgba(34,197,94,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="p-6 md:p-8">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center ${
              uploadedFile ? "p-5" : "p-6 md:p-8"
            }`}
            style={{
              border: isDragging
                ? "2px solid hsl(119, 99%, 46%)"
                : uploadedFile
                ? "2px solid rgba(255,255,255,0.1)"
                : "2px dashed rgba(255,255,255,0.15)",
              background: isDragging
                ? "rgba(34,197,94,0.06)"
                : uploadedFile
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.02)",
              minHeight: uploadedFile ? "auto" : 150,
            }}
          >
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />

            {!uploadedFile ? (
              <>
                <div
                  className={`mb-3 transition-transform duration-300 ${isDragging ? "scale-110 -translate-y-1" : ""}`}
                  style={{ color: isDragging ? "hsl(119, 99%, 46%)" : "rgba(255,255,255,0.35)" }}
                >
                  <UploadCloudIcon />
                </div>

                <p className="font-fustat font-semibold text-white/90 text-base mb-1">
                  {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p className="font-schibsted text-white/45 text-sm mb-3">
                  or <span className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">browse files</span> from your computer
                </p>

                {/* Accepted file types */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {acceptedTypes.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full font-schibsted text-xs font-medium uppercase tracking-wider"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full">
                {/* File info */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: isUploaded
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(255,255,255,0.08)",
                      color: isUploaded
                        ? "hsl(119, 99%, 46%)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {isUploaded ? <CheckCircleIcon /> : <FileIcon />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-schibsted text-white/90 font-semibold text-sm truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="font-schibsted text-white/40 text-xs mt-0.5">
                      {formatFileSize(uploadedFile.size)}
                      {isUploaded && (
                        <span className="text-primary ml-2">• Ready to analyze</span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                    className="flex-shrink-0 p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>

                {/* Progress bar */}
                {!isUploaded && (
                  <div className="mt-4 w-full">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`,
                          background: "linear-gradient(90deg, hsl(119, 99%, 46%), hsl(119, 90%, 55%))",
                        }}
                      />
                    </div>
                    <p className="font-schibsted text-white/40 text-xs mt-2 text-right">
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:text-white group"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <AttachIcon />
                <span className="font-schibsted font-medium">Browse</span>
              </button>

              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:text-white group"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <SearchIcon />
                <span className="font-schibsted font-medium">History</span>
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!uploadedFile || !isUploaded || isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-schibsted font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: uploadedFile && isUploaded
                  ? "linear-gradient(135deg, hsl(119, 99%, 46%), hsl(119, 80%, 40%))"
                  : "rgba(255,255,255,0.06)",
                color: uploadedFile && isUploaded ? "#000" : "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: uploadedFile && isUploaded
                  ? "0 4px 20px rgba(34,197,94,0.3)"
                  : "none",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ArrowUpIcon />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Floating Chatbot Widget ───
function ChatbotWidget({ firebaseUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Hi! I'm your Resume AI assistant. Ask me anything about resumes, career advice, or interview tips!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userMsg,
          historyContext: messages.filter((m) => m.role !== "ai" || messages.indexOf(m) !== 0),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-auto">
      {/* Chat Window */}
      <div
        className={`transition-all duration-400 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
        style={{
          width: 380,
          maxWidth: "calc(100vw - 48px)",
        }}
      >
        <div
          className="rounded-[24px] overflow-hidden flex flex-col"
          style={{
            height: 520,
            maxHeight: "calc(100vh - 140px)",
            background: "linear-gradient(180deg, rgba(18,18,22,0.97) 0%, rgba(10,10,14,0.98) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
          }}
        >
          {/* Chat Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(119, 99%, 46%), hsl(119, 80%, 35%))",
                  boxShadow: "0 2px 12px rgba(34,197,94,0.3)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 1L11 5L15 5.5L12 8.5L13 13L9 11L5 13L6 8.5L3 5.5L7 5L9 1Z" fill="#000" />
                </svg>
              </div>
              <div>
                <h3 className="font-fustat font-bold text-white text-sm tracking-wide">Resume AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-schibsted text-white/40 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <MinimizeIcon />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl font-schibsted text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md"
                      : "rounded-bl-md"
                  }`}
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, hsl(119, 99%, 46%), hsl(119, 80%, 40%))"
                        : "rgba(255,255,255,0.06)",
                    color: msg.role === "user" ? "#000" : "rgba(255,255,255,0.85)",
                    border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {msg.role === "ai" ? (
                    <div className="[&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>li]:mb-0.5 [&>strong]:text-white [&>h1]:text-base [&>h1]:font-bold [&>h2]:text-sm [&>h2]:font-bold [&>h3]:text-sm [&>h3]:font-semibold">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div
            className="flex-shrink-0 px-4 py-3"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              className="flex items-center gap-2 rounded-xl px-4 transition-colors"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.06)",
                height: 46,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={isLoading ? "Thinking..." : "Ask me anything..."}
                className="flex-1 bg-transparent outline-none font-schibsted text-sm"
                style={{ color: "#fff", caretColor: "#fff" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  width: 32,
                  height: 32,
                  background: input.trim()
                    ? "linear-gradient(135deg, hsl(119, 99%, 46%), hsl(119, 80%, 40%))"
                    : "rgba(255,255,255,0.08)",
                  color: input.trim() ? "#000" : "rgba(255,255,255,0.4)",
                }}
              >
                <ArrowUpIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: isOpen
            ? "rgba(255,255,255,0.1)"
            : "linear-gradient(135deg, hsl(119, 99%, 46%), hsl(119, 80%, 35%))",
          boxShadow: isOpen
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 30px rgba(34,197,94,0.4), 0 0 60px rgba(34,197,94,0.15)",
          color: isOpen ? "#fff" : "#000",
          border: isOpen ? "1px solid rgba(255,255,255,0.1)" : "none",
        }}
      >
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-0"}`}>
          {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
        </div>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "rgba(34,197,94,0.2)",
              animationDuration: "2s",
            }}
          />
        )}
      </button>
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
            <>
              {/* Hero Heading */}
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
                    animationDelay: "0.2s",
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
                    animationDelay: "0.4s",
                  }}
                >
                  Upload your resume to get powerful AI-driven insights, ratings, and personalized feedback. Land your dream job effortlessly.
                </p>
              </div>

              {/* File Upload Zone */}
              <div className="w-full flex justify-center pointer-events-auto">
                <FileUploadZone
                  onUpload={handleFileUpload}
                  isLoading={isLoading}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              </div>
            </>
          ) : (
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pointer-events-auto mb-8 animate-fade-in mt-6">
              {chatSession.map((msg, idx) => (
                <div
                  key={idx}
                  className={`w-full p-6 sm:px-8 rounded-[24px] border shadow-lg ${
                    msg.role === "user"
                      ? "bg-white/10 ml-auto max-w-2xl border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                      : "bg-black/60 backdrop-blur-2xl max-w-3xl border-white/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="text-white/95">
                      {msg.fileName && (
                        <div className="flex items-center gap-2 text-primary text-sm mb-3 font-semibold bg-primary/10 w-fit px-3 py-1.5 rounded-lg">
                          <AttachIcon /> {msg.fileName}
                        </div>
                      )}
                      {msg.text && (
                        <p className="font-schibsted text-lg leading-relaxed">{msg.text}</p>
                      )}
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
                  <span className="font-schibsted animate-pulse text-base font-medium">
                    Generating AI insights...
                  </span>
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

      {/* Floating Chatbot Widget */}
      <ChatbotWidget firebaseUser={firebaseUser} />

      {/* Off-canvas History Panel */}
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};

export default Dashboard;

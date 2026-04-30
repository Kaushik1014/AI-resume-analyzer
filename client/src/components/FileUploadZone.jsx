import React, { useState, useRef } from "react";

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

const ArrowUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 14.25V3.75M9 3.75L4.5 8.25M9 3.75L13.5 8.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export { AttachIcon, ArrowUpIcon };

export default function FileUploadZone({ onUpload, isLoading, onOpenHistory }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);
  const acceptedTypes = [".pdf", ".txt", ".doc", ".docx"];

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current++; setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current--; if (dragCounterRef.current === 0) setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const processFile = (file) => {
    if (!file) return;
    setUploadedFile(file);
    setIsUploaded(false);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) { progress = 100; clearInterval(interval); setIsUploaded(true); }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); dragCounterRef.current = 0; const files = e.dataTransfer.files; if (files && files.length > 0) processFile(files[0]); };
  const handleFileSelect = (e) => { if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]); };
  const handleRemoveFile = () => { setUploadedFile(null); setUploadProgress(0); setIsUploaded(false); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const handleAnalyze = () => { if (uploadedFile && isUploaded && !isLoading) onUpload({ prompt: jobDescription, file: uploadedFile }); };
  const formatFileSize = (bytes) => { if (bytes < 1024) return bytes + " B"; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"; return (bytes / (1024 * 1024)).toFixed(1) + " MB"; };

  return (
    <div className="w-full max-w-5xl mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
      <div className="relative rounded-[28px] overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 rounded-[28px] transition-opacity duration-300 pointer-events-none" style={{ opacity: isDragging ? 1 : 0, background: "radial-gradient(600px circle at center, rgba(239,68,68,0.12) 0%, transparent 70%)" }} />
        <div className="p-6 md:p-8">
          <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => !uploadedFile && fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center ${uploadedFile ? "p-5" : "p-6 md:p-8"}`}
            style={{ border: isDragging ? "2px solid hsl(0, 84%, 60%)" : uploadedFile ? "2px solid rgba(255,255,255,0.1)" : "2px dashed rgba(255,255,255,0.15)", background: isDragging ? "rgba(239,68,68,0.06)" : uploadedFile ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)", minHeight: uploadedFile ? "auto" : 150 }}>
            <input type="file" accept=".pdf,.txt,.doc,.docx" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            {!uploadedFile ? (
              <>
                <div className={`mb-3 transition-transform duration-300 ${isDragging ? "scale-110 -translate-y-1" : ""}`} style={{ color: isDragging ? "hsl(0, 84%, 60%)" : "rgba(255,255,255,0.35)" }}><UploadCloudIcon /></div>
                <p className="font-fustat font-semibold text-white/90 text-base mb-1">{isDragging ? "Drop your resume here" : "Drag & drop your resume"}</p>
                <p className="font-schibsted text-white/45 text-sm mb-3">or <span className="text-red-500 underline underline-offset-4 decoration-red-500/40 hover:decoration-red-500 transition-colors">browse files</span> from your computer</p>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {acceptedTypes.map((type) => (<span key={type} className="px-3 py-1 rounded-full font-schibsted text-xs font-medium uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>{type}</span>))}
                </div>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: isUploaded ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)", color: isUploaded ? "hsl(0, 84%, 60%)" : "rgba(255,255,255,0.6)" }}>
                    {isUploaded ? <CheckCircleIcon /> : <FileIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-schibsted text-white/90 font-semibold text-sm truncate">{uploadedFile.name}</p>
                    <p className="font-schibsted text-white/40 text-xs mt-0.5">{formatFileSize(uploadedFile.size)}{isUploaded && <span className="text-red-500 ml-2">• Ready to analyze</span>}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} className="flex-shrink-0 p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><TrashIcon /></button>
                </div>
                {!isUploaded && (
                  <div className="mt-4 w-full">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, background: "linear-gradient(90deg, hsl(0, 84%, 60%), hsl(0, 84%, 65%))" }} />
                    </div>
                    <p className="font-schibsted text-white/40 text-xs mt-2 text-right">{Math.round(uploadProgress)}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 transition-all duration-300">
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste Job Description for Keyword Gap Analysis (Optional)" className="w-full bg-black/20 text-white/90 text-sm font-schibsted p-4 rounded-xl border border-white/10 outline-none focus:border-red-500/50 transition-colors resize-none placeholder:text-white/30" rows={3} />
          </div>
          <div className="flex items-center justify-between mt-6 gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:text-white group" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: 13, border: "1px solid rgba(255,255,255,0.06)" }}>
                <AttachIcon /><span className="font-schibsted font-medium">Browse</span>
              </button>
              <button onClick={onOpenHistory} className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:text-white group" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: 13, border: "1px solid rgba(255,255,255,0.06)" }}>
                <SearchIcon /><span className="font-schibsted font-medium">History</span>
              </button>
            </div>
            <button onClick={handleAnalyze} disabled={!uploadedFile || !isUploaded || isLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-schibsted font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: uploadedFile && isUploaded ? "linear-gradient(135deg, hsl(0, 84%, 60%), hsl(0, 72%, 51%))" : "rgba(255,255,255,0.06)", color: uploadedFile && isUploaded ? "#fff" : "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: uploadedFile && isUploaded ? "0 4px 20px rgba(239,68,68,0.3)" : "none" }}>
              {isLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</>) : (<><ArrowUpIcon />Analyze Resume</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

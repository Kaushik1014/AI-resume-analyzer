import { useState, useEffect } from "react";
import api from "@/services/api";
import ReactMarkdown from "react-markdown";

// ─── SVG Icons ───
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg 
    width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
  >
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4H13.5M5.5 4V2.5C5.5 2.22386 5.72386 2 6 2H10C10.2761 2 10.5 2.22386 10.5 2.5V4M4.5 4L5.20711 12.4853C5.28913 13.4695 6.11181 14.25 7.09915 14.25H8.90085C9.88819 14.25 10.7109 13.4695 10.7929 12.4853L11.5 4H4.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Chat History Panel ───
export default function HistoryPanel({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/analyze/history");
      setHistory(data.history);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Could not load history.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/analyze/history/${id}`);
      setHistory((prev) => prev.filter((chat) => chat._id !== id));
    } catch (err) {
      console.error("Failed to delete chat:", err);
      // Optional: set some local error state or toast notification
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[101] shadow-2xl transition-transform duration-300 flex flex-col border-l border-white/10 bg-hero-bg ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-fustat font-bold text-white tracking-wide uppercase">
            Prompt History
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-white/50 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-white/60">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-schibsted text-sm font-medium animate-pulse">Loading history...</span>
            </div>
          ) : error ? (
            <div className="text-red-400 font-schibsted p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-center text-sm">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-white/50 font-schibsted h-40 flex items-center justify-center italic text-sm">
              No previous chats found.
            </div>
          ) : (
            history.map((chat) => {
              const isExpanded = expandedId === chat._id;
              const date = new Date(chat.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div 
                  key={chat._id} 
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300"
                >
                  <div className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors gap-3">
                    <button 
                      onClick={() => toggleExpand(chat._id)}
                      className="flex-1 min-w-0 text-left outline-none cursor-pointer group"
                    >
                      <p className="text-sm font-schibsted text-white/90 truncate font-semibold group-hover:text-white transition-colors">
                        {chat.prompt}
                      </p>
                      <p className="text-xs font-schibsted text-white/40 mt-1 group-hover:text-white/60 transition-colors">
                        {date}
                      </p>
                    </button>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(chat._id); }}
                        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        title="Delete Chat"
                      >
                        <TrashIcon />
                      </button>
                      <button 
                        onClick={() => toggleExpand(chat._id)} 
                        className="text-white/50 p-1.5 hover:text-white transition-colors rounded-md"
                      >
                        <ChevronDownIcon isOpen={isExpanded} />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px] border-t border-white/10" : "max-h-0"}`}
                  >
                    <div className="p-4 bg-black/40 overflow-y-auto max-h-[500px]">
                      <div className="font-schibsted text-white/80 text-sm leading-relaxed [&>p]:mb-3 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>li]:mb-1 [&>strong]:text-white">
                        <ReactMarkdown>{chat.response}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

import React from 'react';

const RoleSuggestions = ({ roleData }) => {
  if (!roleData || !roleData.detectedRole) return null;

  return (
    <div className="w-full bg-fuchsia-500/5 rounded-2xl sm:rounded-[20px] p-4 sm:p-6 border border-fuchsia-500/20 mb-4 sm:mb-6 mt-3 sm:mt-4">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex flex-shrink-0 items-center justify-center text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-fustat text-fuchsia-300 uppercase tracking-widest font-bold">
            Tailored Industry Suggestions
          </h3>
          <p className="text-2xl font-schibsted font-bold text-white tracking-wide mt-1 drop-shadow-md">
            {roleData.detectedRole}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {roleData.suggestions && roleData.suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex gap-4 bg-black/30 p-4 rounded-xl border border-white/5 transition-transform hover:-translate-y-0.5 hover:border-fuchsia-500/30">
            <div className="flex-shrink-0 mt-0.5 text-fuchsia-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <p className="text-[15px] font-schibsted text-white/90 leading-relaxed">
              {suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSuggestions;

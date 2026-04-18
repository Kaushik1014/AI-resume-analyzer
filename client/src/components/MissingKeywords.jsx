import React from 'react';

const MissingKeywords = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="w-full bg-red-500/5 rounded-[20px] p-6 border border-red-500/20 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V8M8 11H8.01M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-lg font-fustat text-white uppercase tracking-wider font-bold">
          Keyword Gap Analysis
        </h3>
      </div>
      <p className="text-sm font-schibsted text-white/60 mb-5 leading-relaxed">
        We analyzed the job description you provided and noticed the following important keywords are missing from your resume. Integrating them will significantly boost your ATS score.
      </p>
      <div className="flex flex-wrap gap-2.5">
        {keywords.map((kw, i) => (
          <span 
            key={i} 
            className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm font-schibsted font-medium tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.05)] transition-transform hover:-translate-y-0.5 cursor-default"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MissingKeywords;

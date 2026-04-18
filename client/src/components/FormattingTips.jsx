import React from 'react';

const FormattingTips = ({ formattingData }) => {
  if (!formattingData) return null;

  return (
    <div className="w-full bg-cyan-500/5 rounded-2xl sm:rounded-[20px] p-4 sm:p-6 border border-cyan-500/20 mb-4 sm:mb-6 mt-3 sm:mt-4">
      <h3 className="text-lg font-fustat text-white uppercase tracking-wider font-bold mb-5 flex items-center justify-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        Formatting & Flow Check
      </h3>

      <div className="flex flex-col gap-4">
        {/* Length */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
          <h4 className="text-sm font-fustat font-bold text-cyan-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Length Optimal
          </h4>
          <p className="text-sm font-schibsted text-white/80 leading-relaxed">
            {formattingData.length || "No length feedback provided."}
          </p>
        </div>

        {/* Bullet Structure */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
          <h4 className="text-sm font-fustat font-bold text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Bullet Structure
          </h4>
          <p className="text-sm font-schibsted text-white/80 leading-relaxed">
            {formattingData.bulletStructure || "No bullet structure feedback provided."}
          </p>
        </div>

        {/* Dates Format */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
          <h4 className="text-sm font-fustat font-bold text-teal-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Dates Formatting
          </h4>
          <p className="text-sm font-schibsted text-white/80 leading-relaxed">
            {formattingData.datesFormat || "No dates formatting feedback provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormattingTips;

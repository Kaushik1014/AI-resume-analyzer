import React from 'react';

const ToneAnalysis = ({ toneData }) => {
  if (!toneData) return null;

  // Filter out the AI boilerplate if it accidentally bleeds through
  const filterEmptyStops = (array) => {
    if (!array || !Array.isArray(array)) return [];
    return array.filter(v => v.length > 0 && !v.includes("leave empty array"));
  };

  const cleanPassiveVoice = filterEmptyStops(toneData.passiveVoice);
  const cleanWeakVerbs = filterEmptyStops(toneData.weakVerbs);

  return (
    <div className="w-full bg-indigo-500/5 rounded-[20px] p-6 border border-indigo-500/20 mb-6 mt-4">
      <h3 className="text-lg font-fustat text-white uppercase tracking-wider font-bold mb-5 flex items-center justify-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Tone & Language Check
      </h3>

      <div className="flex flex-col gap-4">
        {/* Passive Voice */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
          <h4 className="text-sm font-fustat font-bold text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Passive Voice
          </h4>
          {cleanPassiveVoice.length > 0 ? (
            <ul className="list-disc pl-5 mt-2 text-sm font-schibsted text-white/70 space-y-1">
              {cleanPassiveVoice.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-schibsted text-white/40 italic mt-2">Great job! No major passive voice constructs found.</p>
          )}
        </div>

        {/* Weak Verbs */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
          <h4 className="text-sm font-fustat font-bold text-orange-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            Weak Verbs
          </h4>
          {cleanWeakVerbs.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {cleanWeakVerbs.map((verb, idx) => (
                <span key={idx} className="bg-orange-500/10 border border-orange-500/30 text-orange-200 px-3 py-1.5 rounded-lg text-xs font-schibsted uppercase tracking-wider font-medium">
                  {verb}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm font-schibsted text-white/40 italic mt-2">Your action verbs are strong and impactful.</p>
          )}
        </div>

        {/* Quantification */}
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
          <h4 className="text-sm font-fustat font-bold text-emerald-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Quantification
          </h4>
          <p className="text-sm font-schibsted text-white/80 leading-relaxed mt-2">
            {toneData.quantification || "No specific feedback on quantification provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToneAnalysis;

import React from 'react';

const SectionScores = ({ scores }) => {
  if (!scores) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return "hsl(119, 99%, 46%)"; // green
    if (score >= 5) return "hsl(40, 100%, 50%)"; // orange
    return "hsl(0, 100%, 60%)"; // red
  };

  return (
    <div className="w-full bg-black/40 rounded-2xl sm:rounded-[20px] p-4 sm:p-6 border border-white/10 mb-4 sm:mb-6 mt-3 sm:mt-4">
      <h3 className="text-base sm:text-lg font-fustat text-white mb-4 sm:mb-5 uppercase tracking-wider font-bold text-center">
        Section Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
        {Object.entries(scores).map(([section, score]) => (
          <div key={section} className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-schibsted">
              <span className="text-sm text-white/80 font-medium tracking-wide">{section}</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(score) }}>
                {score}<span className="text-white/30 text-xs">/10</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(currentColor,0.5)]"
                style={{ 
                  width: `${(score / 10) * 100}%`,
                  backgroundColor: getScoreColor(score)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionScores;

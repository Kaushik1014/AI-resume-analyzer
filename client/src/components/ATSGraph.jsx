import React from 'react';

const ATSGraph = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "hsl(119, 99%, 46%)"; // green
  if (score < 50) color = "hsl(0, 100%, 60%)"; // red
  else if (score < 75) color = "hsl(40, 100%, 50%)"; // orange

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-fustat text-white">{score}</span>
          <span className="text-xs text-white/50 uppercase tracking-widest mt-1 font-schibsted font-bold">ATS Score</span>
        </div>
      </div>
    </div>
  );
};

export default ATSGraph;

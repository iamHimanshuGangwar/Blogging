import React, { useState } from "react";
import { Info } from "lucide-react";

const MatchScoreIndicator = ({ score = 85, skills = [], jobRequirements = [] }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const matchedSkills = skills.filter(skill => 
    jobRequirements.some(req => 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="flex flex-col items-center gap-1 cursor-help transition-transform hover:scale-110"
      >
        <div
          className="match-score"
          style={{ "--score": score }}
        >
          <div className="match-score-text">
            <span className={`text-sm font-bold ${getScoreColor()}`}>
              {score}%
            </span>
            <span className="text-xs font-semibold opacity-70">Match</span>
          </div>
        </div>
        <Info size={14} className="opacity-50" />
      </button>

      {/* Sophisticated Tooltip */}
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-48 z-50 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
            Skill Alignment
          </p>
          
          {matchedSkills.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                ✓ Matched Skills ({matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {jobRequirements.length > matchedSkills.length && (
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                ○ Worth Developing ({jobRequirements.length - matchedSkills.length})
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                You have most skills! Consider learning the missing ones.
              </p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              This score is based on your resume and job requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScoreIndicator;

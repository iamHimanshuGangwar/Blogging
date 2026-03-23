import React, { useState } from "react";
import {
  MapPin,
  DollarSign,
  Briefcase,
  ChevronRight,
  Zap,
  BookOpen,
} from "lucide-react";
import { getJobSalary } from "../../utils/currencyUtils";
import AIJobInsights from "./AIJobInsights";

/**
 * Job Card Component
 * Displays job listing with details and action buttons
 */
const JobCard = ({
  job,
  matchScore = 85,
  isApplied = false,
  onApply,
  onDetails,
  onTailor,
  userProfile = {},
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const getSalaryDisplay = () => {
    return getJobSalary(job);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getMatchBgColor = (score) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-900/20";
    return "bg-red-50 dark:bg-red-900/20";
  };

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-200 dark:border-gray-700 ${
        isHovering ? "transform -translate-y-2" : ""
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header with Match Score */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 relative">
        {/* Match Score Badge */}
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm ${getMatchBgColor(
            matchScore
          )} ${getMatchColor(matchScore)}`}
        >
          {matchScore}% Match
        </div>

        {/* Job Title and Company */}
        <div className="pr-20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
            {job.title}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
            {job.company}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="p-6 space-y-3 flex-grow">
        {/* Location */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="flex-shrink-0 text-red-500" />
          <span className="text-sm">{job.location || "Location not specified"}</span>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <DollarSign size={16} className="flex-shrink-0 text-green-600" />
          <span className="text-sm font-semibold">{getSalaryDisplay()}</span>
        </div>

        {/* Job Type */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Briefcase size={16} className="flex-shrink-0 text-blue-600" />
          <span className="text-sm">
            {job.jobType || "Full-time"} • {job.industry || "General"}
          </span>
        </div>

        {/* Job Category Badge */}
        <div className="pt-2">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            {job.category || job.industry || "General"}
          </span>
        </div>

        {/* Description Preview */}
        {job.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 pt-2 italic">
            "{job.description}"
          </p>
        )}

        {/* AI Insights Bar */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
          >
            <Zap size={14} />
            {showInsights ? "Hide" : "Show"} AI Insights
          </button>
          {showInsights && (
            <div className="mt-3">
              <AIJobInsights job={job} userProfile={userProfile} isExpanded={true} />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={() => onDetails?.(job)}
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition flex items-center justify-center gap-2 group"
        >
          <BookOpen size={16} />
          Details
          <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onApply?.(job)}
          disabled={isApplied}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            isApplied
              ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-600/50 hover:-translate-y-0.5"
          }`}
        >
          {isApplied ? "✓ Applied" : "Apply Now"}
        </button>

        {/* AI Resume Tailor */}
        <button
          onClick={() => onTailor?.(job)}
          className="w-full px-4 py-2 border-2 border-amber-400/50 text-amber-600 dark:text-amber-400 rounded-lg font-semibold hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          AI Resume Tailor
        </button>
      </div>
    </div>
  );
};

export default JobCard;

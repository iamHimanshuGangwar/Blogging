import React, { useState } from "react";
import {
  X,
  BookOpen,
  Users,
  CheckCircle,
  Heart,
  Share2,
  Zap,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Award,
  Mail,
} from "lucide-react";

const JobDetailsModal = ({ job, isOpen, onClose, onApply, onTailor }) => {
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !job) return null;

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getMatchBgColor = (score) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getSalaryDisplay = () => {
    if (job.salary?.hideFromPublic) {
      return "Salary not disclosed";
    }
    if (job.salary?.min && job.salary?.max) {
      return `$${(job.salary.min / 1000).toFixed(0)}K - $${(job.salary.max / 1000).toFixed(0)}K`;
    }
    return "Competitive salary";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white px-8 py-8 border-b border-blue-700/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
          <p className="text-blue-100 text-lg mb-4">{job.company}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-blue-400/30">
            <div>
              <p className="text-blue-100 text-xs font-medium mb-1">Match</p>
              <p className="text-2xl font-bold flex items-baseline gap-1">
                92<span className="text-sm font-normal">%</span>
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-xs font-medium mb-1">
                Applications
              </p>
              <p className="text-2xl font-bold">{job.applicants || 24}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs font-medium mb-1">Posted</p>
              <p className="text-sm font-bold">
                {job.postedDaysAgo || "2d"} ago
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-xs font-medium mb-1">Salary</p>
              <p className="text-sm font-bold">{getSalaryDisplay()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Match Score Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 font-semibold ${getMatchBgColor(92)} ${getMatchColor(92)}`}
          >
            <Zap size={18} />
            92% Match
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <MapPin size={16} />
                Location
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {job.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.locationType || "On-site"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <DollarSign size={16} />
                Salary Range
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {getSalaryDisplay()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Per annum
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <Briefcase size={16} />
                Job Type
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {job.jobType || "Full-time"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <Clock size={16} />
                Experience
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {job.experience || "3-5 years"}
              </p>
            </div>
          </div>

          {/* About the Job */}
          {job.description && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                About the Role
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && typeof job.requirements === "string" && job.requirements.trim() ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award size={20} className="text-amber-600" />
                Requirements
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          ) : null}

          {/* Required Skills */}
          {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-600" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Benefits */}
          {job.benefits && typeof job.benefits === "string" && job.benefits.trim() ? (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                Benefits & Perks
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.benefits}
              </p>
            </div>
          ) : null}

          {/* Company Info */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              About {job.company}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.companyDescription ||
                "A leading organization committed to innovation and excellence."}
            </p>
          </div>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-8 py-4 flex gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              isSaved
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            Save
          </button>

          <button
            onClick={() => alert("Share functionality to be implemented")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            onClick={onTailor}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
          >
            <Mail size={18} />
            Tailor
          </button>

          <button
            onClick={() => {
              onApply(job);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition"
          >
            <Briefcase size={18} />
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
};

export default JobDetailsModal;

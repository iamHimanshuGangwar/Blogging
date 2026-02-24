import React from "react";
import { X, Send, Award, Users, Calendar, ArrowRight } from "lucide-react";
import TechStackTags from "./TechStackTags";

const JobDetailDrawer = ({ 
  isOpen, 
  job, 
  onClose, 
  onApply,
  isApplied = false 
}) => {
  if (!job) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`drawer-panel ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </h2>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
              {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Facts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Calendar size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Type</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{job.jobType}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Award size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Salary</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{job.salary}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              About This Role
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          {job.technologies && job.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Tech Stack
              </h3>
              <TechStackTags technologies={job.technologies} />
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Benefits
              </h3>
              <div className="space-y-2">
                {job.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <span className="text-green-600 dark:text-green-400">★</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          {job.companyDescription && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                About {job.company}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.companyDescription}
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-6">
          <button
            onClick={() => {
              onApply(job);
              onClose();
            }}
            disabled={isApplied}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              isApplied
                ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            }`}
          >
            {isApplied ? (
              <>
                <Award size={20} />
                Already Applied
              </>
            ) : (
              <>
                <Send size={20} />
                Apply Now
                <ArrowRight size={16} className="opacity-70" />
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Our AI will match your resume to this role
          </p>
        </div>
      </div>
    </>
  );
};

export default JobDetailDrawer;

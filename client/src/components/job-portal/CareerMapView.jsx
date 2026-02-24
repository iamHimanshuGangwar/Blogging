import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const CareerMapView = ({ jobs = [] }) => {
  const [expandedPath, setExpandedPath] = useState(null);

  // Extract unique job levels and create career paths
  const careerLevels = [
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Principal",
    "Executive"
  ];

  const getJobsForLevel = (level) => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(level.toLowerCase())
    );
  };

  const careerPaths = [
    {
      name: "Developer Track",
      path: ["Junior Developer", "Mid-Level Developer", "Senior Developer", "Lead Developer", "Principal Engineer"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Management Track",
      path: ["Team Lead", "Engineering Manager", "Senior Manager", "Director", "VP Engineering"],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Architect Track",
      path: ["Software Architect", "Principal Architect", "Chief Architect"],
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Career Path Selector */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Career Growth Paths
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {careerPaths.map((path, idx) => (
            <button
              key={idx}
              onClick={() => setExpandedPath(expandedPath === idx ? null : idx)}
              className={`career-map-card p-6 rounded-2xl text-left transition transform hover:scale-105 cursor-pointer ${
                expandedPath === idx
                  ? `bg-gradient-to-br ${path.color} text-white shadow-lg`
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              }`}
            >
              <p className="font-bold text-lg">{path.name}</p>
              <p className={`text-sm mt-1 ${expandedPath === idx ? "opacity-90" : "opacity-70"}`}>
                {path.path.length} levels
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Career Path Visualization */}
      {expandedPath !== null && (
        <div className="career-map-container">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-8">
            {careerPaths[expandedPath].name} Growth Trajectory
          </p>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {careerPaths[expandedPath].path.map((role, idx) => (
              <div key={idx} className="flex items-center gap-4 flex-shrink-0">
                <div className="career-node">
                  <div className="text-sm font-bold">{role}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {getJobsForLevel(role).length} openings
                  </div>
                </div>
                {idx < careerPaths[expandedPath].path.length - 1 && (
                  <ArrowRight className="text-gray-400 flex-shrink-0" size={24} />
                )}
              </div>
            ))}
          </div>

          {/* Jobs for this path */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Open Positions in This Track
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs
                .filter(job => 
                  careerPaths[expandedPath].path.some(role =>
                    job.title.toLowerCase().includes(role.toLowerCase())
                  )
                )
                .map((job) => (
                  <div
                    key={job._id}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {job.company}
                    </p>
                  </div>
                ))}
            </div>

            {jobs.filter(job => 
              careerPaths[expandedPath].path.some(role =>
                job.title.toLowerCase().includes(role.toLowerCase())
              )
            ).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No open positions for this track at the moment
              </p>
            )}
          </div>
        </div>
      )}

      {/* Level-based View */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Jobs by Experience Level
        </h3>
        <div className="space-y-4">
          {careerLevels.map((level) => {
            const levelJobs = getJobsForLevel(level);
            if (levelJobs.length === 0) return null;

            return (
              <div key={level} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white mb-3">
                  {level} Level ({levelJobs.length} openings)
                </p>
                <div className="flex flex-wrap gap-2">
                  {levelJobs.slice(0, 5).map((job) => (
                    <span
                      key={job._id}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
                    >
                      {job.title}
                    </span>
                  ))}
                  {levelJobs.length > 5 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium">
                      +{levelJobs.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerMapView;

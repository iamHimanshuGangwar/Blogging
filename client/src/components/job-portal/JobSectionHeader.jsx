import React, { useState } from "react";
import { Plus, TrendingUp, Users, Star } from "lucide-react";
import PostJobForm from "./PostJobForm";
import toast from "react-hot-toast";

/**
 * Job Section Header with Advanced Features
 * Features:
 * - Post Job CTA button
 * - Stats display (jobs posted, applicants, etc.)
 * - Trust score badges
 */
const JobSectionHeader = ({ stats = {}, onJobPosted }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultStats = {
    jobsPosted: stats.jobsPosted || 0,
    activeListings: stats.activeListings || 0,
    totalApplicants: stats.totalApplicants || 0,
    avgHiringTime: stats.avgHiringTime || "14 days",
    ...stats,
  };

  const handleJobSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // In production: Send to backend API
      // POST /api/jobs/create
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`Job "${formData.jobTitle}" posted successfully! 🎉`);
      onJobPosted?.(formData);
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Find Your Perfect Role
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover opportunities that match your skills and aspirations
            </p>
          </div>

          {/* Post Job Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-100 active:scale-95"
          >
            <Plus size={20} />
            Post a Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Jobs Posted */}
          <div className="card-glass rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Active Jobs
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {defaultStats.activeListings}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Applicants */}
          <div className="card-glass rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Applicants Waiting
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {defaultStats.totalApplicants}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Avg Hiring Time */}
          <div className="card-glass rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Avg Hiring Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {defaultStats.avgHiringTime}
              </p>
            </div>
          </div>

          {/* Community Rating */}
          <div className="card-glass rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Community Trust
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="card-glass rounded-lg p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              💡 Smart Job Discovery Tips
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>✓ Jobs are matched to your resume skills automatically</li>
              <li>✓ Save jobs to apply later with one click</li>
              <li>✓ Get notifications when companies view your application</li>
            </ul>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition whitespace-nowrap">
            Learn More
          </button>
        </div>
      </div>

      {/* Post Job Form Modal */}
      <PostJobForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleJobSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default JobSectionHeader;

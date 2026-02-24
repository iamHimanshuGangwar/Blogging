import React, { useState } from "react";
import {
  TrendingUp,
  Eye,
  EyeOff,
  Contact,
  LogOut,
  Lightbulb,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Job Portal Navigation - Separate from Blog Navigation
 * Features:
 * - Career Map Toggle
 * - Salary Insights
 * - My Applications
 * - Quick Stats
 */
const JobPortalNav = ({
  showCareerMap = false,
  onToggleCareerMap = () => {},
  showSalaryInsights = false,
  onToggleSalaryInsights = () => {},
  myApplicationsCount = 0,
  onMyApplications = () => {},
  isLoggedIn = false,
  user = null,
  onLogout = () => {},
}) => {
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm w-full">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Job Portal
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLoggedIn && user
                  ? `Welcome, ${user.name || user.email}`
                  : "Sign in to apply for jobs"}
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Quick Stats Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setStatsOpen(!statsOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                >
                  <Lightbulb size={16} className="text-amber-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Quick Tips
                  </span>
                </button>
                {statsOpen && (
                  <div className="absolute right-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-sm z-50">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      💡 Update your profile for better matches
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      📄 Upload 2-3 resumes for different roles
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      🎯 Use filters to find your perfect fit
                    </p>
                  </div>
                )}
              </div>

              {/* Career Map Toggle */}
              <button
                onClick={onToggleCareerMap}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition text-sm ${
                  showCareerMap
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <TrendingUp size={16} />
                <span className="hidden sm:inline">Map</span>
              </button>

              {/* Salary Insights Toggle */}
              <button
                onClick={onToggleSalaryInsights}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition text-sm ${
                  showSalaryInsights
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {showSalaryInsights ? (
                  <Eye size={16} />
                ) : (
                  <EyeOff size={16} />
                )}
                <span className="hidden sm:inline">Salary</span>
              </button>

              {/* My Applications */}
              <button
                onClick={onMyApplications}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-sm"
              >
                <Contact size={16} />
                <span className="hidden sm:inline">Apps</span>
                {myApplicationsCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {myApplicationsCount > 9 ? "9+" : myApplicationsCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 font-medium transition text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Leave</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to access all features
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs">
                <Contact size={14} />
                Not signed in
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default JobPortalNav;

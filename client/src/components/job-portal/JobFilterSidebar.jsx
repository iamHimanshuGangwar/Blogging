import React, { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import FilterPresetsPanel from "./FilterPresetsPanel";
import JobRecommendationEngine from "./JobRecommendationEngine";

/**
 * Advanced Sidebar with Filters, Presets, and Recommendations
 * Integrates smart filtering and discovery features
 */
const JobFilterSidebar = ({
  onFilterChange,
  onApplyPreset,
  jobs = [],
  appliedJobs = [],
  isOpen = false,
  onClose = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("filters"); // filters, presets, recommendations
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 500000 });
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    location: true,
    type: true,
  });

  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Remote", "Hybrid"];
  const industries = [
    "All",
    "Technology",
    "Finance",
    "Healthcare",
    "E-commerce",
    "Startup",
  ];

  const handleFilterChange = () => {
    onFilterChange({
      searchQuery,
      locationFilter,
      industryFilter,
      jobTypeFilter,
      salaryRange,
    });
  };

  const applyFilters = () => {
    handleFilterChange();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setIndustryFilter("All");
    setJobTypeFilter("All");
    setSalaryRange({ min: 0, max: 500000 });
    onFilterChange({
      searchQuery: "",
      locationFilter: "",
      industryFilter: "All",
      jobTypeFilter: "All",
      salaryRange: { min: 0, max: 500000 },
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatSalary = (value) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative lg:block w-full lg:w-80 h-screen lg:h-auto bg-white dark:bg-gray-800 rounded-r-2xl shadow-xl lg:shadow-none z-50 lg:z-0 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter size={20} />
            Discover
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 bg-gray-50 dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
          {[
            { id: "filters", label: "Filters", icon: "🔍" },
            { id: "presets", label: "Presets", icon: "⭐" },
            { id: "recommendations", label: "For You", icon: "🤖" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* FILTERS TAB */}
          {activeTab === "filters" && (
            <div className="space-y-6">
              {/* Search */}
              <div>
                <button
                  onClick={() => toggleSection("search")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Search
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`transition ${
                      expandedSections.search ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSections.search && (
                  <input
                    type="text"
                    placeholder="Job title, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>

              {/* Location */}
              <div>
                <button
                  onClick={() => toggleSection("location")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Location
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`transition ${
                      expandedSections.location ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSections.location && (
                  <input
                    type="text"
                    placeholder="City, region, or remote..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>

              {/* Job Type */}
              <div>
                <button
                  onClick={() => toggleSection("type")}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Job Type
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`transition ${
                      expandedSections.type ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSections.type && (
                  <div className="grid grid-cols-2 gap-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setJobTypeFilter(type)}
                        className={`py-2 px-3 rounded-lg font-semibold text-sm transition border ${
                          jobTypeFilter === type
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Industry */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Industry
                </h3>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Salary Range
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Min: {formatSalary(salaryRange.min)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={salaryRange.min}
                      onChange={(e) =>
                        setSalaryRange({
                          ...salaryRange,
                          min: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Max: {formatSalary(salaryRange.max)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={salaryRange.max}
                      onChange={(e) =>
                        setSalaryRange({
                          ...salaryRange,
                          max: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* PRESETS TAB */}
          {activeTab === "presets" && (
            <FilterPresetsPanel
              currentFilters={{
                searchQuery,
                locationFilter,
                industryFilter,
                jobTypeFilter,
              }}
              onApplyPreset={(filters) => {
                setSearchQuery(filters.searchQuery || "");
                setLocationFilter(filters.locationFilter || "");
                setIndustryFilter(filters.industryFilter || "All");
                setJobTypeFilter(filters.jobTypeFilter || "All");
                onApplyPreset(filters);
              }}
              onSavePreset={() => {}}
            />
          )}

          {/* RECOMMENDATIONS TAB */}
          {activeTab === "recommendations" && (
            <JobRecommendationEngine
              jobs={jobs}
              userSkills={[]}
              appliedJobs={appliedJobs}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default JobFilterSidebar;

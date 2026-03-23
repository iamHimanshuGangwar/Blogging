import React, { useState, useEffect } from "react";
import {
  Filter,
  X,
  ChevronDown,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Zap,
} from "lucide-react";
import "./EnhancedJobSidebar.css";

/**
 * Enhanced Job Portal Sidebar
 * Features:
 * - Glowing pulsing search bar
 * - Section transitions with staggered fade-in
 * - AI Power badge with shimmer effect
 * - Advanced filtering
 */
const EnhancedJobSidebar = ({
  onFilterChange,
  onApplyPreset,
  jobs = [],
  appliedJobs = [],
  isOpen = false,
  onClose = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("filters");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 500000 });
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    location: true,
    type: true,
    salary: true,
  });
  const [searchActive, setSearchActive] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  const jobTypes = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Hybrid",
  ];
  const industries = [
    "All",
    "Technology",
    "Finance",
    "Healthcare",
    "E-commerce",
    "Startup",
  ];

  // Trigger staggered fade-in effect
  useEffect(() => {
    const sections = ["search", "filters", "quick-actions"];
    sections.forEach((section, idx) => {
      setTimeout(() => {
        setVisibleSections((prev) => ({
          ...prev,
          [section]: true,
        }));
      }, idx * 150);
    });
  }, []);

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

      {/* Enhanced Sidebar */}
      <div
        className={`fixed lg:relative lg:block w-full lg:w-96 h-screen lg:h-auto bg-gradient-to-b from-white via-white to-purple-50/10 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/10 rounded-r-2xl shadow-xl lg:shadow-none z-50 lg:z-0 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header with AI Badge */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Filter size={20} />
              Discover Jobs
            </h2>
            {/* AI Power Badge with Shimmer */}
            <div className="ai-power-badge">
              <span className="shimmer-text">AI</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md p-3 border-b border-gray-200 dark:border-gray-700 flex gap-2 z-30">
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
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/50"
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
              {/* Glowing Search Bar with Pulse */}
              <section
                className={`transition-all duration-500 ease-out ${
                  visibleSections.search
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div
                  className={`search-input-container ${
                    searchActive ? "active" : ""
                  }`}
                >
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search job titles, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchActive(true)}
                    onBlur={() => setSearchActive(false)}
                    className="search-input"
                  />
                </div>
                <div className="mt-4">
                  <div
                    className={`search-input-container ${
                      searchActive ? "active" : ""
                    }`}
                  >
                    <MapPin size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="City, country..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      onFocus={() => setSearchActive(true)}
                      onBlur={() => setSearchActive(false)}
                      className="search-input"
                    />
                  </div>
                </div>
              </section>

              {/* Location Filter */}
              <section
                className={`transition-all duration-500 ease-out ${
                  visibleSections.filters
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: visibleSections.filters ? "150ms" : "0ms",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleSection("location")}
                    className="w-full flex items-center justify-between mb-3 group"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin size={16} className="text-purple-600" />
                      Location
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`text-gray-600 dark:text-gray-400 transition-transform group-hover:text-purple-600 ${
                        expandedSections.location ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections.location && (
                    <div className="space-y-2 pl-6 border-l-2 border-purple-200 dark:border-purple-800">
                      <input
                        type="text"
                        placeholder="City, country..."
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Job Type Filter */}
              <section
                className={`transition-all duration-500 ease-out ${
                  visibleSections.filters
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: visibleSections.filters ? "200ms" : "0ms",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleSection("type")}
                    className="w-full flex items-center justify-between mb-3 group"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Briefcase size={16} className="text-pink-600" />
                      Job Type
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`text-gray-600 dark:text-gray-400 transition-transform group-hover:text-pink-600 ${
                        expandedSections.type ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections.type && (
                    <div className="space-y-2 pl-6 border-l-2 border-pink-200 dark:border-pink-800">
                      {jobTypes.map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="jobType"
                            value={type}
                            checked={jobTypeFilter === type}
                            onChange={(e) => setJobTypeFilter(e.target.value)}
                            className="w-4 h-4 accent-pink-600 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-pink-600 transition">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Salary Range Filter */}
              <section
                className={`transition-all duration-500 ease-out ${
                  visibleSections.filters
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: visibleSections.filters ? "250ms" : "0ms",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleSection("salary")}
                    className="w-full flex items-center justify-between mb-3 group"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      Salary Range
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`text-gray-600 dark:text-gray-400 transition-transform group-hover:text-green-600 ${
                        expandedSections.salary ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections.salary && (
                    <div className="space-y-4 pl-6 border-l-2 border-green-200 dark:border-green-800">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                          Min: {formatSalary(salaryRange.min)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          value={salaryRange.min}
                          onChange={(e) =>
                            setSalaryRange({
                              ...salaryRange,
                              min: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                          Max: {formatSalary(salaryRange.max)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          value={salaryRange.max}
                          onChange={(e) =>
                            setSalaryRange({
                              ...salaryRange,
                              max: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Industry Filter */}
              <section
                className={`transition-all duration-500 ease-out ${
                  visibleSections.filters
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: visibleSections.filters ? "300ms" : "0ms",
                }}
              >
                <div>
                  <button
                    onClick={() => toggleSection("industry")}
                    className="w-full flex items-center justify-between mb-3 group"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Zap size={16} className="text-amber-600" />
                      Industry
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`text-gray-600 dark:text-gray-400 transition-transform group-hover:text-amber-600 ${
                        expandedSections.industry ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections.industry && (
                    <div className="space-y-2 pl-6 border-l-2 border-amber-200 dark:border-amber-800">
                      {industries.map((industry) => (
                        <label key={industry} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="industry"
                            value={industry}
                            checked={industryFilter === industry}
                            onChange={(e) => setIndustryFilter(e.target.value)}
                            className="w-4 h-4 accent-amber-600 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-amber-600 transition">
                            {industry}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Action Buttons */}
              <div
                className={`transition-all duration-500 ease-out flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 ${
                  visibleSections["quick-actions"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: visibleSections["quick-actions"]
                    ? "350ms"
                    : "0ms",
                }}
              >
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* PRESETS TAB */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">Saved presets coming soon! 🚀</p>
              </div>
            </div>
          )}

          {/* RECOMMENDATIONS TAB */}
          {activeTab === "recommendations" && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm">AI-powered recommendations coming soon! 🤖</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EnhancedJobSidebar;

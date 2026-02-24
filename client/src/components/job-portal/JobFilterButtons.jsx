import React, { useState } from "react";
import {
  Filter,
  Sliders,
  Zap,
  X,
  ChevronDown,
  MapPin,
  DollarSign,
  Briefcase,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Job Filter Buttons Toolbar
 * Compact button-based filtering system replacing sidebar
 * Features: Quick filters, Advanced filters modal, Presets, Search
 */
const JobFilterButtons = ({
  onFilterChange = () => {},
  onSearch = () => {},
  activeFilters = {},
  filterCount = 0,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    salary: "",
    industry: "",
    remote: false,
    ...activeFilters,
  });

  // Quick preset options
  const presets = [
    {
      id: "remote",
      name: "🌍 Remote Only",
      filters: { remote: true },
    },
    {
      id: "entry",
      name: "🎯 Entry Level",
      filters: { level: "junior" },
    },
    {
      id: "senior",
      name: "👑 Senior Tech",
      filters: { level: "senior" },
    },
    {
      id: "startup",
      name: "🚀 Startup Vibes",
      filters: { industry: "startup" },
    },
    {
      id: "highpay",
      name: "💰 High Salary",
      filters: { salary: "120k+" },
    },
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];
  const industries = [
    "Technology",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "Startup",
  ];

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handlePreset = (preset) => {
    setFilters({ ...filters, ...preset.filters });
    onFilterChange({ ...filters, ...preset.filters });
    toast.success(`Applied: ${preset.name}`);
    setShowPresets(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClearFilters = () => {
    const cleared = {
      location: "",
      jobType: "",
      salary: "",
      industry: "",
      remote: false,
    };
    setFilters(cleared);
    setSearchTerm("");
    onFilterChange(cleared);
    toast.success("Filters cleared");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search jobs by title, company..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Button Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Advanced Filters Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            showAdvanced
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <Sliders size={18} />
          <span>Filters</span>
          {filterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {filterCount}
            </span>
          )}
        </button>

        {/* Quick Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              showPresets
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <Zap size={18} />
            <span>Presets</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showPresets ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Presets Dropdown */}
          {showPresets && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePreset(preset)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filter Tags */}
        {filters.remote && (
          <button
            onClick={() => handleFilterChange("remote", false)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
          >
            🌍 Remote
            <X size={14} />
          </button>
        )}

        {filters.jobType && (
          <button
            onClick={() => handleFilterChange("jobType", "")}
            className="flex items-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition"
          >
            <Briefcase size={14} />
            {filters.jobType}
            <X size={14} />
          </button>
        )}

        {filters.location && (
          <button
            onClick={() => handleFilterChange("location", "")}
            className="flex items-center gap-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
          >
            <MapPin size={14} />
            {filters.location}
            <X size={14} />
          </button>
        )}

        {filters.salary && (
          <button
            onClick={() => handleFilterChange("salary", "")}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
          >
            <DollarSign size={14} />
            {filters.salary}
            <X size={14} />
          </button>
        )}

        {/* Clear All Button */}
        {filterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div
          className="card-glass rounded-lg p-6 border border-blue-200 dark:border-blue-800 space-y-4"
          style={{ animation: "slideUpIn 0.3s ease-out" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., San Francisco"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange("jobType", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange("industry", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Salary Range
              </label>
              <select
                value={filters.salary}
                onChange={(e) => handleFilterChange("salary", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Any Salary</option>
                <option value="40k-60k">$40k - $60k</option>
                <option value="60k-80k">$60k - $80k</option>
                <option value="80k-120k">$80k - $120k</option>
                <option value="120k+">$120k+</option>
              </select>
            </div>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="remote"
              checked={filters.remote}
              onChange={(e) => handleFilterChange("remote", e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
            <label
              htmlFor="remote"
              className="text-gray-900 dark:text-white font-medium cursor-pointer"
            >
              🌍 Remote Only
            </label>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAdvanced(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowAdvanced(false);
                toast.success("Filters applied");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilterButtons;

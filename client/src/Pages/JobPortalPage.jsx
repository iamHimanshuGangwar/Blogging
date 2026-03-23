import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Filter,
  TrendingUp,
  DollarSign,
  Menu,
  X,
  Loader,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useNotifications } from "../context/NotificationsContext";
import UserProfileCard from "../components/job-portal/UserProfileCard";
import JobPortalSidebar from "../components/job-portal/JobPortalSidebar";
import JobCard from "../components/job-portal/JobCard";
import { IndiaJobsService } from "../utils/IndiaJobsService";
import JobDetailsModal from "../components/job-portal/JobDetailsModal";
import AdzunaRealTimeSearch from "../components/job-portal/AdzunaRealTimeSearch";
/**
 * Complete Job Portal Page
 * Displays job listings with search, filters, and job cards
 * Matches the screenshot design with working backend functionality
 */
const JobPortalPage = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  // State Management
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 500000 });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showSalary, setShowSalary] = useState(true);
  const [activeMenu, setActiveMenu] = useState("feed");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState(["All", "Full-time", "Part-time", "Contract"]);
  const [locations, setLocations] = useState([]);
  const [myApplicationCount, setMyApplicationCount] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobPortalLogin, setShowJobPortalLogin] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      type: "success",
      title: "Welcome Back!",
      message: "Explore jobs from around the world. Use filters to find opportunities in your preferred location.",
    },
  ]);

  // User Data
  const [jobPortalUser, setJobPortalUser] = useState(() => {
    const saved = localStorage.getItem("jobPortal_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Initialize job types and locations on mount
  useEffect(() => {
    const types = IndiaJobsService.getJobTypes();
    setJobTypes(["All", ...types]);
    
    const cities = IndiaJobsService.getCities();
    setLocations(["All", ...cities]);
  }, []);

  // Fetch jobs from India Jobs Service
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Build search query from filters
        const query = searchQuery || "";
        const location = locationFilter || "";
        const type = jobTypeFilter !== "All" ? jobTypeFilter : "";
        
        // Call India Jobs Service with filters
        const result = await IndiaJobsService.searchJobs({
          query: query,
          location: location,
          jobType: type,
        });

        if (result && result.success) {
          const jobsList = result.data || [];
          setJobs(jobsList);

          // Extract unique locations and industries
          const uniqueLocations = [
            ...new Set(jobsList.map((job) => job.location).filter(Boolean)),
          ];
          setIndustries(["All", ...uniqueLocations]);

          // Load applied jobs from localStorage
          const stored = localStorage.getItem("appliedJobs");
          if (stored) setAppliedJobs(JSON.parse(stored));

          // Fetch user's applications count
          if (jobPortalUser) {
            try {
              const appsRes = await axios.get("/api/jobs/my-applications");
              if (appsRes.data.success) {
                setMyApplicationCount(appsRes.data.data?.length || 0);
              }
            } catch (error) {
              console.error("Failed to fetch applications:", error);
            }
          }
        } else {
          toast.error(result?.message || "Failed to fetch jobs");
          setJobs([]);
        }
      } catch (error) {
        console.error("Fetch jobs error:", error);
        toast.error("Failed to load jobs. Please try again.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce API calls
    const timer = setTimeout(fetchJobs, 500);
    return () => clearTimeout(timer);
  }, [axios, jobPortalUser, searchQuery, locationFilter, jobTypeFilter, salaryRange]);

  // Note: Filtering is now done at API level through Adzuna
  // Local filtering is minimal - only for client-side polish
  const applyFilters = useCallback(() => {
    let filtered = [...jobs];

    // Apply search query filter (job title)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.company?.toLowerCase().includes(q)
      );
    }

    // Apply location filter
    if (locationFilter && locationFilter !== "All") {
      const loc = locationFilter.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.location?.toLowerCase().includes(loc) ||
          job.city?.toLowerCase().includes(loc)
      );
    }

    // Apply industry filter
    if (industryFilter && industryFilter !== "All") {
      filtered = filtered.filter((job) => job.industry === industryFilter);
    }

    // Apply job type filter
    if (jobTypeFilter && jobTypeFilter !== "All") {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    // Apply salary range filter
    if (salaryRange.min > 0 || salaryRange.max < 500000) {
      filtered = filtered.filter((job) => {
        const jobMin = job.salaryMin || 0;
        const jobMax = job.salaryMax || 500000;
        return jobMin >= salaryRange.min && jobMax <= salaryRange.max;
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, locationFilter, industryFilter, jobTypeFilter, salaryRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle Apply
  const handleApply = async (job) => {
    if (!jobPortalUser) {
      toast.error("Please login to apply");
      setShowJobPortalLogin(true);
      return;
    }

    if (appliedJobs.includes(job._id)) {
      toast.error("You already applied for this job");
      return;
    }

    try {
      const response = await axios.post("/api/jobs/apply", {
        jobId: job._id,
        jobTitle: job.title,
        jobCompany: job.company,
        applicantName: jobPortalUser.name,
        applicantEmail: jobPortalUser.email,
      });

      if (response.data.success) {
        const updated = [...appliedJobs, job._id];
        setAppliedJobs(updated);
        localStorage.setItem("appliedJobs", JSON.stringify(updated));
        setMyApplicationCount((prev) => prev + 1);
        toast.success("Application submitted! 🎉");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  // Handle View Details
  const handleViewDetails = (job) => {
    setSelectedJob(job);
  };

  // Handle Resume Tailor
  const handleResumeTailor = (job) => {
    toast.info("AI Resume Tailor - Coming Soon!");
  };

  // Handle Menu Click
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setIsMobileSidebarOpen(false);

    switch (menuId) {
      case "applications":
        navigate("/my-applications");
        break;
      case "resumes":
        navigate("/resume-manager");
        break;
      case "post":
        navigate("/post-job");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        break;
    }
  };

  // Calculate match score (mock implementation)
  const getMatchScore = (job) => {
    let score = 70;
    if (job.industry === industryFilter && industryFilter !== "All") score += 15;
    if (job.location === locationFilter && locationFilter !== "") score += 10;
    return Math.min(100, score);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-16 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Job Portal
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find your next opportunity
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setShowSalary(!showSalary)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  showSalary
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <DollarSign size={18} />
                Salary
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition">
                <span>🤖</span>
                AI Interview Prep
              </button>
              <button
                onClick={() => handleMenuClick("applications")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <span>📋</span>
                My Apps ({myApplicationCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div
            className={`lg:col-span-1 ${
              isMobileSidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* User Profile Card */}
              {jobPortalUser && (
                <UserProfileCard
                  user={jobPortalUser}
                  trustScore={92}
                  jobMatch={97}
                />
              )}

              {/* Navigation Menu */}
              <JobPortalSidebar
                activeMenu={activeMenu}
                onMenuClick={handleMenuClick}
                applicationCount={myApplicationCount}
                resumeCount={0}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Adzuna Real-Time Job Search */}
            <AdzunaRealTimeSearch
              onJobsFound={(results) => {
                // Merge Adzuna results with local jobs
                const mergedJobs = [...jobs, ...results];
                setJobs(Array.from(new Map(mergedJobs.map(item => [item._id, item])).values()));
              }}
              onSearch={(searchData) => {
                console.log("Search performed:", searchData);
              }}
            />

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search job title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Industries */}
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>

                  {/* Job Type */}
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "All" ? "All Job Types" : type}
                      </option>
                    ))}
                  </select>

                  {/* Advanced Filters */}
                  <button className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 font-medium">
                    <Filter size={18} />
                    More Filters
                  </button>
                </div>
              </div>

              {/* Results Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  Found <span className="text-blue-600">{filteredJobs.length}</span> job
                  {filteredJobs.length !== 1 ? "s" : ""}
                </p>
                <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Most Recent</option>
                  <option>Best Match</option>
                  <option>Salary: High to Low</option>
                  <option>Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* Job Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  No jobs found matching your criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    matchScore={getMatchScore(job)}
                    isApplied={appliedJobs.includes(job._id)}
                    onApply={handleApply}
                    onDetails={handleViewDetails}
                    onTailor={handleResumeTailor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
            onTailor={handleResumeTailor}
          />
        )}
      </div>
    </div>
  );
};

export default JobPortalPage;

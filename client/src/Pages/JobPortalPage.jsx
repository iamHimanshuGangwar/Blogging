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
  Sparkles,
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
import { GeminiAIService } from "../utils/GeminiAIService";
/**
 * Complete Job Portal Page
 * Displays job listings with search, filters, and job cards
 * Matches the screenshot design with working backend functionality
 */
const JobPortalPage = () => {
  const navigate = useNavigate();
  const { axios, user } = useAppContext();

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
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [tailorJobs, setTailorJobs] = useState(null);
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
  const handleResumeTailor = async (job) => {
    try {
      const currentUser = jobPortalUser || user;
      if (!currentUser || !currentUser.resume) {
        toast.error("Please upload your resume first!");
        return;
      }

      setTailorJobs(job);
      setIsLoadingAI(true);

      const tailorPrompt = {
        jobTitle: job.jobTitle || job.title || "Position",
        jobDescription: job.jobDescription || job.description || "",
        skills: job.skills || [],
        requirements: job.requirements || [],
      };

      const suggestions = await GeminiAIService.tailorResumeForJob(
        user.resume,
        tailorPrompt
      );

      setAiSuggestions(suggestions);
      setShowAIModal(true);
      toast.success("AI suggestions generated!");
    } catch (error) {
      console.error("Error tailoring resume:", error);
      toast.error("Failed to generate AI suggestions");
    } finally {
      setIsLoadingAI(false);
    }
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

        {/* AI Resume Tailor Modal */}
        {showAIModal && aiSuggestions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">AI Resume Suggestions</h2>
                  </div>
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {tailorJobs && (
                  <p className="text-blue-100 mt-2">For: {tailorJobs.jobTitle || tailorJobs.title}</p>
                )}
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Summary Section */}
                {aiSuggestions.summary && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <h3 className="font-bold text-blue-900 mb-2">AI Analysis Summary</h3>
                    <p className="text-gray-700">{aiSuggestions.summary}</p>
                  </div>
                )}

                {/* Key Skills to Add */}
                {aiSuggestions.keySkillsToAdd && aiSuggestions.keySkillsToAdd.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Key Skills to Add</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiSuggestions.keySkillsToAdd.map((skill, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-green-100 to-green-50 border border-green-300 p-3 rounded-lg flex items-start gap-2"
                        >
                          <span className="text-green-600 font-bold mt-1">✓</span>
                          <div>
                            <p className="font-semibold text-green-900">{skill.skill}</p>
                            {skill.reason && (
                              <p className="text-sm text-green-700">{skill.reason}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Enhancements */}
                {aiSuggestions.suggestedEnhancements && aiSuggestions.suggestedEnhancements.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3">✨ Suggested Enhancements</h3>
                    <div className="space-y-3">
                      {aiSuggestions.suggestedEnhancements.map((enhancement, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded"
                        >
                          <p className="font-semibold text-yellow-900 mb-1">{enhancement.section}</p>
                          <p className="text-gray-700">{enhancement.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Score */}
                {aiSuggestions.matchPercentage && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">Resume Match Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-300 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all"
                          style={{ width: `${aiSuggestions.matchPercentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg text-gray-800">
                        {Math.round(aiSuggestions.matchPercentage)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(aiSuggestions, null, 2));
                      toast.success("Suggestions copied to clipboard!");
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold"
                  >
                    Copy Suggestions
                  </button>
                  <button
                    onClick={() => {
                      setShowAIModal(false);
                      handleApply(tailorJobs);
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Modal */}
        {isLoadingAI && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-700 font-semibold">Generating AI suggestions...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPortalPage;

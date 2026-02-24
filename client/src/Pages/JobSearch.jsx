// client/src/pages/JobSearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Briefcase,
  Send,
  DollarSign,
  ArrowLeft,
  X,
  Loader,
  Layout,
  Eye,
  EyeOff,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import useAtmosphereScroll from "../hooks/useAtmosphereScroll";
import MatchScoreIndicator from "../components/job-portal/MatchScoreIndicator";
import QuickApplyFAB from "../components/job-portal/QuickApplyFAB";
import JobDetailDrawer from "../components/job-portal/JobDetailDrawer";
import TechStackTags from "../components/job-portal/TechStackTags";
import CareerMapView from "../components/job-portal/CareerMapView";
import CommandCenterSidebar from "../components/job-portal/CommandCenterSidebar";
import SettingsPage from "../components/job-portal/SettingsPage";
import JobPortalNav from "../components/job-portal/JobPortalNav";
import JobPortalLogin from "../components/job-portal/JobPortalLogin";
import PostJobForm from "../components/job-portal/PostJobForm";
import EnhancedJobSidebar from "../components/job-portal/EnhancedJobSidebar";
import { Menu } from "lucide-react";

const JobSearchPage = () => {
  const navigate = useNavigate();
  const { token, user, axios } = useAppContext();
  const { openLogin } = useAuth();
  
  // Initialize atmosphere scroll hook
  useAtmosphereScroll();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 500000 });
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [myAppsLoading, setMyAppsLoading] = useState(false);
  const [isAppsModalOpen, setIsAppsModalOpen] = useState(false);

  // NEW: Adaptive Atmosphere Features
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerJob, setDrawerJob] = useState(null);
  const [showSalaryInsights, setShowSalaryInsights] = useState(false);
  const [careerMapView, setCareerMapView] = useState(false);
  const [isFABVisible, setIsFABVisible] = useState(false);
  const [standbyResume, setStandbyResume] = useState(null);
  const [inProfessionalSection, setInProfessionalSection] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });

  // Command Center Sidebar State
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem("userRole") || "seeker";
  });
  const [resumes, setResumes] = useState(() => {
    const saved = localStorage.getItem("userResumes");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);

  // SEPARATE Job Portal Authentication (Independent from Blog Auth)
  const [jobPortalUser, setJobPortalUser] = useState(() => {
    const saved = localStorage.getItem("jobPortal_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [jobPortalToken, setJobPortalToken] = useState(
    () => localStorage.getItem("jobPortal_token") || null
  );
  const [showJobPortalLogin, setShowJobPortalLogin] = useState(false);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/job-listings/all-jobs");
        
        if (response.data.success) {
          const jobsList = response.data.data || [];
          setJobs(jobsList);
          
          // Extract unique industries
          const uniqueIndustries = [...new Set(jobsList.map(job => job.industry))];
          setIndustries(uniqueIndustries);
        }
      } catch (error) {
        console.error("Fetch jobs error:", error);
        // Don't show error toast, just log it
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [axios]);

  // Listen for section changes to detect when in professional section
  useEffect(() => {
    const handleSectionChange = (e) => {
      setInProfessionalSection(e.detail.section === "professional");
    };

    window.addEventListener("section-change", handleSectionChange);
    return () => window.removeEventListener("section-change", handleSectionChange);
  }, []);

  // Initialize form with Job Portal user data if logged in
  useEffect(() => {
    if (jobPortalUser) {
      setForm((prev) => ({
        ...prev,
        name: jobPortalUser.name || "",
        email: jobPortalUser.email || "",
      }));
    }

    const stored = localStorage.getItem("appliedJobs");
    if (stored) setAppliedJobs(JSON.parse(stored));
  }, [jobPortalUser]);

  // Persist role choice to localStorage
  useEffect(() => {
    localStorage.setItem("userRole", currentRole);
  }, [currentRole]);

  // Persist resumes list to localStorage
  useEffect(() => {
    localStorage.setItem("userResumes", JSON.stringify(resumes));
  }, [resumes]);

  const applyFilters = useCallback(() => {
    const results = jobs.filter((job) => {
      const titleMatch = job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const locationMatch = job.location
        .toLowerCase()
        .includes(locationFilter.toLowerCase());
      const industryMatch =
        industryFilter === "All" || job.industry === industryFilter;
      const jobTypeMatch =
        jobTypeFilter === "All" || job.jobType === jobTypeFilter;
      const salaryMin = job.salary?.min || 0;
      const salaryMatch = salaryMin >= salaryRange.min && salaryMin <= salaryRange.max;
      return titleMatch && locationMatch && industryMatch && jobTypeMatch && salaryMatch;
    });

    setFilteredJobs(results);
  }, [jobs, searchQuery, locationFilter, industryFilter, jobTypeFilter, salaryRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleApplyClick = (job) => {
    if (!jobPortalUser) {
      toast.error("Please sign in to Job Portal to apply");
      setShowJobPortalLogin(true);
      return;
    }

    if (appliedJobs.includes(job._id)) {
      toast.error("You already applied for this job");
      return;
    }

    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // NEW: Open job detail drawer
  const handleViewDetails = (job) => {
    setDrawerJob(job);
    setIsDrawerOpen(true);
  };

  // NEW: AI Resume Tailor - suggests bullet points based on job
  const getAIResumeSuggestions = (job) => {
    // Mock AI suggestions - in production, call actual backend AI
    const suggestions = [
      `Contributed to ${job.industry} projects using ${job.jobType} technologies`,
      `Implemented features aligned with ${job.title} role requirements`,
      `Enhanced performance and scalability in production environments`,
    ];
    return suggestions;
  };

  // NEW: Calculate match score between user resume and job
  const calculateMatchScore = (job) => {
    // Mock scoring - in production, use actual resume analysis
    const baseScore = 65;
    const locationMatch = locationFilter === job.location ? 10 : 0;
    const industryMatch = industryFilter === job.industry ? 10 : 0;
    const score = Math.min(100, baseScore + locationMatch + industryMatch);
    return Math.floor(score);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.resume) {
      toast.error("Please complete all required fields");
      return;
    }

    // File validation
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const fileName = form.resume.name.toLowerCase();
    const isValid = allowedTypes.some((ext) => fileName.endsWith(ext));
    if (!isValid) {
      toast.error("Resume must be a PDF, DOC, or DOCX file");
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (form.resume.size > maxSize) {
      toast.error("Resume must be less than 5MB");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData with all required fields
      const formData = new FormData();
      formData.append("jobId", selectedJob._id);
      formData.append("jobTitle", selectedJob.title);
      formData.append("jobCompany", selectedJob.company);
      formData.append("applicantName", form.name);
      formData.append("applicantEmail", form.email);
      formData.append("coverLetter", form.coverLetter || "");
      formData.append("resume", form.resume);

      console.log('[JOB APPLICATION] Submitting to backend:', {
        jobId: selectedJob._id,
        jobTitle: selectedJob.title,
        jobCompany: selectedJob.company,
        applicantName: form.name,
        applicantEmail: form.email,
      });

      // Call backend API
      const { data } = await axios.post("/api/jobs/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        // Track applied job locally
        const updated = [...appliedJobs, selectedJob._id];
        setAppliedJobs(updated);
        localStorage.setItem("appliedJobs", JSON.stringify(updated));

        toast.success("Application submitted successfully! 🎉");
        setIsModalOpen(false);
        
        // Reset form
        setForm({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          coverLetter: "",
          resume: null,
        });
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (err) {
      console.error('[JOB APPLICATION] Error:', err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to submit application";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== COMMAND CENTER SIDEBAR HANDLERS ==========
  
  const handleRoleToggle = (newRole) => {
    setCurrentRole(newRole);
    toast.success(`Switched to ${newRole} mode`);
  };

  const handleResumeUpload = async (file, fileContent) => {
    try {
      toast.loading("Uploading resume to server...");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("userId", jobPortalUser?.id || "anonymous");

      // Upload to backend (which uses ImageKit)
      const response = await axios.post("/api/uploads/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const newResume = {
          id: Date.now(),
          name: file.name,
          size: file.size,
          content: fileContent,
          uploadedDate: new Date().toLocaleDateString(),
          imagekitUrl: response.data.url, // URL from ImageKit
          imagekitFileId: response.data.fileId, // File ID from ImageKit
        };
        setResumes([...resumes, newResume]);
        toast.dismiss();
        toast.success(`Resume "${file.name}" uploaded successfully! 🎉`);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message || "Failed to upload resume");
    }
  };

  const handleResumeDelete = (resumeName) => {
    setResumes(resumes.filter((r) => r.name !== resumeName));
    toast.success("Resume deleted");
  };

  const handlePostJobSubmit = async (formData) => {
    try {
      toast.loading("Creating job posting...");

      const response = await axios.post("/api/job-listings/create-employer", {
        ...formData,
        postedBy: jobPortalUser?.id,
        company: jobPortalUser?.company || jobPortalUser?.name,
      });

      if (response.data.success) {
        toast.dismiss();
        toast.success("Job posted successfully! 🎉");
        setShowPostJob(false);
        
        // Refresh jobs list
        const jobsResponse = await axios.get("/api/job-listings/all-jobs");
        if (jobsResponse.data.success) {
          setJobs(jobsResponse.data.data || []);
        }
      } else {
        throw new Error(response.data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Post job error:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message || "Failed to post job");
      throw error;
    }
  };

  // ========== FILTER HANDLER FOR SIDEBAR ==========
  
  const handleFilterChange = (filters) => {
    setSearchQuery(filters.searchQuery || "");
    setLocationFilter(filters.locationFilter || "");
    setIndustryFilter(filters.industryFilter || "All");
    setJobTypeFilter(filters.jobTypeFilter || "All");
    setSalaryRange(filters.salaryRange || { min: 0, max: 500000 });
    setIsSidebarOpen(false); // Close sidebar on mobile after applying filters
  };

  // ========== JOB PORTAL AUTHENTICATION HANDLERS ==========
  
  const handleJobPortalLogin = (userData) => {
    setJobPortalUser(userData);
    setJobPortalToken(userData.token);
    localStorage.setItem("jobPortal_user", JSON.stringify(userData));
    localStorage.setItem("jobPortal_token", userData.token);
    toast.success("Logged into Job Portal successfully!");
    setShowJobPortalLogin(false);
  };

  const handleJobPortalLogout = () => {
    // Clear only job portal session - NOT the blog session
    setJobPortalUser(null);
    setJobPortalToken(null);
    localStorage.removeItem("jobPortal_user");
    localStorage.removeItem("jobPortal_token");
    
    // Navigate away from job portal
    navigate("/");
    toast.success("Left Job Portal. You can log in again anytime.");
  };

  // Original blog logout (unchanged)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully");
  };

  // ========== SHOW SETTINGS PAGE ==========
  if (showSettings && jobPortalUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex">
        {/* Sidebar always visible */}
        <CommandCenterSidebar
          user={jobPortalUser}
          currentRole={currentRole}
          resumes={resumes}
          onRoleToggle={handleRoleToggle}
          onPostJob={() => setShowPostJob(true)}
          onSettingsClick={() => {}}
          onResumeUpload={handleResumeUpload}
          onResumeDelete={handleResumeDelete}
          onLogout={handleJobPortalLogout}
        />
        {/* Settings Page - takes rest of space */}
        <div className="flex-1">
          <SettingsPage
            user={jobPortalUser}
            onBack={() => setShowSettings(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      {/* Job Portal Navigation */}
      <JobPortalNav
        isLoggedIn={!!jobPortalUser}
        user={jobPortalUser}
        showCareerMap={careerMapView}
        onToggleCareerMap={() => setCareerMapView(!careerMapView)}
        showSalaryInsights={showSalaryInsights}
        onToggleSalaryInsights={() => setShowSalaryInsights(!showSalaryInsights)}
        myApplicationsCount={myApplications.length}
        onMyApplications={async () => {
          if (!jobPortalUser) {
            setShowJobPortalLogin(true);
            return;
          }
          setIsAppsModalOpen(true);
          try {
            setMyAppsLoading(true);
            const res = await axios.get("/api/jobs/my-applications");
            if (res.data && res.data.success) {
              setMyApplications(res.data.data || []);
            } else {
              toast.error(res.data?.message || "Failed to fetch applications");
            }
          } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to fetch applications";
            toast.error(msg);
          } finally {
            setMyAppsLoading(false);
          }
        }}
        onLogout={handleJobPortalLogout}
      />

      {/* Job Portal Login Modal - Separate from Blog Login */}
      <JobPortalLogin
        isOpen={showJobPortalLogin}
        onClose={() => setShowJobPortalLogin(false)}
        onLogin={handleJobPortalLogin}
      />

      {/* Command Center Sidebar - Always visible when logged in */}
      {jobPortalUser && (
        <CommandCenterSidebar
          user={jobPortalUser}
          currentRole={currentRole}
          resumes={resumes}
          onRoleToggle={handleRoleToggle}
          onPostJob={() => setShowPostJob(true)}
          onSettingsClick={() => setShowSettings(true)}
          onResumeUpload={handleResumeUpload}
          onResumeDelete={handleResumeDelete}
          onLogout={handleJobPortalLogout}
        />
      )}

      {/* Enhanced Job Sidebar - New Filter UI */}
      <EnhancedJobSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onFilterChange={handleFilterChange}
        jobs={jobs}
        appliedJobs={appliedJobs}
      />

      {/* Main Content - Fixed layout with sidebar padding */}
      <div className={`${jobPortalUser ? "lg:ml-80" : ""} min-h-screen pt-0`}>
        {/* PROFESSIONAL SECTION - Marks atmosphere boundary */}
        <section data-section="professional" className="px-4 md:px-6 py-8">
          {/* Career Map View */}
          {careerMapView && (
            <div className="mb-12 breathable-padding">
              <CareerMapView jobs={jobs} />
            </div>
          )}

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Menu size={18} />
              Filter Jobs
            </button>
            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-auto">
              {filteredJobs.length} jobs
            </div>
          </div>

          {/* Results Info */}
          <div className="text-gray-600 dark:text-gray-400 mb-6 text-sm font-medium">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                No jobs found matching your criteria
              </p>
            </div>
          ) : (
            /* Jobs Grid with Glass-Morphism Cards */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 refined-spacing">
              {filteredJobs.map((job) => {
                const matchScore = calculateMatchScore(job);
                const isApplied = appliedJobs.includes(job._id);

                return (
                  <div
                    key={job._id}
                    className="card-glass rounded-2xl breathable-padding hover:shadow-2xl transition group"
                  >
                    {/* Header with Match Score */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {job.title}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                          {job.company}
                        </p>
                      </div>
                      <MatchScoreIndicator
                        score={matchScore}
                        skills={[]}
                        jobRequirements={[]}
                      />
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      {showSalaryInsights && (
                        <div className="salary-insight">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">{job.salary}</p>
                            <p className="text-xs opacity-70">Market rate based on location</p>
                          </div>
                        </div>
                      )}
                      {!showSalaryInsights && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span>{job.jobType}</span>
                      </div>
                      {job.industry && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Industry: <span className="font-semibold">{job.industry}</span>
                        </div>
                      )}
                    </div>

                    {/* Tech Stack Tags */}
                    {job.technologies && (
                      <div className="mb-4">
                        <TechStackTags technologies={job.technologies} />
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2 text-sm leading-relaxed">
                      {job.description}
                    </p>

                    {/* Verified Badge */}
                    {job.isVerified && (
                      <div className="verified-badge mb-4">
                        <CheckCircle size={14} />
                        Verified Employer
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="flex-1 py-2 rounded-xl font-semibold transition border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Details
                      </button>
                      <button
                        onClick={() => handleApplyClick(job)}
                        disabled={isApplied}
                        className={`flex-1 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                          isApplied
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        {isApplied ? "Applied" : "Apply"}
                      </button>
                    </div>

                    {/* AI Resume Tailor Hint */}
                    {!isApplied && (
                      <button
                        onClick={() => {
                          const suggestions = getAIResumeSuggestions(job);
                          toast.success(
                            <>
                              <p className="font-semibold mb-2">💡 AI Resume Tips:</p>
                              {suggestions.map((s, i) => (
                                <p key={i} className="text-xs mb-1">
                                  • {s}
                                </p>
                              ))}
                            </>
                          );
                        }}
                        className="w-full mt-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition flex items-center justify-center gap-2 group/btn"
                      >
                        <Sparkles size={14} className="group-hover/btn:scale-110 transition" />
                        AI Resume Tailor
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Quick Apply FAB */}
      <QuickApplyFAB
        isVisible={isFABVisible && inProfessionalSection}
        selectedJob={selectedJob}
        userResume={standbyResume}
        isInProfessionalSection={inProfessionalSection}
        onApply={async (job, resume) => {
          if (!jobPortalUser) {
            toast.error("Please sign in to Job Portal to apply");
            setShowJobPortalLogin(true);
            return;
          }

          const formData = new FormData();
          formData.append("jobId", job._id);
          formData.append("jobTitle", job.title);
          formData.append("jobCompany", job.company);
          formData.append("applicantName", jobPortalUser?.name || "");
          formData.append("applicantEmail", jobPortalUser?.email || "");
          formData.append("resume", resume);

          try {
            const { data } = await axios.post("/api/jobs/apply", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
              const updated = [...appliedJobs, job._id];
              setAppliedJobs(updated);
              localStorage.setItem("appliedJobs", JSON.stringify(updated));
              toast.success("Quick applied successfully! 🎉");
            } else {
              toast.error(data.message || "Failed to submit application");
            }
          } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to submit";
            toast.error(errorMsg);
          }
        }}
      />

      {/* Job Detail Drawer */}
      <JobDetailDrawer
        isOpen={isDrawerOpen}
        job={drawerJob}
        onClose={() => setIsDrawerOpen(false)}
        isApplied={drawerJob ? appliedJobs.includes(drawerJob._id) : false}
        onApply={(job) => {
          handleApplyClick(job);
        }}
      />

      {/* My Applications Modal */}
      {isAppsModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto card-glass">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Applications ({myApplications.length})
              </h2>
              <button
                onClick={() => setIsAppsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {myAppsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : myApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  You have not applied to any jobs yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {app.jobTitle}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {app.jobCompany}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Applied: {new Date(app.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : app.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                          }`}
                        >
                          {app.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto card-glass">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedJob.title}
                </h2>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  {selectedJob.company}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Upload Resume (PDF, DOC, DOCX) *
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFormChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition hover:shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Form Modal */}
      <PostJobForm
        isOpen={showPostJob}
        onClose={() => setShowPostJob(false)}
        onSubmit={handlePostJobSubmit}
      />
    </div>
  );
};

export default JobSearchPage;

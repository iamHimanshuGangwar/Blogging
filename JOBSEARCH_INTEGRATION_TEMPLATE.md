# JobSearch.jsx - Command Center Integration Template

**Purpose**: Reference implementation showing how to integrate CommandCenterSidebar into the main job portal page

---

## 📋 Complete Integration Template

```jsx
// src/Pages/JobSearch.jsx

import { useState, useEffect, useCallback } from "react";
import { useAtmosphereScroll } from "@/hooks/useAtmosphereScroll";
import { SkillMatcher } from "@/utils/SkillMatcher";
import { ResumeParser } from "@/utils/ResumeParser";
import toast from "react-hot-toast";

// Components
import CommandCenterSidebar from "@/components/job-portal/CommandCenterSidebar";
import JobFilterButtons from "@/components/job-portal/JobFilterButtons";
import SmartJobCard from "@/components/job-portal/SmartJobCard";
import JobDetailDrawer from "@/components/job-portal/JobDetailDrawer";
import JobRecommendationEngine from "@/components/job-portal/JobRecommendationEngine";
import PostJobForm from "@/components/job-portal/PostJobForm";
import SettingsPage from "@/components/job-portal/SettingsPage";

export default function JobSearch() {
  // ==================== USER & AUTH STATE ====================
  const [currentUser, setCurrentUser] = useState({
    id: "user-123",
    fullName: "Jane Developer",
    email: "jane@example.com",
    avatar: "🧑‍💻",
  });

  // ==================== ROLE & MODE STATE ====================
  const [currentRole, setCurrentRole] = useState(() => {
    // Load from localStorage or default to seeker
    return localStorage.getItem("userRole") || "seeker";
  });

  useEffect(() => {
    // Persist role choice
    localStorage.setItem("userRole", currentRole);
  }, [currentRole]);

  // ==================== RESUME STATE ====================
  const [resumes, setResumes] = useState(() => {
    const saved = localStorage.getItem("userResumes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Persist resumes list
    localStorage.setItem("userResumes", JSON.stringify(resumes));
  }, [resumes]);

  // ==================== JOB LISTINGS STATE ====================
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // ==================== UI STATE ====================
  const [showSettings, setShowSettings] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);

  // ==================== FILTER STATE ====================
  const [filters, setFilters] = useState({
    searchQuery: "",
    location: "",
    jobType: "all",
    industry: "all",
    minSalary: 0,
    maxSalary: 300000,
    isRemote: false,
  });

  // ==================== FAVORITES STATE ====================
  const [favoriteJobs, setFavoriteJobs] = useState(() => {
    const saved = localStorage.getItem("favoriteJobs");
    return saved ? JSON.parse(saved) : [];
  });

  // ==================== INITIALIZE ATMOSPHERE SCROLL ====================
  useAtmosphereScroll();

  // ==================== FETCH JOBS ====================
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const response = await fetch("/api/jobs/list");
        const data = await response.json();
        setAllJobs(data);
        applyFilters(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to load jobs");
        // Mock data for development
        setAllJobs(MOCK_JOBS);
        applyFilters(MOCK_JOBS);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // ==================== APPLY FILTERS ====================
  const applyFilters = useCallback(
    (jobs) => {
      const filtered = jobs.filter((job) => {
        const matchSearch =
          job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.searchQuery.toLowerCase());

        const matchLocation =
          !filters.location ||
          job.location.toLowerCase().includes(filters.location.toLowerCase());

        const matchType =
          filters.jobType === "all" || job.type === filters.jobType;

        const matchIndustry =
          filters.industry === "all" || job.industry === filters.industry;

        const matchSalary =
          job.salary >= filters.minSalary && job.salary <= filters.maxSalary;

        const matchRemote =
          !filters.isRemote || job.isRemote;

        return (
          matchSearch &&
          matchLocation &&
          matchType &&
          matchIndustry &&
          matchSalary &&
          matchRemote
        );
      });

      setFilteredJobs(filtered);
    },
    [filters]
  );

  useEffect(() => {
    applyFilters(allJobs);
  }, [filters, allJobs, applyFilters]);

  // ==================== HANDLE RESUME UPLOAD ====================
  const handleResumeUpload = async (file, fileContent) => {
    try {
      // Parse resume
      const parsedResume = ResumeParser.parseResume(fileContent);

      const newResume = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        content: fileContent,
        parsed: parsedResume,
        uploadedDate: new Date().toLocaleDateString(),
        uploadedTime: new Date().toLocaleTimeString(),
      };

      // Add to local state
      setResumes([...resumes, newResume]);

      // TODO: Upload to Supabase storage
      // const response = await fetch("/api/resumes/upload", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     fileName: file.name,
      //     fileContent,
      //     fileSize: file.size,
      //   }),
      // });

      toast.success(`Resume "${file.name}" uploaded successfully!`);
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error("Failed to upload resume");
    }
  };

  // ==================== HANDLE RESUME DELETE ====================
  const handleResumeDelete = (resumeName) => {
    setResumes(resumes.filter((r) => r.name !== resumeName));
    toast.success("Resume deleted");

    // TODO: Delete from Supabase storage
    // const resumeId = resumes.find(r => r.name === resumeName)?.id;
    // if (resumeId) {
    //   await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" });
    // }
  };

  // ==================== HANDLE ROLE TOGGLE ====================
  const handleRoleToggle = async (newRole) => {
    setCurrentRole(newRole);

    // TODO: Persist role to backend
    // try {
    //   const response = await fetch("/api/user/toggle-role", {
    //     method: "POST",
    //     body: JSON.stringify({ role: newRole }),
    //   });
    //   if (response.ok) {
    //     toast.success(`Switched to ${newRole} mode`);
    //   }
    // } catch (error) {
    //   toast.error("Failed to update role");
    //   setCurrentRole(currentRole); // Revert
    // }
  };

  // ==================== HANDLE JOB FAVORITE ====================
  const handleToggleFavorite = (jobId) => {
    if (favoriteJobs.includes(jobId)) {
      setFavoriteJobs(favoriteJobs.filter((id) => id !== jobId));
      toast.success("Removed from favorites");
    } else {
      setFavoriteJobs([...favoriteJobs, jobId]);
      toast.success("Added to favorites");
    }

    // Persist to localStorage
    localStorage.setItem("favoriteJobs", JSON.stringify(favoriteJobs));
  };

  // ==================== HANDLE JOB APPLY ====================
  const handleApplyForJob = async (jobId) => {
    // Check if authenticated
    if (!currentUser) {
      toast.error("Please sign in to apply");
      return;
    }

    // Get selected resume (use first resume or let user choose)
    if (resumes.length === 0) {
      toast.error("Please upload a resume first");
      return;
    }

    const selectedResume = resumes[0];
    const job = allJobs.find((j) => j.id === jobId);

    try {
      const response = await fetch("/api/applications/create", {
        method: "POST",
        body: JSON.stringify({
          jobId,
          resumeId: selectedResume.id,
          resumeText: selectedResume.content,
          userEmail: currentUser.email,
          jobTitle: job.title,
          companyName: job.company,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Application submitted!");
        setShowJobDetail(false);
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Apply error:", error);
      toast.error(error.message);
    }
  };

  // ==================== HANDLE POST JOB ====================
  const handlePostJob = async (jobFormData) => {
    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        body: JSON.stringify({
          ...jobFormData,
          postedBy: currentUser.id,
          createdAt: new Date(),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Job posted successfully!");
        setShowPostJob(false);
        // Refresh job list
        const updatedResponse = await fetch("/api/jobs/list");
        const updatedJobs = await updatedResponse.json();
        setAllJobs(updatedJobs);
      }
    } catch (error) {
      toast.error("Failed to post job");
      throw error;
    }
  };

  // ==================== RENDER ====================
  if (showSettings) {
    return (
      <SettingsPage
        user={currentUser}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      {/* ================== SIDEBAR ================== */}
      <CommandCenterSidebar
        user={currentUser}
        currentRole={currentRole}
        resumes={resumes}
        onRoleToggle={handleRoleToggle}
        onPostJob={() => setShowPostJob(true)}
        onSettingsClick={() => setShowSettings(true)}
        onResumeUpload={handleResumeUpload}
        onResumeDelete={handleResumeDelete}
        onLogout={() => {
          setCurrentUser(null);
          toast.success("Signed out successfully");
        }}
      />

      {/* ================== MAIN CONTENT ================== */}
      <main className="flex-1 lg:ml-0 max-w-7xl mx-auto px-4 py-8">
        {/* Header with Filters */}
        <div className="section-creative mb-8 transition-colors duration-800">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {currentRole === "seeker" ? "Discover Opportunities" : "Manage Postings"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {currentRole === "seeker"
              ? "Find your next role with our AI-powered job matching"
              : "Post jobs and manage your hiring pipeline"}
          </p>
        </div>

        {/* Filter Buttons */}
        {currentRole === "seeker" && (
          <JobFilterButtons
            onFilterChange={setFilters}
            filters={filters}
          />
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingJobs ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No jobs found matching your filters
              </p>
              <button
                onClick={() => setFilters({
                  searchQuery: "",
                  location: "",
                  jobType: "all",
                  industry: "all",
                  minSalary: 0,
                  maxSalary: 300000,
                  isRemote: false,
                })}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <SmartJobCard
                key={job.id}
                job={job}
                isFavorited={favoriteJobs.includes(job.id)}
                onToggleFavorite={() => handleToggleFavorite(job.id)}
                onViewDetails={() => {
                  setSelectedJob(job);
                  setShowJobDetail(true);
                }}
                onApply={() => handleApplyForJob(job.id)}
                currentUserRole={currentRole}
              />
            ))
          )}
        </div>

        {/* Recommendations Section */}
        {filteredJobs.length > 0 && resumes.length > 0 && currentRole === "seeker" && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <JobRecommendationEngine
              userResume={resumes[0]}
              availableJobs={filteredJobs.slice(0, 10)}
              onApply={(jobId) => handleApplyForJob(jobId)}
            />
          </div>
        )}
      </main>

      {/* ================== JOB DETAIL DRAWER ================== */}
      {selectedJob && (
        <JobDetailDrawer
          job={selectedJob}
          isOpen={showJobDetail}
          onClose={() => {
            setShowJobDetail(false);
            setSelectedJob(null);
          }}
          onApply={() => handleApplyForJob(selectedJob.id)}
          currentUserRole={currentRole}
        />
      )}

      {/* ================== POST JOB FORM MODAL ================== */}
      {showPostJob && (
        <PostJobForm
          isOpen={showPostJob}
          onClose={() => setShowPostJob(false)}
          onSubmit={handlePostJob}
        />
      )}
    </div>
  );
}

// ==================== MOCK DATA ====================
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: 180000,
    type: "Full-time",
    industry: "Technology",
    isRemote: true,
    description: "We're looking for an experienced React developer...",
    requirements: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    postedDays: 2,
    applicants: 24,
    matchScore: 92,
  },
  // ... more mock jobs
];
```

---

## 🔌 Key Integration Points

### 1. Sidebar State Management
```javascript
const [currentRole, setCurrentRole] = useState("seeker");
const [showSettings, setShowSettings] = useState(false);
const [resumes, setResumes] = useState([]);
```

### 2. Pass Props to Sidebar
```jsx
<CommandCenterSidebar
  user={currentUser}
  currentRole={currentRole}
  resumes={resumes}
  onRoleToggle={handleRoleToggle}
  onPostJob={() => setShowPostJob(true)}
  onSettingsClick={() => setShowSettings(true)}
  onResumeUpload={handleResumeUpload}
  onResumeDelete={handleResumeDelete}
  onLogout={() => setCurrentUser(null)}
/>
```

### 3. Conditional Rendering Based on Role
```javascript
{currentRole === "seeker" && (
  <JobFilterButtons filters={filters} onFilterChange={setFilters} />
)}

{currentRole === "employer" && (
  <button onClick={() => setShowPostJob(true)}>Post a Job</button>
)}
```

### 4. Resume Utilization
```javascript
// When applying to jobs
const selectedResume = resumes[0];
const response = await fetch("/api/applications/create", {
  body: JSON.stringify({
    jobId,
    resumeId: selectedResume.id,
    resumeText: selectedResume.content,
  }),
});
```

---

## 📝 TODO Items

- [ ] Connect to actual job API endpoints
- [ ] Implement Supabase resume storage
- [ ] Add authentication check before resume upload
- [ ] Create backend endpoints for role persistence
- [ ] Add email validation for job applications
- [ ] Implement notification system for new job matches
- [ ] Add resume preview modal
- [ ] Add application history tracking

---

**Version**: 3.1  
**Last Updated**: February 23, 2026  
**Status**: Reference Implementation ✅

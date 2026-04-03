import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  DownloadCloud,
  FileText,
  Zap,
  CheckCircle,
  Code,
  Briefcase,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { ResumeParser } from "../utils/EnhancedResumeParser";
import ResumeJobMatcher from "../components/job-portal/ResumeJobMatcher";
/**
 * Enhanced Resume Manager
 * Features:
 * - Create and manage multiple resumes
 * - Upload resume files (PDF/DOC)
 * - Parse resume to extract skills, experience, education
 * - Show matched jobs based on resume analysis
 * - AI-powered job recommendations
 */
const EnhancedResumeManager = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  // State
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeProfile, setResumeProfile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newResume, setNewResume] = useState({
    name: "",
    file: null,
    isPrimary: false,
  });

  // Load resumes and jobs on mount
  useEffect(() => {
    loadResumes();
    loadJobs();
  }, []);

  const loadResumes = () => {
    const saved = localStorage.getItem("jobPortalResumes");
    if (saved) {
      setResumes(JSON.parse(saved));
    }
  };

  const loadJobs = async () => {
    try {
      const response = await axios.get("/api/job-listings/all-jobs");
      if (response.data.success) {
        setJobs(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "application/msword", "text/plain"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOC, or TXT file");
      return;
    }

    setUploadingFile(true);

    try {
      // Read file as text
      const text = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file, "UTF-8");
      });

      // Parse resume
      const profile = ResumeParser.parseResume(text);

      // Create resume object
      const resume = {
        id: Date.now(),
        name: newResume.name || file.name,
        fileName: file.name,
        fileSize: file.size,
        isPrimary: newResume.isPrimary || resumes.length === 0,
        createdAt: new Date().toISOString(),
        profile: profile,
        content: text,
      };

      // Save to localStorage
      const updated = [...resumes, resume];
      setResumes(updated);
      localStorage.setItem("jobPortalResumes", JSON.stringify(updated));

      // Set as selected and show matched jobs
      setSelectedResume(resume);
      setResumeProfile(profile);
      analyzeAndMatchJobs(profile, jobs);

      toast.success("Resume uploaded and analyzed! 🎉");
      setShowUploadModal(false);
      setNewResume({ name: "", file: null, isPrimary: false });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process resume file");
    } finally {
      setUploadingFile(false);
    }
  };

  // Analyze resume and match jobs
  const analyzeAndMatchJobs = (profile, jobsList) => {
    const matched = jobsList.map((job) => ({
      ...job,
      matchScore: ResumeParser.calculateMatchScore(profile, job),
      matchedSkills: job.skills || [],
      matchDetails: {
        matchedSkills: profile.skills.matched.length,
        requiredSkills: Math.max(3, profile.skills.matched.length),
        experience: profile.experience,
        requiredExperience: 2,
      },
    }));

    // Sort by match score
    const sorted = matched.sort((a, b) => b.matchScore - a.matchScore);
    setMatchedJobs(sorted.slice(0, 12)); // Top 12 matches
  };

  // Delete resume
  const handleDeleteResume = (id) => {
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);
    localStorage.setItem("jobPortalResumes", JSON.stringify(updated));
    if (selectedResume?.id === id) {
      setSelectedResume(null);
      setResumeProfile(null);
      setMatchedJobs([]);
    }
    toast.success("Resume deleted");
  };

  // View resume details
  const handleViewResume = (resume) => {
    setSelectedResume(resume);
    setResumeProfile(resume.profile);
    analyzeAndMatchJobs(resume.profile, jobs);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/jobs")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Resume Manager
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload & match resumes to job opportunities
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              <Upload size={20} />
              Upload Resume
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Resumes List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  My Resumes
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {resumes.length === 0 ? (
                  <div className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No resumes yet
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                    >
                      <Plus size={16} className="inline mr-2" />
                      Upload First
                    </button>
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => handleViewResume(resume)}
                      className={`p-4 cursor-pointer transition ${
                        selectedResume?.id === resume.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {resume.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Resume Analysis & Matched Jobs */}
          <div className="lg:col-span-2">
            {selectedResume && resumeProfile ? (
              <div className="space-y-6">
                {/* Resume Profile Summary */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">{selectedResume.name}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Experience */}
                    <div className="bg-blue-700/50 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase size={18} />
                        <span className="text-sm opacity-90">Experience</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {resumeProfile.experience}+
                      </p>
                      <p className="text-xs opacity-75">years</p>
                    </div>

                    {/* Skills */}
                    <div className="bg-blue-700/50 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-2 mb-2">
                        <Code size={18} />
                        <span className="text-sm opacity-90">Skills</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {resumeProfile.skills.matched.length}
                      </p>
                      <p className="text-xs opacity-75">matched</p>
                    </div>

                    {/* Education */}
                    <div className="bg-blue-700/50 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-2 mb-2">
                        <Award size={18} />
                        <span className="text-sm opacity-90">Education</span>
                      </div>
                      <p className="text-lg font-bold capitalize">
                        {resumeProfile.education}
                      </p>
                    </div>

                    {/* Certifications */}
                    <div className="bg-blue-700/50 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} />
                        <span className="text-sm opacity-90">Certs</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {resumeProfile.certifications.length}
                      </p>
                      <p className="text-xs opacity-75">
                        {resumeProfile.certifications.length === 1
                          ? "cert"
                          : "certs"}
                      </p>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  {resumeProfile.skills.matched.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm opacity-90 mb-2">Top Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {resumeProfile.skills.matched.slice(0, 6).map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium"
                          >
                            {skill.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Matched Jobs */}
                {matchedJobs.length > 0 && (
                  <ResumeJobMatcher
                    jobs={matchedJobs}
                    resumeProfile={resumeProfile}
                    onJobSelect={(job) => {
                      console.log("Selected job:", job);
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  No resume selected
                </p>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Upload or select a resume to see job matches
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Upload size={20} />
                  Upload Your First Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Upload Resume
            </h2>

            <div className="space-y-4">
              {/* Resume Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume Name (optional)
                </label>
                <input
                  type="text"
                  value={newResume.name}
                  onChange={(e) =>
                    setNewResume({ ...newResume, name: e.target.value })
                  }
                  
                  placeholder="e.g., Senior React Developer"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Resume File
                </label>
                <label className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <div className="text-center">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PDF, DOC, or TXT (Max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size <= 5 * 1024 * 1024) {
                        setNewResume({ ...newResume, file });
                      } else if (file) {
                        toast.error("File size should be less than 5MB");
                      }
                    }}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                </label>
                {newResume.file && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    ✓ {newResume.file.name}
                  </p>
                )}
              </div>

              {/* Primary Resume Checkbox */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newResume.isPrimary}
                  onChange={(e) =>
                    setNewResume({ ...newResume, isPrimary: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Set as primary resume
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!newResume.file || uploadingFile}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {uploadingFile ? "Uploading..." : "Upload & Analyze"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedResumeManager;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  DownloadCloud,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Consent Dialog Component
 */
const VisibilityConsentDialog = ({ isOpen, onConfirm, onCancel, resumeName, isPublic }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Change Resume Visibility
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {resumeName}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {isPublic
                  ? "This resume will be visible in your public profile. Employers and recruiters can view it."
                  : "This resume will be private. Only you can see it. It won't appear in your public profile."}
              </p>
            </div>
            <div className="text-2xl">
              {isPublic ? <Eye className="text-blue-600" /> : <Lock className="text-gray-600" />}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {isPublic ? "Make Public" : "Make Private"}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Resume Manager Page
 * Manage multiple resumes for job applications
 */
const ResumeManager = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVisibilityDialog, setShowVisibilityDialog] = useState(false);
  const [selectedResumeForVisibility, setSelectedResumeForVisibility] = useState(null);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newResume, setNewResume] = useState({
    name: "",
    isPrimary: false,
    isPublic: false,
    template: "professional",
  });

  useEffect(() => {
    // Load saved resumes from localStorage
    const saved = localStorage.getItem("jobPortalResumes");
    if (saved) {
      setResumes(JSON.parse(saved));
    }
  }, []);

  const handleVisibilityChange = (resume) => {
    setSelectedResumeForVisibility(resume);
    setPendingVisibilityChange(!resume.isPublic);
    setShowVisibilityDialog(true);
  };

  const confirmVisibilityChange = () => {
    if (!selectedResumeForVisibility) return;

    const updated = resumes.map((r) =>
      r.id === selectedResumeForVisibility.id
        ? { ...r, isPublic: pendingVisibilityChange }
        : r
    );
    setResumes(updated);
    localStorage.setItem("jobPortalResumes", JSON.stringify(updated));
    
    toast.success(
      `Resume is now ${pendingVisibilityChange ? "Public" : "Private"}`
    );

    setShowVisibilityDialog(false);
    setSelectedResumeForVisibility(null);
    setPendingVisibilityChange(null);
  };

  const handleCreateResume = () => {
    // Navigate to resume builder
    navigate("/resume-builder");
  };

  const handleUploadResume = () => {
    setShowUploadModal(true);
  };

  const handleAddResume = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!newResume.name.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    setIsUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("userId", localStorage.getItem("userId") || "anonymous");

      // Upload to backend
      const response = await axios.post("/api/uploads/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Create resume object with backend response
        const resume = {
          id: Date.now(),
          name: newResume.name,
          isPrimary: newResume.isPrimary || resumes.length === 0,
          isPublic: false,
          template: newResume.template,
          createdAt: new Date().toISOString(),
          fileName: response.data.fileName || selectedFile?.name || "uploaded-resume.pdf",
          fileSize: response.data.size || selectedFile?.size || 0,
          fileUrl: response.data.url, // Store backend URL
          fileId: response.data.fileId, // Store file ID for deletion
        };

        // Update local state
        const updated = [...resumes, resume];
        setResumes(updated);
        localStorage.setItem("jobPortalResumes", JSON.stringify(updated));
        
        // Reset form
        setNewResume({ name: "", isPrimary: false, isPublic: false, template: "professional" });
        setSelectedFile(null);
        setShowUploadModal(false);
        
        // Clear file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        
        toast.success("Resume uploaded successfully! ✨");
      } else {
        toast.error(response.data.message || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF, DOC, DOCX, and TXT files are allowed");
        setSelectedFile(null);
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      // Auto-fill name if empty
      if (!newResume.name) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setNewResume({ ...newResume, name: fileName });
      }
      toast.success("File selected: " + file.name);
    }
  };

  const handleDeleteResume = (id) => {
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);
    localStorage.setItem("jobPortalResumes", JSON.stringify(updated));
    toast.success("Resume deleted");
  };

  const handleSetPrimary = (id) => {
    const updated = resumes.map((r) => ({
      ...r,
      isPrimary: r.id === id,
    }));
    setResumes(updated);
    localStorage.setItem("jobPortalResumes", JSON.stringify(updated));
    toast.success("Primary resume updated");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/jobs")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Resume Manager
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and manage multiple resumes
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateResume}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                <Plus size={20} />
                Create Resume
              </button>
              <button
                onClick={handleUploadResume}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition"
              >
                <Upload size={20} />
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumes List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create Resume Card */}
          <button
            onClick={handleCreateResume}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition transform hover:scale-105"
          >
            <Plus size={40} className="text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Resume
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Build a professional resume using our intuitive resume builder
            </p>
          </button>

          {/* Upload Resume Card */}
          <button
            onClick={handleUploadResume}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-900/10 rounded-xl p-8 border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition transform hover:scale-105"
          >
            <Upload size={40} className="text-slate-600 dark:text-slate-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upload Resume
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Upload your existing resume in PDF, DOC, or DOCX format
            </p>
          </button>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-300 dark:border-gray-700" />

        {/* Existing Resumes Section */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          My Resumes
        </h2>

        {resumes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No resumes yet. Create or upload one using the cards above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {resume.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {resume.isPrimary && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                        Primary
                      </span>
                    )}
                    {resume.isPublic && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
                        Public
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Visibility Toggle */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <button
                      onClick={() => handleVisibilityChange(resume)}
                      className="flex items-center gap-2 flex-1 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {resume.isPublic ? (
                        <>
                          <Eye size={16} className="text-green-600" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} className="text-gray-600" />
                          <span>Private</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleVisibilityChange(resume)}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium"
                    >
                      Change
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {!resume.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(resume.id)}
                        className="flex-1 px-3 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 font-medium text-sm"
                      >
                        Set as Primary
                      </button>
                    )}
                    <button
                      onClick={() => {
                        toast.success("Resume download feature coming soon!");
                      }}
                      className="flex-1 px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <DownloadCloud size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Upload Resume
            </h2>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      {selectedFile ? (
                        <>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            ✓ {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Click to upload</span> or drag
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>

              {/* Resume Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume Name
                </label>
                <input
                  type="text"
                  value={newResume.name}
                  onChange={(e) => setNewResume({ ...newResume, name: e.target.value })}
                  placeholder="e.g., Senior React Developer Resume"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Primary Checkbox */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newResume.isPrimary}
                  onChange={(e) =>
                    setNewResume({ ...newResume, isPrimary: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Set as primary resume
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setNewResume({ name: "", isPrimary: false, isPublic: false, template: "professional" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResume}
                  disabled={!selectedFile || !newResume.name.trim() || isUploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload & Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Consent Dialog */}
      <VisibilityConsentDialog
        isOpen={showVisibilityDialog}
        onConfirm={confirmVisibilityChange}
        onCancel={() => {
          setShowVisibilityDialog(false);
          setSelectedResumeForVisibility(null);
          setPendingVisibilityChange(null);
        }}
        resumeName={selectedResumeForVisibility?.name || ""}
        isPublic={pendingVisibilityChange || false}
      />
    </div>
  );
};

export default ResumeManager;

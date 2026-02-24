import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, DownloadCloud, FileText } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Resume Manager Page
 * Manage multiple resumes for job applications
 */
const ResumeManager = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newResume, setNewResume] = useState({
    name: "",
    isPrimary: false,
  });

  useEffect(() => {
    // Load saved resumes from localStorage
    const saved = localStorage.getItem("jobPortalResumes");
    if (saved) {
      setResumes(JSON.parse(saved));
    }
  }, []);

  const handleAddResume = () => {
    if (!newResume.name.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    const resume = {
      id: Date.now(),
      name: newResume.name,
      isPrimary: newResume.isPrimary || resumes.length === 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [...resumes, resume];
    setResumes(updated);
    localStorage.setItem("jobPortalResumes", JSON.stringify(updated));
    setNewResume({ name: "", isPrimary: false });
    setShowUploadModal(false);
    toast.success("Resume added!");
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
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus size={20} />
              New Resume
            </button>
          </div>
        </div>
      </div>

      {/* Resumes List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resumes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">
              No resumes yet
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus size={20} />
              Create Your First Resume
            </button>
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
                  {resume.isPrimary && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                      Primary
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!resume.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(resume.id)}
                      className="flex-1 px-3 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 font-medium text-sm"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm flex items-center justify-center gap-2">
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
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Add New Resume
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume Name
                </label>
                <input
                  type="text"
                  value={newResume.name}
                  onChange={(e) => setNewResume({ ...newResume, name: e.target.value })}
                  placeholder="e.g., Software Engineer Resume"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newResume.isPrimary}
                  onChange={(e) => setNewResume({ ...newResume, isPrimary: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Set as primary resume
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResume}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;

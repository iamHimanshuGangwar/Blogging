import React, { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Upload,
  FileText,
  Settings,
  Plus,
  Briefcase,
  User,
  LogOut,
  Sun,
  Moon,
  Bell,
  Shield,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Collapsible Command Center Sidebar
 * Features:
 * - User profile with role toggle (Job Seeker ↔ Hiring Mode)
 * - Resume Hub (upload, preview, manage)
 * - Settings & Preferences
 * - Post a Job button
 * - Adaptive Atmosphere integration
 */
const CommandCenterSidebar = ({
  user = null,
  onRoleToggle = () => {},
  onPostJob = () => {},
  onSettingsClick = () => {},
  onLogout = () => {},
  resumes = [],
  onResumeUpload = () => {},
  onResumeDelete = () => {},
  currentRole = "seeker", // "seeker" or "employer"
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["application/pdf", "text/plain"].includes(file.type)) {
      toast.error("Only PDF and TXT files are supported");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
        uploadedAt: new Date().toLocaleDateString(),
      });
      onResumeUpload(file, event.target.result);
      toast.success(`Resume "${file.name}" uploaded! 📄`);
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.createElement("input");
      input.type = "file";
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", {
        writable: false,
        value: input,
      });
      handleResumeUpload(event);
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition lg:hidden"
      >
        <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition lg:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-900 dark:text-white" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-80 card-glass border-r border-gray-200 dark:border-gray-700 z-40 overflow-y-auto transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          animation: isOpen ? "slideUpIn 0.3s ease-out" : "none",
        }}
      >
        {/* Close on Mobile */}
        <div className="flex justify-between items-center p-4 lg:hidden border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">Command Center</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* User Profile Section */}
          <div
            className="card-glass rounded-lg p-4 border border-blue-200 dark:border-blue-800"
            style={{
              animation: "slideUpIn 0.3s ease-out",
            }}
          >
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-between hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {user.name || user.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Expanded */}
            {isProfileOpen && (
              <div className="mt-4 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Role Toggle */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    MODE
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRoleToggle("seeker")}
                      className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                        currentRole === "seeker"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Briefcase size={16} />
                      Seeker
                    </button>
                    <button
                      onClick={() => onRoleToggle("employer")}
                      className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                        currentRole === "employer"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Plus size={16} />
                      Employer
                    </button>
                  </div>
                </div>

                {/* Settings Button */}
                <button
                  onClick={() => {
                    onSettingsClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition"
                >
                  <Settings size={18} />
                  Settings & Preferences
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium transition"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Resume Hub Section - Only for Job Seekers */}
          {currentRole === "seeker" && (
            <div className="space-y-3">
              <button
                onClick={() => setIsResumeOpen(!isResumeOpen)}
                className="w-full flex items-center justify-between hover:opacity-80 transition p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Resume Hub
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isResumeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isResumeOpen && (
                <div className="space-y-3 pl-7">
                  {/* Drag & Drop Upload Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    <label className="cursor-pointer block">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Drop resume here
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Uploaded Resumes List */}
                  <div className="space-y-2">
                    {filePreview ? (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                              {filePreview.name}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                              {filePreview.size} KB • {filePreview.uploadedAt}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onResumeDelete(filePreview.name);
                              setFilePreview(null);
                              toast.success("Resume deleted");
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center py-3">
                        No resumes uploaded yet
                      </p>
                    )}

                    {resumes.map((resume, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText size={16} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                              {resume.name || `Resume ${idx + 1}`}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {resume.uploadedDate || "Recently"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Post a Job Section - Only for Employers */}
          {currentRole === "employer" && (
            <button
              onClick={() => {
                onPostJob();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
              Post a Job
            </button>
          )}

          {/* Preferences Section */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase px-3">
              Preferences
            </p>

            {/* Notification Settings */}
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <ChevronDown size={16} />
            </button>

            {/* Privacy Settings */}
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Privacy</span>
              </div>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-gray-600 dark:text-gray-400 p-3 border-t border-gray-200 dark:border-gray-700">
            <p>🎨 Adaptive Atmosphere Active</p>
            <p className="mt-1">v3.0 • Command Center</p>
          </div>
        </div>
      </aside>

      {/* Content Offset on Desktop */}
      <style jsx>{`
        @media (min-width: 1024px) {
          body {
            margin-left: 0; /* Sidebar is fixed, no offset needed */
          }
        }
      `}</style>
    </>
  );
};

export default CommandCenterSidebar;

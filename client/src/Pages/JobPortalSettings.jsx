import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Lock,
  Share2,
  LogOut,
  Save,
  Briefcase,
  Zap,
  DollarSign,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

/**
 * Job Portal Settings Page - Enhanced with full backend integration
 */
const JobPortalSettings = () => {
  const navigate = useNavigate();
  const { axios, token } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      jobRecommendations: true,
      applicationUpdates: true,
      emailDigest: true,
      aiFeatures: true,
      pushNotifications: true,
    },
    privacy: {
      profileVisibility: "public",
      showSkills: true,
      showExperience: true,
      allowMessageFromRecruiters: true,
    },
    jobPreferences: {
      preferredSalaryMin: 0,
      preferredSalaryMax: 500000,
      preferredJobTypes: ["Full-time"],
      preferredIndustries: [],
      experienceLevel: "all",
      willingToRelocate: false,
    },
    aiFeatures: {
      aiResumeReview: true,
      aiInterviewPrep: true,
      aiJobMatching: true,
      aiCoverLetterGeneration: true,
    },
    emailPreferences: {
      digestFrequency: "weekly",
      digestFormat: "html",
      keywordAlerts: true,
    },
  });

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/jobPortal/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success && response.data?.settings) {
          setSettings(response.data.settings);
        } else {
          // Load from localStorage as fallback
          const saved = localStorage.getItem("jobPortalSettings");
          if (saved) setSettings(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Fallback to localStorage
        const saved = localStorage.getItem("jobPortalSettings");
        if (saved) setSettings(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [axios, token]);

  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to backend
      await axios.post(
        "/api/jobPortal/settings",
        { settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Also save to localStorage
      localStorage.setItem("jobPortalSettings", JSON.stringify(settings));
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      // Fallback: still save to localStorage
      localStorage.setItem("jobPortalSettings", JSON.stringify(settings));
      toast.success("Settings saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jobPortal_user");
    localStorage.removeItem("jobPortal_token");
    navigate("/");
    toast.success("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/jobs")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your job portal preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "jobRecommendations",
                  label: "Job Recommendations",
                  desc: "Get notified about jobs matching your profile",
                },
                {
                  key: "applicationUpdates",
                  label: "Application Updates",
                  desc: "Receive updates on your job applications",
                },
                {
                  key: "emailDigest",
                  label: "Weekly Email Digest",
                  desc: "Get a weekly summary of jobs and opportunities",
                },
                {
                  key: "aiFeatures",
                  label: "AI Features Updates",
                  desc: "Be notified about new AI features",
                },
                {
                  key: "pushNotifications",
                  label: "Push Notifications",
                  desc: "Receive browser push notifications",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={() => handleToggle("notifications", item.key)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Privacy
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Profile Visibility
                </label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        profileVisibility: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="recruiters">Recruiters Only</option>
                </select>
              </div>

              {[
                { key: "showSkills", label: "Show Skills" },
                { key: "showExperience", label: "Show Experience" },
                  { key: "allowMessageFromRecruiters", label: "Allow Messages from Recruiters" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy[item.key]}
                        onChange={() => handleToggle("privacy", item.key)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                      />
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Job Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Job Preferences
              </h2>
            </div>

            <div className="space-y-4">
              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Preferred Salary Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={settings.jobPreferences.preferredSalaryMin}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          jobPreferences: {
                            ...prev.jobPreferences,
                            preferredSalaryMin: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={settings.jobPreferences.preferredSalaryMax}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          jobPreferences: {
                            ...prev.jobPreferences,
                            preferredSalaryMax: parseInt(e.target.value) || 500000,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Experience Level
                </label>
                <select
                  value={settings.jobPreferences.experienceLevel}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      jobPreferences: {
                        ...prev.jobPreferences,
                        experienceLevel: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5+ years)</option>
                  <option value="lead">Lead/Manager</option>
                </select>
              </div>

              {/* Relocation */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">
                  Willing to Relocate
                </p>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.jobPreferences.willingToRelocate}
                    onChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        jobPreferences: {
                          ...prev.jobPreferences,
                          willingToRelocate: !prev.jobPreferences.willingToRelocate,
                        },
                      }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Features
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "aiResumeReview",
                  label: "AI Resume Review",
                  desc: "Get AI-powered feedback on your resume",
                },
                {
                  key: "aiInterviewPrep",
                  label: "AI Interview Preparation",
                  desc: "Practice interviews with AI assistant",
                },
                {
                  key: "aiJobMatching",
                  label: "AI Job Matching",
                  desc: "Get personalized job recommendations",
                },
                {
                  key: "aiCoverLetterGeneration",
                  label: "AI Cover Letter Generation",
                  desc: "Generate cover letters automatically",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.aiFeatures[item.key]}
                      onChange={() => handleToggle("aiFeatures", item.key)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Email Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Email Digest
              </h2>
            </div>

            <div className="space-y-4">
              {/* Digest Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Email Digest Frequency
                </label>
                <select
                  value={settings.emailPreferences.digestFrequency}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      emailPreferences: {
                        ...prev.emailPreferences,
                        digestFrequency: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Keyword Alerts */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">
                  Keyword Alerts
                </p>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailPreferences.keywordAlerts}
                    onChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        emailPreferences: {
                          ...prev.emailPreferences,
                          keywordAlerts: !prev.emailPreferences.keywordAlerts,
                        },
                      }))
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Account
              </h2>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-left text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                Change Password
              </button>
              <button className="w-full px-4 py-3 text-left text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                Delete Account
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPortalSettings;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Lock, Share2, LogOut, Save } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Job Portal Settings Page
 */
const JobPortalSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      jobRecommendations: true,
      applicationUpdates: true,
      emailDigest: true,
      aiFeatures: true,
    },
    privacy: {
      profileVisibility: "public",
      showSkills: true,
      showExperience: true,
    },
  });

  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem("jobPortalSettings", JSON.stringify(settings));
    toast.success("Settings saved!");
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

          {/* Account */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-red-600" />
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Save size={20} />
              Save Changes
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

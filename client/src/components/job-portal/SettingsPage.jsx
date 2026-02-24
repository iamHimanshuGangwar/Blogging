import React, { useState } from "react";
import {
  ChevronLeft,
  Bell,
  Shield,
  Lock,
  Smartphone,
  Mail,
  Palette,
  Volume2,
  Eye,
  Download,
  Trash2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Settings & Preferences Page
 * Integrated with CommandCenterSidebar
 * Features:
 * - Notification preferences (Email, SMS, Push)
 * - Privacy settings
 * - Account security
 * - Theme preferences
 * - Data management
 */
const SettingsPage = ({ user = null, onBack = () => {} }) => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newJobAlerts: true,
    applicationUpdates: true,
    weeklyDigest: true,

    // Privacy
    profileVisibility: "public", // public, private, recruiters-only
    showApplicationHistory: true,
    allowContactFromEmployers: true,

    // Theme
    darkMode: false,
    compactView: false,

    // Sounds
    soundEnabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In production: POST to /api/settings/update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadData = () => {
    toast.success("Preparing your data export...");
    // In production: Generate and download user data as JSON/CSV
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure? This action cannot be undone. All your data will be permanently deleted."
      )
    ) {
      toast.error("Account deletion initiated");
      // In production: POST to /api/account/delete
    }
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Privacy", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings & Preferences
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your account and customize your experience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="card-glass rounded-lg overflow-hidden sticky top-20">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-medium text-left transition border-l-4 ${
                      activeTab === tab.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                        : "text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-3">
            <div className="card-glass rounded-lg p-6 space-y-6">
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Email & SMS Notifications
                    </h2>
                    <div className="space-y-4">
                      {/* Email Notifications */}
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={() =>
                            handleToggle("emailNotifications")
                          }
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mail size={18} />
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive updates via email
                          </p>
                        </div>
                      </label>

                      {/* SMS Notifications */}
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={() =>
                            handleToggle("smsNotifications")
                          }
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Smartphone size={18} />
                            Text (SMS) Notifications
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get alerts via WhatsApp/SMS
                          </p>
                        </div>
                      </label>

                      {/* Push Notifications */}
                      <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={() =>
                            handleToggle("pushNotifications")
                          }
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Browser and app notifications
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Alert Types */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      What notifications to send
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.newJobAlerts}
                          onChange={() => handleToggle("newJobAlerts")}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          New job matches based on my profile
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.applicationUpdates}
                          onChange={() =>
                            handleToggle("applicationUpdates")
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Updates on my job applications
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.weeklyDigest}
                          onChange={() => handleToggle("weeklyDigest")}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Weekly job digest (best matches)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Profile Privacy
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                          Profile Visibility
                        </label>
                        <select
                          value={settings.profileVisibility}
                          onChange={(e) =>
                            handleSelectChange("profileVisibility", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="public">
                            🌍 Public (visible to everyone)
                          </option>
                          <option value="recruiters-only">
                            👔 Recruiters Only
                          </option>
                          <option value="private">
                            🔒 Private (hidden)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Data Sharing */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Data Sharing
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.showApplicationHistory}
                          onChange={() =>
                            handleToggle("showApplicationHistory")
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Show my application history
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.allowContactFromEmployers}
                          onChange={() =>
                            handleToggle("allowContactFromEmployers")
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Allow employers to contact me directly
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Account Security
                    </h2>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-blue-900 dark:text-blue-200">
                              Change Password
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Update your password regularly
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-purple-900 dark:text-purple-200">
                              Two-Factor Authentication
                            </p>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                              Add extra security to your account
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Active Sessions
                    </h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p>You're currently signed in on:</p>
                      <ul className="mt-3 space-y-2">
                        <li className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span>💻 Chrome on macOS</span>
                          <button className="text-xs text-red-600 dark:text-red-400">
                            Sign Out
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Theme & Appearance
                    </h2>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button className="flex-1 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 transition text-center">
                          <span className="text-2xl">☀️</span>
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            Light
                          </p>
                        </button>
                        <button className="flex-1 p-4 border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                          <span className="text-2xl">🌙</span>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2">
                            Dark
                          </p>
                        </button>
                        <button className="flex-1 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 transition text-center">
                          <span className="text-2xl">🔄</span>
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            Auto
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Layout */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Layout
                    </h3>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.compactView}
                        onChange={() => handleToggle("compactView")}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Use compact view (reduced spacing)
                      </span>
                    </label>
                  </div>

                  {/* Sounds */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Sounds
                    </h3>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={() => handleToggle("soundEnabled")}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Volume2 size={16} />
                        Enable notification sounds
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === "data" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Data Export & Deletion
                    </h2>
                    <div className="space-y-3">
                      {/* Export Data */}
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-900 dark:text-green-200 flex items-center gap-2">
                              <Download size={18} />
                              Export Your Data
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                              Download all your data as JSON/CSV
                            </p>
                          </div>
                          <button
                            onClick={handleDownloadData}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                          >
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Delete Account */}
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-red-900 dark:text-red-200 flex items-center gap-2">
                              <Trash2 size={18} />
                              Delete Account
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                              Permanently delete your account and data
                            </p>
                          </div>
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Policy */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By using our platform, you agree to our{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={onBack}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

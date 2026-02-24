import React from "react";
import { useAppContext } from "../context/AppContext";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const { user, setUser, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {user?.name || "User"}
        </h3>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleSettings}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-medium"
        >
          <Settings size={18} />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;

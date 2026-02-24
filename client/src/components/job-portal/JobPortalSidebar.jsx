import React from "react";
import {
  Briefcase,
  CheckSquare,
  FileText,
  Plus,
  Settings,
  Home,
  ChevronRight,
} from "lucide-react";

/**
 * Job Portal Sidebar Navigation
 * Shows menu items for job portal features
 */
const JobPortalSidebar = ({
  activeMenu,
  onMenuClick,
  applicationCount = 0,
  resumeCount = 0,
}) => {
  const menuItems = [
    {
      id: "feed",
      label: "Job Feed",
      icon: Home,
      badge: null,
      description: "Browse and discover jobs",
    },
    {
      id: "applications",
      label: "My Applications",
      icon: CheckSquare,
      badge: applicationCount > 0 ? applicationCount : null,
      description: "View your applications",
    },
    {
      id: "resumes",
      label: "Resume Manager",
      icon: FileText,
      badge: resumeCount > 0 ? resumeCount : null,
      description: "Manage your resumes",
    },
    {
      id: "post",
      label: "Post a Vacancy",
      icon: Plus,
      badge: null,
      description: "Post a new job",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
      description: "Manage preferences",
    },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
              isActive
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} className={isActive ? "text-white" : ""} />
              <div className="text-left">
                <p className="font-semibold text-sm">{item.label}</p>
                <p
                  className={`text-xs ${
                    isActive
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-blue-400 text-white"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
              <ChevronRight
                size={18}
                className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition ${
                  isActive ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default JobPortalSidebar;

import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Sticky Notification Header Component
 * Displays notifications at the top of the job portal
 * with sticky positioning
 */
const StickyNotificationHeader = ({ notifications = [] }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setVisibleNotifications(notifications.slice(0, 2)); // Show first 2 notifications
      setNewNotifications(notifications.length);
    }
  }, [notifications]);

  const removeNotification = (index) => {
    setVisibleNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="sticky top-0 z-40 space-y-2 px-4 sm:px-6 lg:px-8 pt-3">
      {/* Notification Bell Icon with Unread Badge */}
      {newNotifications > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {newNotifications}
            </span>
          </div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            You have {newNotifications} new notification{newNotifications !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Notifications List */}
      {visibleNotifications.map((notification, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getNotificationColor(
            notification.type || "info"
          )} animate-fadeIn`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon(notification.type || "info")}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {notification.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">
              {notification.message}
            </p>

            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {notification.action.label} →
              </button>
            )}
          </div>

          <button
            onClick={() => removeNotification(index)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default StickyNotificationHeader;

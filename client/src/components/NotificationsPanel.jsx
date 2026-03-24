import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, Briefcase, Bell, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";
import "./NotificationsPanel.css";

/**
 * NotificationsPanel Component
 * Displays real-time job alerts and notifications
 * Features:
 * - Badge showing unread count
 * - Dismissible notifications
 * - Notification types (job, alert, application)
 * - Auto-dismiss after duration
 * - Mark as read functionality
 */
const NotificationsPanel = ({ isOpen = false, onClose = () => {} }) => {
  const {
    notifications,
    unreadCount,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [expandedNotifId, setExpandedNotifId] = useState(null);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "application":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "job":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "application":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "alert":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      {/* Notifications Panel */}
      {isOpen && (
        <div className="notifications-panel">
          {/* Panel Backdrop */}
          <div
            className="notifications-backdrop"
            onClick={onClose}
          />

          {/* Panel Content */}
          <div className="notifications-content">
            {/* Header */}
            <div className="notifications-header">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="notifications-actions">
                <button
                  onClick={markAllAsRead}
                  className="text-sm px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="notifications-empty">
                  <Bell className="w-12 h-12 text-gray-400 mb-3 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    We'll let you know when something important happens
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${
                      !notif.isRead ? "unread" : ""
                    } ${getNotificationBgColor(notif.type)} border rounded-lg p-4 cursor-pointer transition hover:shadow-md`}
                    onClick={() =>
                      setExpandedNotifId(
                        expandedNotifId === notif.id ? null : notif.id
                      )
                    }
                  >
                    {/* Main Content */}
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>

                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>

                        {/* Timestamp */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {formatTime(notif.timestamp)}
                        </p>

                        {/* Expanded Details */}
                        {expandedNotifId === notif.id && notif.data && (
                          <div className="mt-3 pt-3 border-t border-gray-300/20 text-sm">
                            {notif.type === "job" && notif.data && (
                              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                                <p>
                                  <strong>Company:</strong> {notif.data.company}
                                </p>
                                <p>
                                  <strong>Location:</strong>{" "}
                                  {notif.data.location}
                                </p>
                                {notif.data.salary && (
                                  <p>
                                    <strong>Salary:</strong> {notif.data.salary}
                                  </p>
                                )}
                                <button className="mt-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition">
                                  View Job
                                </button>
                              </div>
                            )}

                            {notif.type === "application" && (
                              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                                <p>
                                  <strong>Job:</strong>{" "}
                                  {notif.data.jobTitle}
                                </p>
                                <p>
                                  <strong>Company:</strong>{" "}
                                  {notif.data.company}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  <span className="capitalize text-green-600 dark:text-green-400">
                                    {notif.data.status}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsPanel;

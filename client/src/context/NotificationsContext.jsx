import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

/**
 * NotificationsContext
 * Manages global notifications for job alerts and updates
 * Now with backend integration for real notifications
 */
const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollingIntervalRef = useRef(null);

  /**
   * Fetch notifications from backend
   */
  const fetchRealNotifications = useCallback(async (axiosInstance = null) => {
    try {
      setLoading(true);
      
      if (!axiosInstance) {
        console.warn("No axios instance available for fetching notifications");
        return;
      }

      // Try to fetch from backend
      const response = await axiosInstance.get("/api/notifications", {
        timeout: 5000,
      }).catch(() => null);

      if (response?.data?.success && Array.isArray(response.data.notifications)) {
        const backendNotifications = response.data.notifications.map((notif) => ({
          id: notif._id || `notif-${Date.now()}`,
          type: notif.type || "alert",
          title: notif.title || "Notification",
          message: notif.message || "",
          data: notif.data || null,
          icon: notif.icon || "🔔",
          timestamp: new Date(notif.createdAt || Date.now()),
          isRead: notif.isRead || false,
          duration: notif.duration || 0,
        }));

        // Merge with existing local notifications
        setNotifications((prev) => {
          const merged = [...backendNotifications];
          // Add unread local notifications that aren't duplicates
          prev.forEach((local) => {
            if (
              !merged.some((backend) => backend.id === local.id)
            ) {
              merged.push(local);
            }
          });
          return merged.slice(0, 50); // Keep last 50 notifications
        });

        // Update unread count
        const unread = backendNotifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.debug("Error fetching real notifications:", error.message);
      // Continue with local notifications if backend fetch fails
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new notification
   * @param {Object} notification - Notification object
   * @param {string} notification.id - Unique identifier
   * @param {string} notification.type - Type: 'job', 'alert', 'application', 'message'
   * @param {string} notification.title - Notification title
   * @param {string} notification.message - Notification message
   * @param {Object} notification.data - Additional data (job details, etc.)
   * @param {string} notification.icon - Icon name/emoji
   * @param {number} notification.duration - Auto-dismiss duration (ms)
   */
  const addNotification = useCallback(
    (notification) => {
      const id = notification.id || `notif-${Date.now()}`;
      const newNotification = {
        id,
        type: notification.type || "alert",
        title: notification.title || "Notification",
        message: notification.message || "",
        data: notification.data || null,
        icon: notification.icon || "🔔",
        timestamp: new Date(),
        isRead: false,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Auto-dismiss if duration is set
      if (newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    []
  );

  /**
   * Remove a notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Mark all as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  /**
   * Add job alert notification
   */
  const addJobAlert = useCallback(
    (job, message = "") => {
      return addNotification({
        type: "job",
        title: job.title || "New Job Found",
        message:
          message || `${job.company} is hiring for ${job.title} in ${job.location}`,
        data: job,
        icon: "💼",
        duration: 0, // Keep until user dismisses
      });
    },
    [addNotification]
  );

  /**
   * Add application status notification
   */
  const addApplicationNotification = useCallback(
    (status, jobTitle, company) => {
      const statusConfig = {
        accepted: {
          title: "🎉 Application Accepted!",
          icon: "✅",
          message: `Great news! You've been accepted for ${jobTitle} at ${company}`,
        },
        rejected: {
          title: "Application Update",
          icon: "ℹ️",
          message: `Your application for ${jobTitle} at ${company} was not selected`,
        },
        reviewed: {
          title: "Application Reviewed",
          icon: "👀",
          message: `Your application for ${jobTitle} at ${company} has been reviewed`,
        },
        pending: {
          title: "Application Received",
          icon: "⏳",
          message: `Your application for ${jobTitle} at ${company} has been received`,
        },
      };

      const config = statusConfig[status] || statusConfig.pending;

      return addNotification({
        type: "application",
        title: config.title,
        message: config.message,
        icon: config.icon,
        data: { status, jobTitle, company },
        duration: 0,
      });
    },
    [addNotification]
  );

  /**
   * Add search alert notification
   */
  const addSearchAlert = useCallback(
    (searchQuery, resultsCount) => {
      return addNotification({
        type: "alert",
        title: `✨ Found ${resultsCount} jobs`,
        message: `Search results for "${searchQuery}"`,
        icon: "🔍",
        data: { searchQuery, resultsCount },
        duration: 4000,
      });
    },
    [addNotification]
  );

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    addJobAlert,
    addApplicationNotification,
    addSearchAlert,
    fetchRealNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

/**
 * Hook to use Notifications Context
 */
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

/**
 * Hook to setup notification polling from backend
 */
export const useNotificationPolling = (axiosInstance, interval = 30000) => {
  const { fetchRealNotifications } = useNotifications();
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    // Fetch immediately on mount
    fetchRealNotifications(axiosInstance);

    // Set up polling
    pollingIntervalRef.current = setInterval(() => {
      fetchRealNotifications(axiosInstance);
    }, interval);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [axiosInstance, interval, fetchRealNotifications]);
};

export default NotificationsContext;

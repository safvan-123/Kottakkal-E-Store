import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell, X, Check } from "lucide-react";

// const API_BASE_URL = "http://localhost:5050";
const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

const Notifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setNotifications(res.data);
    } catch (err) {
      setError(
        err.response?.status === 401 ? "Unauthorized" : "Failed to load"
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/notifications/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      setError("Could not mark as read.");
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n._id)));
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setError("Token missing.");
      setLoading(false);
    }
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-gray-200 shadow-2xl rounded-xl p-4 z-50 max-h-[26rem] overflow-y-auto animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              Notifications
            </h4>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark all
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-200 rounded w-full animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-sm">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`relative p-3 mb-2 rounded-lg cursor-pointer group transition-all ${
                  n.isRead
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500"
                }`}
              >
                <p
                  className="text-sm text-gray-800 font-medium truncate group-hover:text-blue-700"
                  title={n.message}
                >
                  {n.message}
                </p>
                <small className="text-xs text-gray-500 block mt-1">
                  {new Date(n.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </small>

                {!n.isRead && (
                  <span className="absolute top-2 right-3 bg-blue-400 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    New
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

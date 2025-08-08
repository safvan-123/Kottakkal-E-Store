// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Check } from "lucide-react";

// const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;
// // const API_BASE_URL = `http://localhost:5050`;
// const NotificationsPage = ({ token }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Cache-Control": "no-cache",
//         },
//       });
//       setNotifications(res.data);
//     } catch (err) {
//       setError(
//         err.response?.status === 401 ? "Unauthorized" : "Failed to load"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log(notifications);

//   const markAsRead = async (id) => {
//     try {
//       await axios.put(
//         `${API_BASE_URL}/api/notifications/${id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//       );
//     } catch {
//       setError("Could not mark as read.");
//     }
//   };

//   const markAllAsRead = async () => {
//     const unread = notifications.filter((n) => !n.isRead);
//     await Promise.all(unread.map((n) => markAsRead(n._id)));
//     await fetchNotifications();
//   };

//   useEffect(() => {
//     if (token) {
//       fetchNotifications();
//     } else {
//       setNotifications([]);
//       setError("Token missing.");
//       setLoading(false);
//     }
//   }, [token]);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8 w-full min-h-screen overflow-x-hidden">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
//         {unreadCount > 0 && (
//           <button
//             onClick={markAllAsRead}
//             className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
//           >
//             <Check className="w-4 h-4" />
//             Mark all as read
//           </button>
//         )}
//       </div>

//       {loading ? (
//         <div className="space-y-3">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="h-5 bg-gray-200 rounded w-full animate-pulse"
//             />
//           ))}
//         </div>
//       ) : error ? (
//         <p className="text-red-500 text-sm">{error}</p>
//       ) : notifications.length === 0 ? (
//         <p className="text-gray-500 italic">No notifications found.</p>
//       ) : (
//         <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
//           {notifications.map((n) => (
//             <div
//               key={n._id}
//               onClick={() => markAsRead(n._id)}
//               className={`relative p-4 rounded-lg cursor-pointer border transition ${
//                 n.isRead
//                   ? "bg-gray-50 hover:bg-gray-100"
//                   : "bg-blue-50 hover:bg-blue-100 border-blue-400"
//               }`}
//             >
//               <p
//                 style={{
//                   whiteSpace: "pre-line",
//                   lineHeight: "0.9",
//                   fontWeight: "normal",
//                   marginBottom: "9px",
//                 }}
//                 className="text-sm text-gray-800 font-medium break-words"
//                 title={n.message}
//               >
//                 {n.message}
//               </p>
//               <small className="text-xs text-gray-500 block mt-1 text-end">
//                 {new Date(n.createdAt).toLocaleString("en-US", {
//                   day: "2-digit",
//                   month: "short",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: true,
//                 })}
//               </small>
//               {!n.isRead && (
//                 <span className="absolute top-2 right-3 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
//                   New
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

const NotificationsPage = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        { headers: { Authorization: `Bearer ${token}` } }
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
    await fetchNotifications();
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setError("Token missing.");
      setLoading(false);
    }
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 w-full min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
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
        <p className="text-red-500 text-sm">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 italic">No notifications found.</p>
      ) : (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`relative p-3 sm:p-4 rounded-lg cursor-pointer border transition break-words max-w-full ${
                n.isRead
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-blue-50 hover:bg-blue-100 border-blue-400"
              }`}
            >
              <p
                style={{ whiteSpace: "pre-line", lineHeight: "1.2" }}
                className="text-xs sm:text-sm text-gray-800 font-medium mb-2 break-words"
                title={n.message}
              >
                {n.message}
              </p>
              <small className="text-[10px] sm:text-xs text-gray-500 block mt-1 text-end">
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
                <span className="absolute top-2 right-2 sm:right-3 bg-blue-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

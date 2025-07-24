import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

function NotificationBell({ unreadCount }) {
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <Link
      to="/notifications"
      className="relative px-1 py-1 text-gray-700 hover:bg-gray-100 transition"
      aria-label={`You have ${unreadCount} notifications`}
    >
      <FontAwesomeIcon icon={faBell} className="text-2xl" />

      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded px-1 leading-none shadow"
          aria-label={`${unreadCount} unread notifications`}
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;

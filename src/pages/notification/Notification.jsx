import { useState } from "react";
import {
  MdEvent,
  MdCheckCircleOutline,
  MdGroup,
  MdCampaign,
  MdChatBubbleOutline,
  MdStarOutline,
  MdDoneAll,
} from "react-icons/md";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Go Concurrency Workshop starts in 2 days",
    description:
      "Don't forget — your registered event is on Aug 20 at 09:00 in Bandung.",
    time: "2h ago",
    read: false,
    iconBg: "bg-amber-100 text-amber-600",
    Icon: MdEvent,
  },
  {
    id: 2,
    title: "Registration confirmed",
    description:
      "You're registered for Indonesia Tech Conference on Oct 12, 2026.",
    time: "2h ago",
    read: false,
    iconBg: "bg-emerald-100 text-emerald-600",
    Icon: MdCheckCircleOutline,
  },
  {
    id: 3,
    title: "New event in Bandung Go Community",
    description:
      "Rizky posted 'Advanced Go Microservices Workshop' — happening Sep 15.",
    time: "3h ago",
    read: false,
    iconBg: "bg-blue-100 text-blue-600",
    Icon: MdGroup,
  },
  {
    id: 4,
    title: "Update: AI Product Design Summit",
    description:
      "New speaker added: Kevin Lin from Google, updated schedule posted.",
    time: "2d ago",
    read: true,
    iconBg: "bg-rose-100 text-rose-600",
    Icon: MdCampaign,
  },
  {
    id: 5,
    title: "Reply to your discussion",
    description:
      "Ahmad Fauzan replied to your question in Go Concurrency Workshop.",
    time: "3d ago",
    read: true,
    iconBg: "bg-purple-100 text-purple-600",
    Icon: MdChatBubbleOutline,
  },
  {
    id: 6,
    title: "Jakarta AI & ML Club: Member milestone",
    description:
      "Your community just hit 2,000 members! Thanks for being part of it.",
    time: "4d ago",
    read: true,
    iconBg: "bg-indigo-100 text-indigo-600",
    Icon: MdStarOutline,
  },
  {
    id: 7,
    title: "Product Management Masterclass — 1 week away",
    description: "Your saved event is on Sep 25 at 19:00, Online.",
    time: "5d ago",
    read: true,
    iconBg: "bg-amber-100 text-amber-600",
    Icon: MdEvent,
  },
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-jakarta font-bold text-2xl text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="w-6 h-6 bg-[#ff5722] text-white rounded-full flex items-center justify-center font-inter font-bold text-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-1">
              Stay up to date with your events and communities.
            </p>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 dark:border-gray-700 rounded-xl font-inter font-medium text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <MdDoneAll className="text-base text-gray-500 dark:text-gray-400" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-xl font-inter text-xs font-semibold transition cursor-pointer ${
              filter === "all"
                ? "bg-[#ff5722] text-white shadow-xs"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-4 py-1.5 rounded-xl font-inter text-xs font-semibold transition cursor-pointer ${
              filter === "unread"
                ? "bg-[#ff5722] text-white shadow-xs"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications Card List Wrapper */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-400 dark:text-gray-500 font-inter text-sm">
              No notifications here right now.
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const ItemIcon = item.Icon;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleReadStatus(item.id)}
                  className={`p-4 sm:p-5 flex gap-4 transition cursor-pointer relative items-start hover:bg-gray-50/80 dark:hover:bg-gray-800/60 ${
                    !item.read
                      ? "bg-orange-50/20 dark:bg-orange-950/20"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    <ItemIcon className="text-xl" />
                  </div>

                  {/* Body Content */}
                  <div className="grow min-w-0 pr-6">
                    <p className="font-inter font-bold text-sm text-gray-900 dark:text-white leading-snug">
                      {item.title}
                    </p>
                    <p className="font-inter text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Time and Unread Dot */}
                  <div className="flex items-center gap-2 shrink-0 self-start mt-0.5">
                    <span className="font-inter text-xs text-gray-400 dark:text-gray-500">
                      {item.time}
                    </span>
                    {!item.read && (
                      <span className="w-2.5 h-2.5 bg-[#ff5722] rounded-full"></span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;

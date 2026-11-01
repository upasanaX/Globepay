import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Check, CheckCheck, Trash2, Filter, Search,
} from "lucide-react";
import { notifications as initialNotifications, Notification } from "../data/mockData";

const typeColors: Record<string, string> = {
  transfer: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  security: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  promo: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  alert: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  system: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const NotificationsPage: React.FC = () => {
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const filters = ["all", "transfer", "security", "promo", "alert", "system"];

  const filtered = items
    .filter((n) => filter === "all" || n.type === filter)
    .filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-semibold bg-brand-500 text-white px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Stay up to date with your account activity.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-secondary flex items-center gap-2 w-fit text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field !pl-11"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No notifications found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your filters
              </p>
            </motion.div>
          ) : (
            filtered.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card p-4 flex items-start gap-4 group hover:shadow-lg transition-all cursor-pointer ${
                  !notif.read
                    ? "border-l-4 !border-l-brand-500"
                    : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    typeColors[notif.type] || ""
                  }`}
                >
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          notif.read
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {notif.time}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        typeColors[notif.type] || ""
                      }`}
                    >
                      {notif.type}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(notif.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    title={notif.read ? "Mark unread" : "Mark read"}
                  >
                    <Check className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(notif.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;

import React from "react";
import { motion } from "framer-motion";
import { Menu, Bell, Moon, Sun, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { GlobePayMark } from "../common/GlobePayLogo";

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, title }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const avatar = user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : "GP");

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-surface-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <Link to="/dashboard" className="lg:hidden">
            <GlobePayMark size={32} />
          </Link>
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {title}
            </motion.h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 rounded-xl px-4 py-2 gap-2 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>

          {/* Notifications */}
          <Link to="/notifications">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </motion.button>
          </Link>

          {/* Avatar */}
          <Link
            to="/profile"
            className="ml-2 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-md transition-shadow"
            title={user?.name || "Profile"}
          >
            {avatar}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

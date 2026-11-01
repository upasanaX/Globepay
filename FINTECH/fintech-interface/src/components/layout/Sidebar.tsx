import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Send, QrCode, User, Settings, CreditCard,
  ArrowLeftRight, Globe, X, Bell, Receipt, Target,
  FileText, Gift, LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import GlobePayLogo from "../common/GlobePayLogo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/send", label: "Send Money", icon: Send },
  { path: "/scanner", label: "QR Scanner", icon: QrCode },
  { path: "/convert", label: "Convert", icon: ArrowLeftRight },
  { path: "/cards", label: "Cards", icon: CreditCard },
  { path: "/transactions", label: "Transactions", icon: Receipt },
  { path: "/savings", label: "Savings Goals", icon: Target },
  { path: "/bills", label: "Global Bills", icon: FileText },
  { path: "/rewards", label: "Rewards", icon: Gift },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-surface-800 border-r border-gray-200 dark:border-white/10 z-50 
          flex flex-col transition-transform duration-300 lg:translate-x-0 shadow-lg dark:shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link to="/" onClick={onClose}>
            <GlobePayLogo size="md" showTagline={false} />
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.avatar || "GP"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

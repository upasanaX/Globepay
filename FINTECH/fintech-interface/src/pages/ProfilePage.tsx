import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Shield, Bell, Moon, Sun,
  Globe, Lock, Fingerprint, CreditCard, ChevronRight,
  Camera, LogOut, Check, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { usersAPI, authAPI } from "../services/api";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");

  // Profile edit state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const updated = await usersAPI.updateProfile({ name, phone, location });
      updateUser(updated);
      setSaveStatus("Profile saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setPwSuccess("Password changed successfully! Redirecting to login...");
      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setPwError(err.response?.data?.error || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "settings" as const, label: "Settings", icon: Shield },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Account</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile and preferences.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : "GP")}
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </button>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-surface-800 rounded-full" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "GlobePay User"}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email || "user@globepay.com"}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified
              </span>
              <span className="text-xs font-medium bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-0.5 rounded-full">
                Standard Member
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <form onSubmit={handleSaveProfile} className="glass-card p-6 space-y-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            {saveStatus && (
              <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${saveStatus.includes("success") ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                {saveStatus.includes("success") ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {saveStatus}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="input-field text-sm bg-gray-100 dark:bg-white/5 cursor-not-allowed opacity-75"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="input-field text-sm"
                />
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="btn-primary text-sm flex items-center gap-2">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Linked Payment Methods */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
            {[
              { name: "Visa •••• 4242", type: "Primary", icon: "💳" },
              { name: "Bank Transfer", type: "Connected", icon: "🏦" },
            ].map((method) => (
              <div key={method.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{method.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{method.type}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-6 space-y-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">General</h3>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  {isDark ? <Moon className="w-4 h-4 text-gray-400" /> : <Sun className="w-4 h-4 text-gray-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Theme</p>
                  <p className="text-xs text-gray-500">{isDark ? "Dark theme active" : "Light theme active"}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? "bg-brand-500" : "bg-gray-300"}`}
              >
                <div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                  style={{ transform: isDark ? "translateX(24px)" : "translateX(0px)" }}
                />
              </button>
            </div>
          </div>

          <div className="glass-card p-6 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Security</h3>
            <div
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Change Password</p>
                  <p className="text-xs text-gray-500">Update your account credentials</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/5 font-medium text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-card p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h3>
            {pwError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-lg">{pwError}</p>}
            {pwSuccess && <p className="text-sm text-green-500 bg-green-50 dark:bg-green-500/10 p-2.5 rounded-lg">{pwSuccess}</p>}
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">New Password (min 8 chars, 1 uppercase, 1 number)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-secondary flex-1 text-sm !py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 text-sm !py-2">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

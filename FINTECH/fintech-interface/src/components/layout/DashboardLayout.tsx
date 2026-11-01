import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageTransition from "./PageTransition";
import ChatWidget from "../ui/ChatWidget";

interface DashboardLayoutProps {
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72 min-h-screen flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 lg:p-8 relative z-10">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;

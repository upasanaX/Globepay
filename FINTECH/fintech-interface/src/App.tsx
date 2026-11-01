import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SendMoneyPage from "./pages/SendMoneyPage";
import QRScannerPage from "./pages/QRScannerPage";
import ConvertPage from "./pages/ConvertPage";
import ProfilePage from "./pages/ProfilePage";
import CardsPage from "./pages/CardsPage";
import NotificationsPage from "./pages/NotificationsPage";
import TransactionsPage from "./pages/TransactionsPage";
import SavingsGoalsPage from "./pages/SavingsGoalsPage";
import BillPaymentsPage from "./pages/BillPaymentsPage";
import RewardsPage from "./pages/RewardsPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page — standalone layout */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* App Pages — protected dashboard layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/send" element={<SendMoneyPage />} />
              <Route path="/scanner" element={<QRScannerPage />} />
              <Route path="/convert" element={<ConvertPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/savings" element={<SavingsGoalsPage />} />
              <Route path="/bills" element={<BillPaymentsPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<ProfilePage />} />
            </Route>

            {/* Catch-all — redirect unknown routes to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

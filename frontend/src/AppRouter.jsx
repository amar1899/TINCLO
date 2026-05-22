import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import RecruiterDashboard from "./components/RecruiterDashboard";
import AnalyticsPage from "./components/AnalyticsPage";
import { App } from "./App";

// Redirect admins away from regular-user routes
const UserOnlyRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('tinclo_current_user') || 'null');
  const isAdmin =
    currentUser?.role === 'admin' ||
    localStorage.getItem('tinclo_admin_session') === 'true';
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

const AppRouter = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/"            element={<LandingPage />} />
      <Route path="/signup"      element={<SignupPage />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/jobs"        element={<UserOnlyRoute><App /></UserOnlyRoute>} />
      <Route path="/profile"     element={<UserOnlyRoute><ProfilePage /></UserOnlyRoute>} />
      <Route path="/recruiter"   element={<UserOnlyRoute><RecruiterDashboard /></UserOnlyRoute>} />
      <Route path="/analytics"   element={<UserOnlyRoute><AnalyticsPage /></UserOnlyRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin"       element={<AdminRoute><AdminPanel /></AdminRoute>} />
    </Routes>
  </Router>
);

export default AppRouter;

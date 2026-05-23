import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import { App } from "./App";

const AppRouter = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/jobs" element={<App />} />
    </Routes>
  </Router>
);

export default AppRouter;

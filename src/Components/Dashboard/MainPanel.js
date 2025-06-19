import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardHome from "../Pages/DashboardHome";
import CalendarPage from "../Pages/CalenderPage";
import StreakPage from "../Pages/StreakPage";
import ProfilePage from "../Pages/ProfilePage";
import SettingsPage from "../Pages/SettingPage";
import Journal from "../Pages/Journal"; 


function MainPanel({ theme }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        minHeight: "100vh", // ✅ Ensures scrolling within MainPanel
        backgroundColor: theme.background,
        color: theme.text,
        boxSizing: "border-box",
      }}
    >
      <Routes>
        <Route path="/" element={<DashboardHome theme={theme} />} />
        <Route path="/calendar" element={<CalendarPage theme={theme} />} />
        <Route path="/streak" element={<StreakPage theme={theme} />} />
        <Route path="/profile" element={<ProfilePage theme={theme} />} />
        <Route path="/journal" element={<Journal theme={theme} />} /> {/* ✅ Add this */}
        <Route path="/settings" element={<SettingsPage theme={theme} />} />
      </Routes>
    </div>
  );
}

export default MainPanel;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./Components/Register";
import LoginPage from "./Components/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import Journal from "./Components/Pages/Journal";
import ProtectedRoute from "./Components/Auth/ProtectedRoute"; // ✅ New import

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const theme = {
    bg: darkMode ? "#121212" : "#f2f2f2",
    card: darkMode ? "#1e1e1e" : "#ffffff",
    text: darkMode ? "#ffffff" : "#000000",
    sidebar: darkMode ? "#1e1e1e" : "#f9f9f9",
    border: darkMode ? "#444" : "#ccc",
    accent: "#00BFFF",
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/journal" element={<Journal theme={theme} />} />

        {/* ✅ Protected Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard
                theme={theme}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

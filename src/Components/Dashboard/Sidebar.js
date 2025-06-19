import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ theme }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const styles = {
    container: {
      width: collapsed ? "70px" : "220px",
      background: theme.sidebar,
      color: theme.text,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      borderRight: `1px solid ${theme.border}`,
    },
    content: {
      flex: 1,
      padding: "20px 10px",
      overflowY: "auto",
    },
    toggleBtn: {
      alignSelf: collapsed ? "center" : "flex-end",
      background: theme.accent,
      border: "none",
      borderRadius: "8px",
      width: "36px",
      height: "36px",
      color: "#fff",
      fontSize: "18px",
      cursor: "pointer",
      marginBottom: "24px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease",
    },
    profile: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "28px",
      opacity: collapsed ? 0 : 1,
      transition: "opacity 0.3s ease",
    },
    avatar: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      backgroundColor: theme.accent,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#fff",
    },
    nameBlock: {
      display: collapsed ? "none" : "block",
    },
    link: {
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      color: theme.text,
      textDecoration: "none",
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "15px",
      fontWeight: 500,
      transition: "background 0.2s, transform 0.2s",
    },
    activeLink: {
      backgroundColor: theme.accent,
      color: "#fff",
    },
    icon: {
      fontSize: "18px",
    },
    footer: {
      padding: "12px 10px",
      textAlign: "center",
      fontSize: "20px",
      color: "#ffffff", // ⬅️ Now white text
      borderTop: `1px solid ${theme.border}`,
      opacity: 0.9,
    },

  };

  const navItems = [
    { to: "/dashboard", icon: "🏠", label: "Home" },
    { to: "/dashboard/calendar", icon: "📅", label: "Calendar" },
    { to: "/dashboard/streak", icon: "🔥", label: "Streak" },
    { to: "/dashboard/profile", icon: "👤", label: "Profile" },
    { to: "/dashboard/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button onClick={toggleSidebar} style={styles.toggleBtn} title="Toggle Sidebar">
          {collapsed ? "☰" : "←"}
        </button>

        <div style={styles.profile}>
          <div style={styles.avatar}>A</div>
          <div style={styles.nameBlock}>
            <div style={{ fontWeight: "bold", fontSize: "15px" }}>Abdul Khan</div>
            <div style={{ fontSize: "12px", color: theme.border }}>Member</div>
          </div>
        </div>

        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            <span style={styles.icon}>{icon}</span>
            {!collapsed && label}
          </NavLink>
        ))}
      </div>

      {/* Footer always visible at bottom */}
      <div style={styles.footer}>
        {collapsed ? "💪" : "Never Give Up 💪"}
      </div>
    </div>
  );
}

export default Sidebar;

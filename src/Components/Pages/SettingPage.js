import React, { useState, useContext, useEffect } from "react";
import ThemeContext from "../../ThemeContext";

function Settings() {
  const { darkMode, theme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("notifications") === "false" ? false : true;
  });

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  const handleNotificationToggle = () => {
    setNotifications((prev) => !prev);
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      alert("✅ Progress reset!");
    }
  };

  const currentStyles = {
    backgroundColor: theme.background,
    color: theme.text,
  };

  const cardStyle = {
    backgroundColor: theme.card,
    border: `2px solid ${theme.border}`,
    borderRadius: "12px",
    padding: "15px 20px",
  };

  const infoBoxStyle = {
    backgroundColor: darkMode ? "#262626" : "#f8f8f8",
    color: darkMode ? "#ccc" : "#333",
  };

  return (
    <div style={{ ...styles.container, ...currentStyles }}>
      <h2 style={styles.heading}>⚙️ App Settings</h2>

      <div style={styles.section}>
        <div style={{ ...styles.settingItem, ...cardStyle }}>
          <span><strong>Notifications:</strong></span>
          <button onClick={handleNotificationToggle} style={styles.button}>
            {notifications ? "🔔 On" : "🔕 Off"}
          </button>
        </div>

        <div style={{ ...styles.settingItem, ...cardStyle }}>
          <span><strong>Reset Progress:</strong></span>
          <button onClick={handleResetProgress} style={styles.resetButton}>
            ♻️ Reset
          </button>
        </div>

        <div style={{ ...styles.infoBox, ...infoBoxStyle }}>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Support:</strong> support@nofapapp.com</p>
          <p><strong>Upcoming Features:</strong> Export Data, Privacy Controls</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "25px",
    borderBottom: "2px solid #888",
    paddingBottom: "10px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  resetButton: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  infoBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "10px",
    fontSize: "16px",
    lineHeight: "1.8",
  },
};

export default Settings;

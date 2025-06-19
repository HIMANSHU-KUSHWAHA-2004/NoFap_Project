import React from "react";

function Topbar({ darkMode, toggleTheme }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: darkMode ? "#1f1f1f" : "#fff",
        borderBottom: darkMode ? "1px solid #333" : "1px solid #ccc",
      }}
    >
      <h3 style={{ color: darkMode ? "#fff" : "#000" }}>Welcome 💪</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 14px",
            backgroundColor: "#00BFFF",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            backgroundColor: "#FF6347",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

        <img
          src="https://i.pravatar.cc/35"
          alt="profile"
          style={{ borderRadius: "50%" }}
        />
      </div>
    </div>
  );
}

export default Topbar;

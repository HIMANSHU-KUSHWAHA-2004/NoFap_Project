import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MainPanel from "./MainPanel";

function Dashboard({ theme, darkMode, toggleTheme }) {
  const styles = {
    display: "flex",
    height: "100vh", // ✅ Make layout full height
    overflow: "hidden", // ✅ Prevent scroll on body
    backgroundColor: theme.bg,
    color: theme.text,
    transition: "all 0.3s ease",
  };

  return (
    <div style={styles}>
      <Sidebar theme={theme} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <Topbar theme={theme} darkMode={darkMode} toggleTheme={toggleTheme} />

        <div style={{ flex: 1, overflowY: "auto" }}>
          <MainPanel theme={theme} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

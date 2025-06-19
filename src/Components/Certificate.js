import React from "react";

function CertificateModal({ visible, onClose, streak, theme, user = "Abdul Khan" }) {
  if (!visible) return null;

  const milestoneTitles = {
    1: "Beginner 🟢",
    7: "Explorer 🌱",
    14: "Achiever 🚀",
    30: "Warrior ⚔️",
    60: "Champion 👑",
    90: "Legend 🐉",
  };

  const milestone = milestoneTitles[streak];

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: theme.bg,
        color: theme.text,
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        textAlign: "center",
        width: "80%",
        maxWidth: "500px"
      }}>
        <h2>🎉 Congratulations!</h2>
        <p>You have reached the</p>
        <h3 style={{ color: theme.accent }}>{milestone} Milestone</h3>
        <p>Here is your certificate of achievement:</p>

        <div style={{
          border: `3px solid ${theme.accent}`,
          margin: "20px 0",
          padding: "20px",
          borderRadius: "12px",
          background: theme.sidebar,
        }}>
          <h3>📜 Certificate of Excellence</h3>
          <p>This is proudly awarded to</p>
          <h2>{user}</h2>
          <p>For completing <strong>{streak} days</strong> of NoFap!</p>
          <p style={{ fontSize: "12px", marginTop: "12px" }}>{new Date().toLocaleDateString()}</p>
        </div>

        <button onClick={onClose} style={{
          background: theme.accent,
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "12px"
        }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CertificateModal;

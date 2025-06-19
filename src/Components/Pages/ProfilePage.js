import React, { useState } from "react";
import { FaSave, FaSignOutAlt } from "react-icons/fa";

function Profile({ theme, darkMode }) {
  const registeredUser = {
    username: "abdul123",
    firstName: "Abdul",
    lastName: "Khan",
    email: "abdul@example.com",
    dob: "2001-01-01",
    achievements: 5,
    longestStreak: 25,
  };

  const [formData, setFormData] = useState({ ...registeredUser });
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    alert("✅ Profile saved successfully!");
  };

  const handleLogout = () => {
    alert("👋 Logged out!");
  };

  return (
    <div style={{ ...styles.container, background: theme.background, color: theme.text }}>
      <h2 style={styles.heading}>👤 Your Profile</h2>

      <div style={styles.profileSection}>
        <div style={styles.imageWrapper}>
          <img
            src={previewUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            style={styles.profileImage}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div style={styles.details}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{ ...styles.input, background: theme.card, color: theme.text }}
            />
          </label>

          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={{ ...styles.input, background: theme.card, color: theme.text }}
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={{ ...styles.input, background: theme.card, color: theme.text }}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, background: theme.card, color: theme.text }}
            />
          </label>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: theme.card,
              color: theme.text,
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
            }}
          />

          <label>
            Achievements:
            <input
              type="number"
              value={formData.achievements}
              disabled
              style={{ ...styles.input, background: theme.card, color: theme.text,cursor : "not-allowed" }}
            />
          </label>

          <label>
            Longest Streak:
            <input
              type="number"
              value={formData.longestStreak}
              disabled
              style={{...styles.input, background: theme.card, color: theme.text, cursor: "not-allowed" }}
            />
          </label>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={handleSave} style={styles.saveBtn}>
          <FaSave /> Save
        </button>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "34px",
    marginBottom: "25px",
    borderBottom: "2px solid #888",
    paddingBottom: "10px",
  },
  profileSection: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  profileImage: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    border: "3px solid #777",
    objectFit: "cover",
  },
  details: {
    display: "grid",
    gap: "18px",
    flex: "1",
    minWidth: "280px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #999",
    marginTop: "6px",
    fontSize: "17px",
  },
  buttonGroup: {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    fontSize: "17px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logoutBtn: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    fontSize: "17px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Profile;

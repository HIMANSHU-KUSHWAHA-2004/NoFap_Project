import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [darkMode, setDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Registration successful!");
        console.log("Registered user:", data);
      } else {
        alert(`❌ Registration failed: ${data.detail}`);
      }
    } catch (error) {
      alert("⚠️ Server error!");
      console.error("Registration error:", error);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const theme = {
    background: darkMode ? "#121212" : "#f2f2f2",
    card: darkMode ? "#1e1e1e" : "#ffffff",
    text: darkMode ? "#ffffff" : "#000000",
    inputBackground: darkMode ? "#2a2a2a" : "#f9f9f9",
    border: darkMode ? "#444" : "#ccc",
    buttonBackground: "#00BFFF",
    linkColor: "#00BFFF",
  };

  return (
    <div style={{ ...styles.wrapper, backgroundColor: theme.background }}>
      <div style={styles.themeToggle}>
        <div style={styles.switchLabel}>{darkMode ? "🌙" : "🌞"}</div>
        <div
          style={{
            ...styles.switchOuter,
            backgroundColor: darkMode ? "#00BFFF" : "#ccc",
          }}
          onClick={toggleTheme}
        >
          <div
            style={{
              ...styles.switchCircle,
              transform: darkMode ? "translateX(26px)" : "translateX(2px)",
              backgroundColor: darkMode ? "#fff" : "#000",
            }}
          ></div>
        </div>
      </div>

      <div
        style={{
          ...styles.card,
          backgroundColor: theme.card,
          color: theme.text,
        }}
      >
        <h2 style={{ ...styles.title, color: theme.linkColor }}>Register</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.nameRow}>
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...styles.halfInput,
                backgroundColor: theme.inputBackground,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...styles.halfInput,
                backgroundColor: theme.inputBackground,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
              required
            />
          </div>

          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
            required
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: theme.buttonBackground,
            }}
          >
            Register
          </button>
        </form>
        <p style={{ ...styles.text, color: darkMode ? "#ccc" : "#333" }}>
          Already have an account?{" "}
          <Link to="/" style={{ ...styles.link, color: theme.linkColor }}>
            Login
          </Link>
          <br />
          <Link to="/dashboard" style={{ ...styles.link, color: theme.linkColor }}>
            Go to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    transition: "all 0.3s ease",
  },
  themeToggle: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 10,
  },
  switchLabel: {
    fontSize: "18px",
  },
  switchOuter: {
    width: "50px",
    height: "24px",
    borderRadius: "30px",
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  switchCircle: {
    position: "absolute",
    top: "2px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    transition: "transform 0.3s ease",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "30px 25px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
  title: {
    marginBottom: "30px",
    fontSize: "35px",
    fontWeight: "500",
    marginTop: "-5px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  text: {
    marginTop: "18px",
    fontSize: "14px",
    textAlign: "center",
  },
  link: {
    fontWeight: "bold",
    textDecoration: "none",
  },
  nameRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "nowrap",
  },
  halfInput: {
    width: "100%",
  },
};

export default Register;

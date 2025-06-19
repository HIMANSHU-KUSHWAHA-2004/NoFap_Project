import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,      // <-- Changed from username to email
        password,
      });

      localStorage.setItem("token", response.data.access_token);  // <-- Use access_token
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.detail) {
        if (typeof err.response.data.detail === "string") {
          setError(err.response.data.detail);
        } else if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail.map(e => e.msg || JSON.stringify(e)).join(", "));
        } else if (typeof err.response.data.detail === "object") {
          setError(JSON.stringify(err.response.data.detail));
        } else {
          setError("Login failed. Try again.");
        }
      } else {
        setError("Login failed. Try again.");
      }
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

      <div style={{ ...styles.card, backgroundColor: theme.card, color: theme.text }}>
        <h2 style={{ ...styles.title, color: theme.linkColor }}>🚀 NoFap Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              ...styles.input,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...styles.input,
              backgroundColor: theme.inputBackground,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
          />
          {error && (
            <div style={{ color: "red", textAlign: "center", fontSize: "14px" }}>{error}</div>
          )}
          <button type="submit" style={{ ...styles.button, backgroundColor: theme.buttonBackground }}>
            Login
          </button>
        </form>
        <p style={{ ...styles.text, color: darkMode ? "#ccc" : "#333" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ ...styles.link, color: theme.linkColor }}>Register</Link>
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
    maxWidth: "400px",
    padding: "30px 25px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
  title: {
    marginBottom: "24px",
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
};

export default Login;

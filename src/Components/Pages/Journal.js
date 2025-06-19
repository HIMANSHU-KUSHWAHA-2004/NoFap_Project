import React, { useState, useEffect } from "react";

function Journal({ theme }) {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(saved);
  }, []);

  const handleAddEntry = () => {
    if (entry.trim() === "") return;

    const newEntry = {
      text: entry,
      date: new Date().toLocaleString(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    setEntry("");
  };

  const handleDeleteEntry = (indexToDelete) => {
    const updated = entries.filter((_, i) => i !== indexToDelete);
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
  };

  const styles = getStyles(theme);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Journal</h2>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts, feelings, or experiences..."
        style={styles.textarea}
      ></textarea>

      <button onClick={handleAddEntry} style={styles.button}>
        ➕ Add Entry
      </button>

      <div style={styles.entries}>
        {entries.length === 0 ? (
          <p style={styles.empty}>No entries yet.</p>
        ) : (
          entries.map((e, idx) => (
            <div key={idx} style={styles.entryCard}>
              <div style={styles.entryDate}>{e.date}</div>
              <div style={styles.entryText}>{e.text}</div>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteEntry(idx)}
              >
                🗑️ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const getStyles = (theme) => ({
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
    color: theme.text,
    backgroundColor: theme.bg,
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    marginBottom: "16px",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    background: theme.card,
    color: theme.text,
    marginBottom: "10px",
    resize: "vertical",
  },
  button: {
    padding: "10px 18px",
    fontSize: "16px",
    backgroundColor: theme.accent,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "30px",
  },
  entries: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  entryCard: {
    background: theme.card,
    borderRadius: "10px",
    padding: "16px 20px",
    border: `2px solid ${theme.accent}`, // <- ADDED
    position: "relative",
  },
  entryDate: {
    fontSize: "13px",
    color: "#ffffff", // <- WHITE TEXT
    marginBottom: "8px",
    fontWeight: "bold",
  },
  entryText: {
    fontSize: "15px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    marginBottom: "8px",
  },
  deleteButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  empty: {
    fontStyle: "italic",
    color: theme.border,
  },
});


export default Journal;
import React, { useState, useEffect } from "react";

function DashboardHome({ theme }) {
  const [goal, setGoal] = useState(null);
  const [inputGoal, setInputGoal] = useState(30);
  const [editing, setEditing] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [streakRes, goalRes] = await Promise.all([
          fetch("http://localhost:8000/streak/current", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/user/goal", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const streakData = await streakRes.json();
        const goalData = await goalRes.json();

        setCurrentStreak(streakData.current_streak || 0);
        setLongestStreak(streakData.longest_streak || 0);
        setGoal(goalData.goal || null);
        setInputGoal(goalData.goal || 30);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();

    const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    setEntries(savedEntries);
  }, []);

  const handleSetGoal = async () => {
    if (inputGoal > 0 && inputGoal <= 999) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/user/goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ goal: inputGoal }),
        });

        if (!res.ok) throw new Error("Failed to update goal");
        setGoal(inputGoal);
        setEditing(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUnsetGoal = () => {
    setGoal(null);
    setInputGoal(30);
  };

  const progress = goal ? Math.min((currentStreak / goal) * 100, 100) : 0;
  const styles = getStyles(theme, progress);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏠 Dashboard Overview</h2>

      <div style={styles.cards}>
        {[
          { title: "🔥 Current Streak", value: `${currentStreak} Days` },
          { title: "🏆 Longest Streak", value: `${longestStreak} Days` },
          {
            title: "💡 Motivation",
            content: "“Discipline is the bridge between goals and accomplishment.”",
          },
        ].map((card, index) => (
          <div key={index} style={styles.card}>
            <h3>{card.title}</h3>
            <p style={styles.value}>{card.value || card.content}</p>
          </div>
        ))}

        <div style={styles.card}>
          <h3>🎯 Your Goal</h3>
          {!goal || editing ? (
            <>
              <input
                type="number"
                min={1}
                max={999}
                value={inputGoal}
                onChange={(e) => setInputGoal(parseInt(e.target.value))}
                style={styles.input}
              />
              <div style={styles.buttonRow}>
                <button onClick={handleSetGoal} style={styles.setGoalBtn}>
                  ✅ Set
                </button>
                {goal && (
                  <button onClick={() => setEditing(false)} style={styles.cancelBtn}>
                    ❌ Cancel
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: "18px", marginTop: "10px" }}>
                <strong>{goal} Days</strong>
              </p>
              <div style={styles.buttonRow}>
                <button onClick={() => setEditing(true)} style={styles.changeBtn}>
                  ✏️ Change
                </button>
                <button onClick={handleUnsetGoal} style={styles.cancelBtn}>
                  🗑️ Unset
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {goal && (
        <div style={styles.section}>
          <h3>📈 Progress to Goal</h3>
          <div style={styles.progressBarOuter}>
            <div style={styles.progressBarInner}></div>
          </div>
          <p style={styles.progressText}>
            {Math.floor(progress)}% of {goal} days completed
          </p>
        </div>
      )}

      <div style={styles.section}>
        <h3>📜 Quote of the Day</h3>
        <blockquote style={styles.quote}>
          “Success is nothing more than a few simple disciplines practiced every day.” – Jim Rohn
        </blockquote>
      </div>

      <div style={styles.section}>
        <h3>🧠 Quick Tips</h3>
        <ul style={styles.tips}>
          <li>Stay busy with a hobby.</li>
          <li>Avoid triggers – block harmful websites.</li>
          <li>Keep track of your streak daily.</li>
          <li>Exercise regularly – helps control urges.</li>
        </ul>
      </div>

      <div style={styles.section}>
        <button
          style={styles.journalButton}
          onClick={() => (window.location.href = "/dashboard/journal")}
        >
          📝 Add Journal Entry
        </button>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: theme.text }}>🗒️ Latest Journal Entries</h3>
          {entries.length === 0 ? (
            <p style={{ fontStyle: "italic", color: theme.border }}>
              No journal entries yet.
            </p>
          ) : (
            entries
              .slice(0, 3)
              .map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    background: theme.card,
                    border: `2px solid ${theme.accent}`,
                    padding: "16px 20px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#ffffff",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {entry.date}
                  </div>
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      color: theme.text,
                    }}
                  >
                    {entry.text.length > 100
                      ? entry.text.slice(0, 100) + "..."
                      : entry.text}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

const getStyles = (theme, progress) => ({
  container: {
    padding: "24px",
    color: theme.text,
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: "30px",
    marginBottom: "25px",
  },
  cards: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    marginBottom: "35px",
  },
  card: {
    background: theme.card,
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease",
  },
  value: {
    fontSize: "22px",
    fontWeight: "bold",
    color: theme.accent,
    marginTop: "10px",
  },
  input: {
    width: "90%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    background: theme.background,
    color: theme.text,
    marginBottom: "10px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  setGoalBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
  changeBtn: {
    background: "#ffc107",
    color: "#000",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
  cancelBtn: {
    background: "#dc3545",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
  section: {
    marginBottom: "32px",
    background: theme.card,
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  progressBarOuter: {
    height: "18px",
    borderRadius: "10px",
    backgroundColor: theme.border,
    overflow: "hidden",
    marginTop: "10px",
  },
  progressBarInner: {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: theme.accent,
    transition: "width 0.4s ease-in-out",
    borderRadius: "10px",
  },
  progressText: {
    marginTop: "8px",
    fontSize: "14px",
    color: theme.text,
  },
  quote: {
    fontStyle: "italic",
    background: theme.background,
    padding: "18px",
    borderLeft: `4px solid ${theme.accent}`,
    borderRadius: "8px",
    marginTop: "10px",
  },
  tips: {
    listStyle: "disc",
    paddingLeft: "20px",
    lineHeight: "1.8",
    fontSize: "15px",
  },
  journalButton: {
    background: theme.accent,
    color: "#fff",
    padding: "14px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
});

export default DashboardHome;

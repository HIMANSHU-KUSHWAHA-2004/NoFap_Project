import React, { useEffect, useState, useMemo, useCallback } from "react";

function Streak({ theme }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [unlockedCertificates, setUnlockedCertificates] = useState([]);
  const [latestMilestone, setLatestMilestone] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const levels = useMemo(
    () => [
      { day: 1, label: "Beginner 🟢" },
      { day: 7, label: "Explorer 🌱" },
      { day: 14, label: "Achiever 🚀" },
      { day: 30, label: "Warrior ⚔️" },
      { day: 60, label: "Champion 👑" },
      { day: 90, label: "Legend 🐉" },
    ],
    []
  );

  const unlockInBackend = useCallback(async (cert) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/streak/unlock_certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day: cert.day, label: cert.label }),
      });
      if (!response.ok) {
        console.error("❌ Failed to store unlocked certificate");
      }
    } catch (err) {
      console.error("❌ Error unlocking certificate:", err);
    }
  }, []);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/streak/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCurrentStreak(data.current_streak || 0);
        setLongestStreak(data.longest_streak || 0);
        setUnlockedCertificates(data.certificates || []);
      } catch (err) {
        console.error("Failed to fetch streak data:", err);
      }
    };

    fetchStreakData();
  }, []);

  useEffect(() => {
    const milestone = levels.find((level) => currentStreak === level.day);
    const alreadyUnlocked = unlockedCertificates.some((u) => u.day === currentStreak);

    if (milestone && !alreadyUnlocked) {
      setUnlockedCertificates((prev) => [...prev, milestone]);
      setLatestMilestone(milestone);
      setShowPopup(true);
      unlockInBackend(milestone);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🎉 Milestone Unlocked!", {
          body: `You unlocked ${milestone.label}!`,
        });
      }
    }
  }, [currentStreak, levels, unlockedCertificates, unlockInBackend]);

  const getLevel = (days) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (days >= levels[i].day) return levels[i].label;
    }
    return "Getting Started ⏳";
  };

  const handleDownload = (label) => {
    alert(`📜 Downloading certificate for ${label}`);
  };

  const generateCertData = (cert) => ({
    energy: cert.day * 3,
    time: cert.day * 15,
    clarity: cert.day * 2,
    willpower: (cert.day * 1.5).toFixed(1),
    motivation: cert.day * 4,
  });

  return (
    <div style={styles(theme).container}>
      <h2 style={styles(theme).heading}>🔥 Your NoFap Streak Progress</h2>

      {currentStreak === 0 && (
        <p style={{ color: 'red', fontSize: '18px', marginBottom: '10px' }}>
          ⚠️ You missed a day! Your streak has been reset.
        </p>
      )}

      <div style={styles(theme).statsGrid}>
        <Card title="📅 Current Streak" value={`${currentStreak} Days`} theme={theme} />
        <Card title="🏆 Longest Streak" value={`${longestStreak} Days`} theme={theme} />
        <Card
          title="📊 Weekly Success"
          custom={
            <div style={styles(theme).progressWrapper}>
              <div style={styles(theme).progressBarBackground}>
                <div
                  style={{
                    ...styles(theme).progressBarFill,
                    width: `${Math.min((currentStreak / 7) * 100, 100)}%`,
                    backgroundColor: theme.accent,
                  }}
                />
              </div>
              <p style={styles(theme).value}>
                {Math.min((currentStreak / 7) * 100, 100).toFixed(0)}%
              </p>
            </div>
          }
          theme={theme}
        />
        <Card title="📈 Your Level" value={getLevel(currentStreak)} theme={theme} />
      </div>

      <div style={styles(theme).levelProgress}>
        <h3 style={styles(theme).subheading}>🎯 Level Progression</h3>
        <div style={styles(theme).levelsRow}>
          {levels.map((level, i) => {
            const isUnlocked = currentStreak >= level.day;
            return (
              <div
                key={i}
                style={{
                  ...styles(theme).levelBox,
                  backgroundColor: isUnlocked ? theme.accent : theme.sidebar,
                  border: `2px solid ${isUnlocked ? "#fff" : theme.border}`,
                }}
                title={`${level.day} days → ${level.label}`}
              >
                <p style={styles(theme).levelText}>{level.label}</p>
                <small>{level.day} Days</small>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles(theme).certificates}>
        <h3 style={styles(theme).subheading}>📜 Certificates Unlocked</h3>
        <div style={styles(theme).certCardGrid}>
          {levels.map((cert) => {
            const isUnlocked = unlockedCertificates.some((c) => c.day === cert.day);
            const data = generateCertData(cert);

            return (
              <div
                key={cert.day}
                style={{
                  ...styles(theme).certCard,
                  opacity: isUnlocked ? 1 : 0.5,
                  border: isUnlocked
                    ? `2px solid ${theme.accent}`
                    : `2px dashed ${theme.border}`,
                }}
              >
                <h4>{cert.label}</h4>
                <p>📅 {cert.day} Days</p>
                <p>🔋 Energy Saved: {data.energy} Units</p>
                <p>⏳ Time Saved: {data.time} Minutes</p>
                <p>🧠 Mental Clarity: {data.clarity} pts</p>
                <p>💪 Willpower: {data.willpower} pts</p>
                <p>📈 Motivation Score: {data.motivation} XP</p>
                {isUnlocked ? (
                  <button
                    style={styles(theme).downloadBtn}
                    onClick={() => handleDownload(cert.label)}
                  >
                    Download Certificate
                  </button>
                ) : (
                  <p style={{ fontStyle: "italic", marginTop: "10px" }}>🔒 Locked</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showPopup && latestMilestone && (
        <div style={styles(theme).popupOverlay}>
          <div style={styles(theme).popupBox}>
            <h3>🎉 Congratulations!</h3>
            <p>
              You’ve unlocked the <strong>{latestMilestone.label}</strong> certificate.
            </p>
            <button
              style={styles(theme).downloadBtn}
              onClick={() => {
                handleDownload(latestMilestone.label);
                setShowPopup(false);
              }}
            >
              Download Certificate
            </button>
            <button
              style={{
                ...styles(theme).downloadBtn,
                marginTop: "10px",
                backgroundColor: "#555",
              }}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div style={styles(theme).footer}>
        <p>💡 <strong>Never give up</strong></p>
        <p>🧠 <em>"Progress is made one day at a time."</em></p>
      </div>
    </div>
  );
}

const Card = ({ title, value, custom, theme }) => (
  <div style={styles(theme).card}>
    <h3>{title}</h3>
    {custom || <p style={styles(theme).value}>{value}</p>}
  </div>
);

const styles = (theme) => ({
  container: {
    padding: "24px 32px",
    color: theme.text,
    backgroundColor: theme.bg,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "28px",
    fontWeight: 600,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: theme.sidebar,
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
  },
  value: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "12px",
  },
  progressWrapper: {
    marginTop: "10px",
  },
  progressBarBackground: {
    width: "100%",
    height: "12px",
    backgroundColor: theme.border,
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "6px",
    transition: "width 0.6s ease-in-out",
  },
  levelProgress: {
    marginTop: "20px",
    marginBottom: "40px",
  },
  subheading: {
    fontSize: "22px",
    marginBottom: "16px",
  },
  levelsRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },
  levelBox: {
    flex: "1 1 150px",
    padding: "14px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff",
    minWidth: "120px",
  },
  levelText: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "6px",
  },
  certificates: {
    marginBottom: "40px",
  },
  certCardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "flex-start",
  },
  certCard: {
    backgroundColor: theme.sidebar,
    padding: "14px",
    borderRadius: "12px",
    color: theme.text,
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    width: "220px",
    textAlign: "left",
  },
  downloadBtn: {
    marginTop: "12px",
    padding: "10px 16px",
    backgroundColor: theme.accent,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupBox: {
    backgroundColor: theme.sidebar,
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    color: theme.text,
  },
  footer: {
    textAlign: "center",
    fontSize: "30px",
    opacity: 0.75,
    marginTop: "auto",
    paddingTop: "30px",
  },
});

export default Streak;

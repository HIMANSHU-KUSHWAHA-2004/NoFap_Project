import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { getCalendarRecords, markDay } from "../../api/progress";

function CalenderPage({ theme, onStreakChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [clickTimeout, setClickTimeout] = useState(null);

  useEffect(() => {
    fetchMarkedDates();
  }, []);

  const fetchMarkedDates = async () => {
    try {
      const res = await getCalendarRecords();
      const transformed = {};
      res.data.forEach((record) => {
        transformed[record.date] = record.status === "nofap" ? "NoFap" : "Fap";
      });
      setMarkedDates(transformed);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleDateClick = (date) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      markSelectedDay(date, "fap");
    } else {
      const timeout = setTimeout(() => {
        markSelectedDay(date, "nofap");
        setClickTimeout(null);
      }, 250);
      setClickTimeout(timeout);
    }
  };

  const markSelectedDay = async (date, status) => {
    const key = formatDate(date);
    try {
      const res = await markDay({ date: key, status });
      setMarkedDates((prev) => ({
        ...prev,
        [key]: status === "nofap" ? "NoFap" : "Fap",
      }));

      if (onStreakChange && res.data.current_streak !== undefined) {
        onStreakChange(res.data.current_streak, res.data.longest_streak);
      }
    } catch (err) {
      console.error("Failed to mark day:", err);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    const key = formatDate(date);
    const type = markedDates[key];
    if (date.getMonth() !== activeStartDate.getMonth()) return "outside-month";
    if (type === "NoFap") return "nofap-tile";
    if (type === "Fap") return "fap-tile";
    return "";
  };

  const noFapCount = Object.values(markedDates).filter((v) => v === "NoFap").length;
  const fapCount = Object.values(markedDates).filter((v) => v === "Fap").length;

  const getMonthlyData = () => {
    const monthData = {};
    Object.keys(markedDates).forEach((dateStr) => {
      const [year, month] = dateStr.split("-");
      const key = `${year}-${month}`;
      if (!monthData[key]) {
        monthData[key] = { month: key, NoFap: 0, Fap: 0 };
      }
      const value = markedDates[dateStr];
      if (value === "NoFap") monthData[key].NoFap += 1;
      else if (value === "Fap") monthData[key].Fap += 1;
    });
    return Object.values(monthData).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );
  };

  const calendarThemeStyles = `
  .react-calendar {
    background-color: ${theme.card};
    color: ${theme.text};
    border-radius: 12px;
    border: 1px solid ${theme.border};
    padding: 10px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  .react-calendar__tile {
    background: transparent;
    color: ${theme.text};
    border: 1px solid ${theme.border};
    border-radius: 8px;
    margin: 8px;
    padding: 20px 0;
    font-size: 18px;
    text-align: center;
    transition: background-color 0.3s ease;
  }
  .react-calendar__tile--now {
    background: ${theme.accent}22;
  }
  .react-calendar__tile--active {
    background: ${theme.accent};
    color: #fff !important;
  }
  .react-calendar__tile:hover {
    background: ${theme.accent}22;
    color: ${theme.text} !important;
  }

  /* ✅ THIS is what ensures colors appear correctly */
  .nofap-tile {
    background-color: rgba(0, 255, 0, 0.4) !important;
    color: black !important;
    font-weight: 600;
  }
  .fap-tile {
    background-color: rgba(255, 0, 0, 0.4) !important;
    color: black !important;
    font-weight: 600;
  }

  .outside-month {
    color: ${theme.card} !important;
    background-color: ${theme.card} !important;
    pointer-events: none;
  }


    @media (max-width: 768px) {
      .react-calendar {
        font-size: 14px;
      }
      .react-calendar__tile {
        margin: 4px;
        padding: 14px 0;
        font-size: 16px;
      }
    }
  `;

  return (
    <div
      style={{
        padding: "30px 20px",
        fontFamily: "'Inter', sans-serif",
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{calendarThemeStyles}</style>
      <h1
        style={{
          marginTop: "0px",
          fontSize: "60px",
          fontWeight: "800",
          marginBottom: "14px",
          color: theme.accent,
          textAlign: "center",
        }}
      >
        NoFap Tracker Calendar
      </h1>
      <p
        style={{
          fontSize: "20px",
          fontWeight: "400",
          marginBottom: "30px",
          textAlign: "center",
          maxWidth: "640px",
        }}
      >
        Click once to mark <strong style={{ color: "limegreen" }}>NoFap</strong>, 
        double click for <strong style={{ color: "tomato" }}>Fap</strong>
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: `0 0 16px ${theme.border}`,
        }}
      >
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          onClickDay={handleDateClick}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate)
          }
          activeStartDate={activeStartDate}
          tileClassName={tileClassName}
        />
      </div>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <div style={cardStyle(theme)}>
          <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>Legend</div>
          <div>
            <span style={legendStyle("limegreen")}>⬤ NoFap</span>
            <span style={legendStyle("tomato")}>⬤ Fap</span>
          </div>
        </div>
        <div style={cardStyle(theme)}>
          <div style={{ fontSize: "18px", fontWeight: "500", color: "limegreen" }}>NoFap Days</div>
          <div style={{ fontSize: "26px", fontWeight: "700", marginTop: "10px" }}>{noFapCount}</div>
        </div>
        <div style={cardStyle(theme)}>
          <div style={{ fontSize: "18px", fontWeight: "500", color: "tomato" }}>Fap Days</div>
          <div style={{ fontSize: "26px", fontWeight: "700", marginTop: "10px" }}>{fapCount}</div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "1000px", marginTop: "60px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "20px",
            textAlign: "center",
            color: theme.accent,
          }}
        >
          📊 Monthly Summary
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={getMonthlyData()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="month" stroke={theme.text} />
            <YAxis stroke={theme.text} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            />
            <Legend />
            <Bar dataKey="NoFap" stackId="a" fill="limegreen" />
            <Bar dataKey="Fap" stackId="a" fill="tomato" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const legendStyle = (color) => ({
  display: "inline-block",
  marginRight: "30px",
  color,
  fontSize: "18px",
});

const cardStyle = (theme) => ({
  background: theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: "12px",
  padding: "20px",
  minWidth: "200px",
  textAlign: "center",
  boxShadow: `0 4px 12px ${theme.border}40`,
  boxSizing: "border-box",
});

export default CalenderPage;

import axios from "axios";

const BASE_URL = "http://localhost:8000"; // adjust if needed

export const getCalendarRecords = async () => {
  return await axios.get(`${BASE_URL}/progress/calendar`);
};

export const markDay = async (payload) => {
  return await axios.post(`${BASE_URL}/progress/mark`, payload);
};

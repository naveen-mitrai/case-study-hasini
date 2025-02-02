import axios from "axios";

const API_BASE = "http://localhost:3000/dev";

export const getDrones = async () => {
  const response = await axios.get(`${API_BASE}/drones`);
  return response.data;
};

export const getBatteryLogs = async () => {
  const response = await axios.get(`${API_BASE}/logs/battery`);
  return response.data;
};

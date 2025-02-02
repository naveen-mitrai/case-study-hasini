import axios from "axios";

const API_BASE = "http://localhost:3000/dev";

export const getDrones = async () => {
  const response = await axios.get(`${API_BASE}/drones`);
  return response.data;
};

export const registerDrone = async (drone) => {
  try {
    const response = await axios.post(`${API_BASE}/drones/register`, drone);
    return response.data;
  } catch (error) {
    console.error("Error registering drone:", error);
    throw error;
  }
};

export const getBatteryLogs = async () => {
  const response = await axios.get(`${API_BASE}/logs/battery`);
  return response.data;
};

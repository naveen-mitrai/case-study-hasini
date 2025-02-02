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

export const registerMedication = async (medication) => {
  try {
    const response = await axios.post(`${API_BASE}/drones/load`, medication);
    return response.data;
  } catch (error) {
    console.error("Error registering medication:", error);
    throw error;
  }
};

export const downloadReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE}/report`, {
      params: { startDate, endDate },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "drone_report.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading report:", error);
  }
};

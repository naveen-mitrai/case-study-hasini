import React, { useEffect, useState } from "react";
import { getDrones, getBatteryLogs } from "../services/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import DownloadReport from "./DownloadReport";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [drones, setDrones] = useState([]);
  const [batteryLogs, setBatteryLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setDrones(await getDrones());
      setBatteryLogs(await getBatteryLogs());
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  const batteryData = {
    labels: drones.map((d) => `Drone ${d.id}`),
    datasets: [
      {
        label: "Battery Level (%)",
        data: drones.map((d) => d.battery_capacity),
        backgroundColor: drones.map((d) => (d.battery_capacity < 25 ? "red" : "green")),
      },
    ],
  };

  const statusData = {
    labels: ["IDLE", "LOADING", "DELIVERING", "RETURNING"],
    datasets: [
      {
        label: "Number of Drones",
        data: [
          drones.filter((d) => d.state === "IDLE").length,
          drones.filter((d) => d.state === "LOADING").length,
          drones.filter((d) => d.state === "DELIVERING").length,
          drones.filter((d) => d.state === "RETURNING").length,
        ],
        backgroundColor: ["blue", "yellow", "orange", "gray"],
      },
    ],
  };

  return (
    <div>
      

      <Link to="/registerDrone">
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
            Register Drone
          </Button>
      </Link>
      
      <DownloadReport/>
      <h2>Drone Dashboard</h2>

      <h3>Battery Levels</h3>
      {drones.length > 0 ? <Bar key={JSON.stringify(drones)} data={batteryData} /> : <p>Loading...</p>}

      <h3>Drone Status</h3>
      {drones.length > 0 ? <Bar key={JSON.stringify(statusData)} data={statusData} /> : <p>Loading...</p>}

      <h3>Battery Logs</h3>
      <ul>
        {batteryLogs.slice(-10).map((log) => (
          <li key={log.id}>Drone {log.drone_id}: {log.battery_level}% at {log.timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

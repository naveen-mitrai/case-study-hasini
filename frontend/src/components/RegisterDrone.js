import React, { useState } from "react";
import { registerDrone } from "../services/api";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const RegisterDrone = () => {
  const [drone, setDrone] = useState({
    model: "",
    weight_limit: "",
    battery_capacity: "",
    battery_percentage: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setDrone({ ...drone, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDrone({
        model: drone.model,
        weight_limit: parseInt(drone.weight_limit),
        battery_capacity: parseInt(drone.battery_capacity),
        battery_percentage: parseInt(drone.battery_percentage),
      });
      setMessage({ text: "Drone registered successfully!", type: "success" });
      setDrone({ model: "", weight_limit: "", battery_capacity: "", battery_percentage: "" }); // Reset form
    } catch (error) {
      setMessage({ text: "Failed to register drone.", type: "error" });
    }
  };

  return (
    <>
        <Link to="/">
                <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                Dashboard
                </Button>
        </Link>
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h5" align="center" gutterBottom>
            Register New Drone
        </Typography>
        
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}

        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Model"
                name="model"
                value={drone.model}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Weight Limit (g)"
                name="weight_limit"
                type="number"
                value={drone.weight_limit}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Battery Capacity (mAh)"
                name="battery_capacity"
                type="number"
                value={drone.battery_capacity}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Battery Percentage (%)"
                name="battery_percentage"
                type="number"
                value={drone.battery_percentage}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
            Register Drone
            </Button>
        </form>
        </Box>
    </>
  );
};

export default RegisterDrone;

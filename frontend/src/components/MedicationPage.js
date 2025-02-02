import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { registerMedication } from "../services/api"; // Add the API function to register medication

const MedicationPage = () => {
  const [medication, setMedication] = useState({
    name: "",
    weight: "",
    code: "",
    source_latitude: "",
    source_longitude: "",
    destination_latitude: "",
    destination_longitude: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [droneId, setDroneId] = useState("");

  const handleChange = (e) => {
    setMedication({ ...medication, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerMedication(medication);
      setMessage({ text: "Medication loaded successfully!", type: "success" });
      setDroneId(result.drone_id);
      setMedication({
        name: "",
        weight: "",
        code: "",
        source_latitude: "",
        source_longitude: "",
        destination_latitude: "",
        destination_longitude: "",
      });
    } catch (error) {
      setMessage({ text: "Failed to load medication.", type: "error" });
    }
  };

  return (
    <>
       
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
            <Typography variant="h5" align="center" gutterBottom>
            Load Medication
            </Typography>

            {message.text && message.type === "success" && <Alert severity={message.type}>{message.text} You can track it through track id: {droneId} </Alert>}
            {message.text && message.type === "error" && <Alert severity={message.type}>{message.text} </Alert>}

            <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Medication Name"
                name="name"
                value={medication.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Weight (g)"
                name="weight"
                type="number"
                value={medication.weight}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Code"
                name="code"
                value={medication.code}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Source Latitude"
                name="source_latitude"
                type="number"
                value={medication.source_latitude}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Source Longitude"
                name="source_longitude"
                type="number"
                value={medication.source_longitude}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Destination Latitude"
                name="destination_latitude"
                type="number"
                value={medication.destination_latitude}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Destination Longitude"
                name="destination_longitude"
                type="number"
                value={medication.destination_longitude}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit Medication
            </Button>
            </form>
        </Box>
    </>
  );
};

export default MedicationPage;

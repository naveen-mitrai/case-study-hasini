import React, { useState } from "react";
import { downloadReport } from "../services/api";
import { Button, TextField, Box } from "@mui/material";

const DownloadReport = () => {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  const handleChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
  };

  const handleDownload = () => {
    downloadReport(dates.startDate, dates.endDate);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 3 }}>
      <TextField
        label="Start Date"
        type="date"
        name="startDate"
        InputLabelProps={{ shrink: true }}
        value={dates.startDate}
        onChange={handleChange}
      />
      <TextField
        label="End Date"
        type="date"
        name="endDate"
        InputLabelProps={{ shrink: true }}
        value={dates.endDate}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" onClick={handleDownload}>
        Download Report
      </Button>
    </Box>
  );
};

export default DownloadReport;

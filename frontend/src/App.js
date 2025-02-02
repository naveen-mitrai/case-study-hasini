import { Container, Typography} from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RegisterDrone from "./components/RegisterDrone";
import MedicationPage from "./components/MedicationPage"; // Import MedicationPage for the loading medication feature

function App() {
  return (
    <Router>
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 3 }}>
          Drone Delivery System
        </Typography>

        <Routes>
          
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/registerDrone" element={<RegisterDrone />} /> 
          <Route path="/medication" element={<MedicationPage />} /> 
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

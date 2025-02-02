import { Container, Typography } from "@mui/material";
import Dashboard from "./components/Dashboard";
import RegisterDrone from "./components/RegisterDrone";

function App() {
  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 3 }}>
        Drone Delivery System
      </Typography>
      <RegisterDrone />
     <Dashboard/>
    </Container>
  );
}

export default App;

const db = require("../models/db");

const DRAIN_AMOUNT = 10; // Battery drains by 10% per cycle

const drainBattery = async () => {
  console.log("Running battery drain simulation...");

  db.all("SELECT id, battery_percentage FROM drones WHERE state IN ('DELIVERING', 'RETURNING')", [], (err, drones) => {
    if (err) {
      console.error("Error fetching drones:", err);
      return;
    }

    if (drones.length === 0) {
      console.log("No active drones to update.");
      return;
    }

    const droneUpdates = drones.map((drone) => {
      const newBatteryLevel = Math.max(0, drone.battery_percentage - DRAIN_AMOUNT);
      return { id: drone.id, battery_level: newBatteryLevel };
    });

    const updateStmt = db.prepare("UPDATE drones SET battery_percentage = ? WHERE id = ?");
    const logStmt = db.prepare("INSERT INTO battery_logs (drone_id, battery_level) VALUES (?, ?)");

    db.serialize(() => {
      droneUpdates.forEach((drone) => {
        updateStmt.run(drone.battery_level, drone.id);
        logStmt.run(drone.id, drone.battery_level);
      });

      updateStmt.finalize();
      logStmt.finalize();
    });

    console.log("Battery drain complete for active drones.");
  });
};

module.exports = { drainBattery };

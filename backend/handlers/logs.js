const db = require("../models/db");

module.exports.getBatteryLogs = async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM battery_logs ORDER BY timestamp DESC LIMIT 50", [], (err, rows) => {
      if (err) {
        console.error("Error fetching battery logs:", err);
        reject({
          statusCode: 500,
          body: JSON.stringify({ message: "Error fetching logs" }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
          },
          body: JSON.stringify(rows),
        });
      }
    });
  });
};

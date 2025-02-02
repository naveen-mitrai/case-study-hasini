const PDFDocument = require("pdfkit");
const moment = require("moment");
const db = require("../models/db");

module.exports.generateReport = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // Prevents AWS Lambda timeout issues
  return new Promise((resolve, reject) => {
    try {
      const { startDate, endDate } = event.queryStringParameters || {};
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=drone_report.pdf",
          },
          body: pdfData.toString("base64"),
          isBase64Encoded: true,
        });
      });

      // Title
      doc.fontSize(18).text("Drone Delivery Report", { align: "center" });
      doc.moveDown();

      // Fetch Drones
      db.all("SELECT * FROM drones", [], (err, drones) => {
        if (err) {
          console.error("Error fetching drones:", err);
          reject({ statusCode: 500, body: "Error fetching drones" });
          return;
        }

        doc.fontSize(14).text("Drone Statuses", { underline: true });
        drones.forEach((drone) => {
          doc.fontSize(12).text(`ID: ${drone.id}, Model: ${drone.model}, State: ${drone.state}, Battery Capacity: ${drone.battery_capacity} mAh, Battery Percentage: ${drone.battery_percentage}%`);
        });
        doc.moveDown();

        // Fetch Battery Logs within the date range
        let query = "SELECT * FROM battery_logs";
        let params = [];
        if (startDate && endDate) {
          query += " WHERE timestamp BETWEEN ? AND ?";
          params.push(startDate, endDate);
        }

        db.all(query, params, (err, batteryLogs) => {
          if (err) {
            console.error("Error fetching logs:", err);
            reject({ statusCode: 500, body: "Error fetching logs" });
            return;
          }

          doc.fontSize(14).text("Battery Level Logs", { underline: true });
          batteryLogs.forEach((log) => {
            doc.fontSize(12).text(`Drone ID: ${log.drone_id}, Battery: ${log.battery_level}%, Time: ${moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss")}`);
          });

          doc.end(); // Finish PDF
        });
      });
    } catch (err) {
      console.error("PDF Generation Error:", err);
      reject({ statusCode: 500, body: "Error generating report" });
    }
  });
};

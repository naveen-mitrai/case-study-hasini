const db = require("../models/db");

module.exports.registerDrone = async (event) => {
  const { model, weight_limit, battery_capacity } = JSON.parse(event.body);
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO drones (model, weight_limit, battery_capacity, state) VALUES (?, ?, ?, 'IDLE')`,
      [model, weight_limit, battery_capacity],
      function (err) {
        if (err) reject(err);
        resolve({
          statusCode: 201,
          body: JSON.stringify({ id: this.lastID, message: "Drone registered" }),
        });
      }
    );
  });
};

module.exports.getDrones = async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM drones", [], (err, rows) => {
      if (err) reject(err);
      resolve({
        statusCode: 200,
        body: JSON.stringify(rows),
      });
    });
  });
};

module.exports.updateDroneState = async (event) => {
  const { id } = event.pathParameters;
  const { state } = JSON.parse(event.body);
  return new Promise((resolve, reject) => {
    db.run(`UPDATE drones SET state = ? WHERE id = ?`, [state, id], (err) => {
      if (err) reject(err);
      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: "Drone state updated" }),
      });
    });
  });
};

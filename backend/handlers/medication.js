const db = require("../models/db");

module.exports.loadMedication = async (event) => {
  const { id } = event.pathParameters;
  const { name, weight, code } = JSON.parse(event.body);

  return new Promise((resolve, reject) => {
    db.get("SELECT weight_limit FROM drones WHERE id = ?", [id], (err, drone) => {
      if (err || !drone) reject({ statusCode: 404, body: "Drone not found" });

      db.get(
        "SELECT SUM(weight) as totalWeight FROM medications WHERE drone_id = ?",
        [id],
        (err, result) => {
          if (err) reject(err);

          const totalWeight = result.totalWeight || 0;
          if (totalWeight + weight > drone.weight_limit) {
            resolve({
              statusCode: 400,
              body: JSON.stringify({ message: "Exceeds weight limit" }),
            });
          } else {
            db.run(
              `INSERT INTO medications (name, weight, code, drone_id) VALUES (?, ?, ?, ?)`,
              [name, weight, code, id],
              function (err) {
                if (err) reject(err);
                resolve({
                  statusCode: 201,
                  body: JSON.stringify({ message: "Medication loaded" }),
                });
              }
            );
          }
        }
      );
    });
  });
};

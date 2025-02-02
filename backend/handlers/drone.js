const db = require("../models/db");
const Joi = require("joi");

const validStates = ["IDLE", "LOADING", "DELIVERING", "DELIVERED", "RETURNING"];

// key is the current state, value is valid possible next states
const validNextState = {
  IDLE: ["LOADING"],
  LOADING: ["DELIVERING"],
  DELIVERING: ["DELIVERED"],
  DELIVERED: ["RETURNING"],
  RETURNING: ["IDLE"],
};

const droneSchema = Joi.object({
  model: Joi.string().min(1).required(), 
  weight_limit: Joi.number().integer().positive().required(), 
  battery_capacity: Joi.number().integer().positive().required(),
  battery_percentage: Joi.number().integer().min(0).max(100).required(), // Between 0-100
});

module.exports.registerDrone = async (event) => {
  try {
    const droneData = JSON.parse(event.body);

    // Validate input data
    const { error, value } = droneSchema.validate(droneData);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Validation Error: ${error.details[0].message}` }),
      };
    }

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO drones (model, weight_limit, battery_capacity, battery_percentage, state) VALUES (?, ?, ?, ?, 'IDLE')`,
        [value.model, value.weight_limit, value.battery_capacity, value.battery_percentage],
        function (err) {
          if (err) {
            reject({
              statusCode: 500,
              body: JSON.stringify({ message: "Database Error", error: err.message }),
            });
            return;
          }

          resolve({
            statusCode: 201,
            body: JSON.stringify({ id: this.lastID, message: "Drone registered successfully" }),
          });
        }
      );
    });
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }
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



module.exports.manageDroneState = async (event) => {
  const { id, state } = JSON.parse(event.body);

  if (!validStates.includes(state)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Invalid state: '${state}'. Must be one of ${validStates.join(", ")}` }),
    };
  }

  return new Promise((resolve, reject) => {
    db.get("SELECT state FROM drones WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("Error fetching drone state:", err);
        reject({
          statusCode: 500,
          body: JSON.stringify({ message: "Internal Server Error" }),
        });
        return;
      }

      if (!row) {
        resolve({
          statusCode: 404,
          body: JSON.stringify({ message: "Drone not found" }),
        });
        return;
      }

      const currentState = row.state;

      // Check if the transition is valid
      if (!validNextState[currentState]?.includes(state)) {
        resolve({
          statusCode: 400,
          body: JSON.stringify({
            message: `Cannot change drone state from '${currentState}' to '${state}'`,
          }),
        });
        return;
      }

      // Update drone state if valid
      db.run("UPDATE drones SET state = ? WHERE id = ?", [state, id], (updateErr) => {
        if (updateErr) {
          console.error(" Error updating drone state:", updateErr);
          reject({
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to update drone state" }),
          });
          return;
        }

        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: `Drone state updated to '${state}'` }),
        });
      });
    });
  });
};

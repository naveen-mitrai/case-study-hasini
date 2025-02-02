const db = require("../models/db");
const Joi = require('joi');

const medicationSchema = Joi.object({
  name: Joi.string().min(1).required(), // name is a non-empty string
  weight: Joi.number().integer().positive().required(), // Weight - positive integer
  code: Joi.string().min(1).required(), // code is a non-empty string
  source_latitude: Joi.number().precision(6).required(), // Latitude with 6 decimal places
  source_longitude: Joi.number().precision(6).required(), // Longitude with 6 decimal places
  destination_latitude: Joi.number().precision(6).required(), // Latitude with 6 decimal places
  destination_longitude: Joi.number().precision(6).required() // Longitude with 6 decimal places
});

// Validate the incoming request
const validateMedication = (data) => {
  const { error, value } = medicationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message); // Throwing an error if validation fails
  }
  return value; // Returning the validated value
};

module.exports.loadMedication = async (event) => {
  const { name, weight, code, source_latitude, source_longitude, destination_latitude, destination_longitude } = JSON.parse(event.body);
  
  try {
    // Validate incoming medication data
    try {
      validateMedication({
        name,
        weight,
        code,
        source_latitude,
        source_longitude,
        destination_latitude,
        destination_longitude
      });
    } catch (validationError) {
      // Handle validation error separately
      console.error('Validation error:', validationError.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid input data', error: validationError.message })
      };
    }

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM drones 
        WHERE state = ? AND battery_percentage > 25`,
        ['LOADING'],
        async (err, drones) => {
          
          if (err || !drones || drones.length === 0) {
            return reject({ statusCode: 404, body: "No suitable drones found" });
          }

          for (const drone of drones) {
            try {
              const result = await new Promise((resolve, reject) => {
                db.get(
                  "SELECT SUM(weight) as totalWeight FROM medications WHERE drone_id = ?",
                  [drone.id],
                  (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                  }
                );
              });
            
              const totalWeight = result.totalWeight || 0;
              if (totalWeight + parseInt(weight) <= drone.weight_limit) {
                
                  db.run(
                    `INSERT INTO medications (name, weight, code, source_latitude, source_longitude, destination_latitude, destination_longitude, drone_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [name, parseInt(weight), code, source_latitude, source_longitude, destination_latitude, destination_longitude, drone.id],
                    function (err) {
                      if (err) {
                        reject({
                          statusCode: 500,
                          body: JSON.stringify({ message: "Error inserting medication", error: err.message }),
                        });
                        return;
                      }
                
                      resolve({
                        statusCode: 201,
                        body: JSON.stringify({ message: "Medication loaded successfully", drone_id: drone.id }),
                      });
                    }
                  );
                
                return; 
              }
            } catch (err) {
              console.log("error", err)
              return reject(err); 
            }
          }

          
          resolve({
            statusCode: 400,
            body: JSON.stringify({ message: "No drones available with sufficient weight limit" }),
          });
        }
      );
    });
  } catch (err) {
    // Catch unexpected errors that may happen outside the validation and db operations
    console.error('Unexpected error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: err.message })
    };
  }
};

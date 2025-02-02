const sqlite3 = require("sqlite3").verbose();

// Create or open a persistent SQLite database file
const db = new sqlite3.Database("./drone_delivery.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {
    console.log("Setting up database...");

    // Create drones table
    db.run(`CREATE TABLE IF NOT EXISTS drones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT NOT NULL,
        weight_limit INTEGER NOT NULL,
        battery_capacity INTEGER NOT NULL,
        battery_percentage INTEGER NOT NULL,
        state TEXT CHECK(state IN ('IDLE', 'LOADING', 'DELIVERING', 'DELIVERED', 'RETURNING')) NOT NULL
    )`);

    // Create medications table
    db.run(`CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        weight INTEGER NOT NULL,
        code TEXT NOT NULL,
        source_latitude Decimal(8,6) NOT NULL,
        source_longitude Decimal(9,6) NOT NULL,
        destination_latitude Decimal(8,6) NOT NULL,
        destination_longitude Decimal(9,6) NOT NULL,
        drone_id INTEGER,
        FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE
    )`);

    // Create battery_logs table
    db.run(`CREATE TABLE IF NOT EXISTS battery_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drone_id INTEGER NOT NULL,
        battery_level INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE
    )`); 

    // Insert dummy data only if tables are empty
    db.get("SELECT COUNT(*) AS count FROM drones", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO drones (model, weight_limit, battery_capacity, battery_percentage, state) 
                    VALUES ('DJI Mavic Pro', 500, 1000, 100, 'IDLE'),
                           ('Parrot Anafi', 300, 880, 80, 'IDLE'),
                           ('Autel Evo II', 400, 920, 90, 'LOADING')`);
        }
    });

    db.get("SELECT COUNT(*) AS count FROM medications", (err, row) => {
        if (row.count === 0) {
          db.run(`
            INSERT INTO medications 
              (name, weight, code, source_latitude, source_longitude, destination_latitude, destination_longitude, drone_id) 
            VALUES 
              ('Paracetamol', 50, 'MED123', 34.0522, -118.2437, 34.0622, -118.2537, 1),
              ('Insulin', 30, 'MED456', 37.7749, -122.4194, 37.8049, -122.4694, 2),
              ('Antibiotics', 40, 'MED789', 51.5074, -0.1278, 52.4862, -1.8904, 3)
          `);
          
        }
    });

    db.get("SELECT COUNT(*) AS count FROM battery_logs", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO battery_logs (drone_id, battery_level) 
                    VALUES (1, 100), (2, 80), (3, 90)`);
        }
    });

    console.log("Database setup complete.");
});

module.exports = db;

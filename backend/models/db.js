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
        state TEXT CHECK(state IN ('IDLE', 'LOADING', 'DELIVERING', 'RETURNING')) NOT NULL
    )`);

    // Create medications table
    db.run(`CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        weight INTEGER NOT NULL,
        code TEXT UNIQUE NOT NULL,
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
            db.run(`INSERT INTO drones (model, weight_limit, battery_capacity, state) 
                    VALUES ('DJI Mavic Pro', 500, 100, 'IDLE'),
                           ('Parrot Anafi', 300, 80, 'IDLE'),
                           ('Autel Evo II', 400, 90, 'LOADING')`);
        }
    });

    db.get("SELECT COUNT(*) AS count FROM medications", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO medications (name, weight, code, drone_id) 
                    VALUES ('Paracetamol', 50, 'MED123', 1),
                           ('Insulin', 30, 'MED456', 2),
                           ('Antibiotics', 40, 'MED789', 3)`);
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

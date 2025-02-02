const { registerDrone, getDrones, manageDroneState } = require("../handlers/drone");
const db = require("../models/db");

jest.mock("../models/db", () => ({
  run: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),
}));

describe("Drone Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerDrone", () => {
    test("should register a drone successfully", async () => {
      const mockEvent = {
        body: JSON.stringify({
          model: "DJI Mavic",
          weight_limit: 500,
          battery_capacity: 1000,
          battery_percentage: 80,
        }),
      };

      db.run.mockImplementation((query, params, callback) => callback(null));

      const response = await registerDrone(mockEvent);

      expect(db.run).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO drones"),
        ["DJI Mavic", 500, 1000, 80],
        expect.any(Function)
      );

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toHaveProperty("message", "Drone registered successfully");
    });

    test("should return validation error for invalid input", async () => {
      const mockEvent = {
        body: JSON.stringify({
          model: "",
          weight_limit: -10,
          battery_capacity: 1000,
          battery_percentage: 80,
        }),
      };

      const response = await registerDrone(mockEvent);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty("message");
    });

    test("should return error for invalid JSON format", async () => {
      const mockEvent = { body: "{invalidJson}" };

      const response = await registerDrone(mockEvent);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty("message", "Invalid JSON format");
    });

    test("should return database error", async () => {
      const mockEvent = {
        body: JSON.stringify({
          model: "DJI Mavic",
          weight_limit: 500,
          battery_capacity: 1000,
          battery_percentage: 80,
        }),
      };

      db.run.mockImplementation((query, params, callback) => callback(new Error("Database Error")));

      await expect(registerDrone(mockEvent)).rejects.toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: "Database Error", error: "Database Error" }),
      });
    });
  });

  describe("getDrones", () => {
    test("should retrieve all drones", async () => {
      const mockDrones = [
        { id: 1, model: "Drone1", state: "IDLE" },
        { id: 2, model: "Drone2", state: "DELIVERING" },
      ];

      db.all.mockImplementation((query, params, callback) => callback(null, mockDrones));

      const response = await getDrones();

      expect(db.all).toHaveBeenCalledWith("SELECT * FROM drones", [], expect.any(Function));
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual(mockDrones);
    });

    test("should return database error", async () => {
      db.all.mockImplementation((query, params, callback) => callback(new Error("DB Error"), null));

      await expect(getDrones()).rejects.toThrow("DB Error");
    });
  });

  describe("manageDroneState", () => {
    test("should update drone state successfully", async () => {
      const mockEvent = { body: JSON.stringify({ id: 1, state: "LOADING" }) };

      db.get.mockImplementation((query, params, callback) => callback(null, { state: "IDLE" }));
      db.run.mockImplementation((query, params, callback) => callback(null));

      const response = await manageDroneState(mockEvent);

      expect(db.get).toHaveBeenCalledWith("SELECT state FROM drones WHERE id = ?", [1], expect.any(Function));
      expect(db.run).toHaveBeenCalledWith("UPDATE drones SET state = ? WHERE id = ?", ["LOADING", 1], expect.any(Function));

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toHaveProperty("message", "Drone state updated to 'LOADING'");
    });

    test("should return error for invalid state transition", async () => {
      const mockEvent = { body: JSON.stringify({ id: 1, state: "DELIVERING" }) };

      db.get.mockImplementation((query, params, callback) => callback(null, { state: "IDLE" }));

      const response = await manageDroneState(mockEvent);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty("message", "Cannot change drone state from 'IDLE' to 'DELIVERING'");
    });

    test("should return error for invalid state", async () => {
      const mockEvent = { body: JSON.stringify({ id: 1, state: "FLYING" }) };

      const response = await manageDroneState(mockEvent);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty("message", "Invalid state: 'FLYING'. Must be one of IDLE, LOADING, DELIVERING, DELIVERED, RETURNING");
    });

    test("should return error if drone is not found", async () => {
      const mockEvent = { body: JSON.stringify({ id: 999, state: "LOADING" }) };

      db.get.mockImplementation((query, params, callback) => callback(null, null));

      const response = await manageDroneState(mockEvent);

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toHaveProperty("message", "Drone not found");
    });

    test("should return error if database fails", async () => {
      const mockEvent = { body: JSON.stringify({ id: 1, state: "LOADING" }) };

      db.get.mockImplementation((query, params, callback) => callback(new Error("DB Error"), null));

      await expect(manageDroneState(mockEvent)).rejects.toEqual({
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });
  });
});

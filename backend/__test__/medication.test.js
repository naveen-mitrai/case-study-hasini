const { loadMedication } = require("../handlers/medication");
const db = require("../models/db");

jest.mock("../models/db", () => ({
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
}));

describe("loadMedication function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully load medication when a suitable drone is available", async () => {
    const mockEvent = {
      body: JSON.stringify({
        name: "Med A",
        weight: 5,
        code: "A123",
        source_latitude: 40.712776,
        source_longitude: -74.005974,
        destination_latitude: 34.052235,
        destination_longitude: -118.243683,
      }),
    };

    const mockDrones = [{ id: 1, weight_limit: 10, battery_percentage: 50 }];
    const mockWeightResult = { totalWeight: 3 };

    db.all.mockImplementation((query, params, callback) => callback(null, mockDrones));
    db.get.mockImplementation((query, params, callback) => callback(null, mockWeightResult));
    db.run.mockImplementation((query, params, callback) => callback(null));

    const response = await loadMedication(mockEvent);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      message: "Medication loaded successfully",
      drone_id: 1,
    });
  });


  test("should return 400 for invalid input data", async () => {
    const mockEvent = {
      body: JSON.stringify({ name: "", weight: -1, code: "" }), // Invalid data
    };

    const response = await loadMedication(mockEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("Invalid input data");
  });

  test("should return 400 if no drones have sufficient weight capacity", async () => {
    const mockEvent = {
      body: JSON.stringify({
        name: "Med A",
        weight: 15, // Weight exceeds all available drone limits
        code: "A123",
        source_latitude: 40.712776,
        source_longitude: -74.005974,
        destination_latitude: 34.052235,
        destination_longitude: -118.243683,
      }),
    };

    const mockDrones = [{ id: 1, weight_limit: 10, battery_percentage: 50 }];
    const mockWeightResult = { totalWeight: 0 };

    db.all.mockImplementation((query, params, callback) => callback(null, mockDrones));
    db.get.mockImplementation((query, params, callback) => callback(null, mockWeightResult));
    db.run.mockImplementation((query, params, callback) => callback(null));

    const response = await loadMedication(mockEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("No drones available with sufficient weight limit");
  });
});

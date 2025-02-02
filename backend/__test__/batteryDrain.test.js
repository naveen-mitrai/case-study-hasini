const { drainBattery } = require("../handlers/batteryDrain"); // Update the path
const db = require("../models/db");

jest.mock("../models/db", () => ({
  all: jest.fn(),
  prepare: jest.fn(),
  serialize: jest.fn((callback) => callback()), // Mock serialize
}));

describe("drainBattery function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should drain battery for active drones", async () => {
    const mockDrones = [
      { id: 1, battery_percentage: 50 },
      { id: 2, battery_percentage: 15 },
    ];

    db.all.mockImplementation((query, params, callback) => {
      callback(null, mockDrones);
    });

    // Separate mocks for update and log statements
    const updateMock = jest.fn();
    const logMock = jest.fn();

    db.prepare.mockImplementation((query) => {
      if (query.startsWith("UPDATE")) {
        return { run: updateMock, finalize: jest.fn() };
      } else if (query.startsWith("INSERT")) {
        return { run: logMock, finalize: jest.fn() };
      }
    });

    await drainBattery();

    // Ensure each mock was called the correct number of times
    expect(updateMock).toHaveBeenCalledTimes(2);
    expect(updateMock).toHaveBeenCalledWith(40, 1);
    expect(updateMock).toHaveBeenCalledWith(5, 2);

    expect(logMock).toHaveBeenCalledTimes(2);
    expect(logMock).toHaveBeenCalledWith(1, 40);
    expect(logMock).toHaveBeenCalledWith(2, 5);
  });

  test("should handle no active drones", async () => {
    db.all.mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    console.log = jest.fn();

    await drainBattery();

    expect(console.log).toHaveBeenCalledWith("No active drones to update.");
  });

  test("should handle database errors", async () => {
    db.all.mockImplementation((query, params, callback) => {
      callback(new Error("Database error"), null);
    });

    console.error = jest.fn();

    await drainBattery();

    expect(console.error).toHaveBeenCalledWith("Error fetching drones:", expect.any(Error));
  });
});

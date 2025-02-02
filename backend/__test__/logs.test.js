const { getBatteryLogs } = require("../handlers/logs");
const db = require("../models/db");

jest.mock("../models/db", () => ({
  all: jest.fn(),
}));

describe("getBatteryLogs function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return battery logs successfully", async () => {
    const mockLogs = [
      { id: 1, drone_id: 2, battery_level: 80, timestamp: "2025-02-03T10:00:00Z" },
      { id: 2, drone_id: 3, battery_level: 60, timestamp: "2025-02-03T10:05:00Z" },
    ];

    db.all.mockImplementation((query, params, callback) => {
      callback(null, mockLogs);
    });

    const response = await getBatteryLogs();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    });
    expect(JSON.parse(response.body)).toEqual(mockLogs);
  });

  test("should handle database errors", async () => {
    db.all.mockImplementation((query, params, callback) => {
      callback(new Error("Database error"), null);
    });

    console.error = jest.fn();

    await expect(getBatteryLogs()).rejects.toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching logs" }),
    });

    expect(console.error).toHaveBeenCalledWith("Error fetching battery logs:", expect.any(Error));
  });
});

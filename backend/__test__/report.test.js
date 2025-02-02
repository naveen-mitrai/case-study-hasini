const { generateReport } = require('../handlers/report');
const db = require('../models/db');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// Mock the db.all method
jest.mock('../models/db', () => ({
  all: jest.fn(),
}));

// Mock PDFDocument
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => ({
    fontSize: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    on: jest.fn(),
    end: jest.fn(),
  }));
});

// Mock moment
jest.mock('moment', () => {
  return jest.fn().mockImplementation(() => ({
    format: jest.fn().mockReturnValue('2025-02-03 12:00:00'),
  }));
});

describe('generateReport', () => {
  let context;
  let event;

  beforeEach(() => {
    context = {
      callbackWaitsForEmptyEventLoop: true,
    };
    event = {
      queryStringParameters: {
        startDate: '2025-01-01',
        endDate: '2025-02-01',
      },
    };
    // Reset mocks before each test
    PDFDocument.mockClear();
    db.all.mockClear();
    moment.mockClear();
  });


  it('should handle errors when fetching drones', async () => {
    db.all.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    try {
      await generateReport(event, context);
    } catch (err) {
      expect(err.statusCode).toBe(500);
      expect(err.body).toBe('Error fetching drones');
    }
  });

  it('should handle errors when fetching battery logs', async () => {
    db.all.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    }).mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    try {
      await generateReport(event, context);
    } catch (err) {
      expect(err.statusCode).toBe(500);
      expect(err.body).toBe('Error fetching logs');
    }
  });

  it('should handle errors when generating the PDF', async () => {
    // Simulate an error in PDF generation
    PDFDocument.mockImplementationOnce(() => {
      throw new Error('PDF Generation Error');
    });

    try {
      await generateReport(event, context);
    } catch (err) {
      expect(err.statusCode).toBe(500);
      expect(err.body).toBe('Error generating report');
    }
  });
});

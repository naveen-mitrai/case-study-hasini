# Drone Medication Delivery System
## Introduction
The rapid advancement of drone technology offers unprecedented opportunities in delivering essential supplies like medications. This project involves designing a system to manage and monitor a fleet of drones tasked with delivering medications. The goal is to build a full-stack solution that integrates APIs, a dashboard, and reporting features.

---
## Functional Requirements
1) Core Drone Operations:
   Create RESTful APIs (preferably, using serverless v3 framework) to:
   - Register a new drone with unique identifiers (ID, model, weight limit, battery capacity).
   - Manage drone states (IDLE, LOADING, DELIVERING, DELIVERED, RETURNING).
   - Load medication items onto a drone. Each medication has a name, weight, and unique code (alphanumeric).
2) Business Rules:
   - Prevent loading a drone if the total weight of medications exceeds its weight limit.
   - Disallow drones from entering the LOADING state if the battery level is below 25%.
3) Simulate Drone Battery Draining:

   Implement a scheduled process that:
   - Drains drone battery levels of all drones that are in DELIVERING and RETURNING states.
   - Logs battery statuses into an audit table.
4) Data Dashboard:

   Build a simple React-based dashboard that:
   - Displays the current battery levels of all drones in a single bar chart.
   - No of drones in each state in another bar chart
5) Reporting:

   Implement functionality to generate a report (optionally a PDF report):
   - Containing the list of all drones and their statuses.
   - Include battery level logs within a user-specified time range.

## Non-Functional Requirements
1) Data Format:
   - API requests and responses must be in JSON format.
2) Project Build and Run:
   - The application must be easily buildable and runnable.
   - Include a README file with clear instructions on how to:
     - Set up the environment.
     - Build and run the application.
     - Run any available tests.
   - Use a database (e.g., in-memory SQLite, MongoDB via Docker, etc.) with preloaded reference and dummy data.
3) Technology Stack:
   - Backend: Node.js (with the Serverless v3 Framework using serverless-offline or any familiar framework).
   - Frontend: React.js (with Minimals UI) for the dashboard.
   - Database: Developer’s choice (NoSQL or SQL).
   - Optionally:
     - Libraries such as pdfkit or puppeteer for PDF generation.
     - Unit tests for critical functionalities
     - Commit History: Demonstrate how you work through well-documented and logical commits.

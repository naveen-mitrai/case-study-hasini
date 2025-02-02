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

# Implementation

## Techology Stack

Backend - Node js with Serverless V3 Framework using serverless-offline

Frontend - React.js

Database - Sqlite3

Report generation - pdfkit

Unit tests - jest

## How to run the application

## Clone the project

Use the following command to clone the project. You need to have git installed for this command to execute.

```
git clone https://github.com/naveen-mitrai/case-study-hasini.git
```

### Run frontend

Run following command in the root directory to run the frontend.

```
cd frontend
npm install
set PORT=4000 && npm start
```

For PORT you can use any port you want.

You can access the frontend app for admin through using following url.

`http://localhost:4000/`

You can access the frontend app for the person who load medicine (ex: pharmacist)

`http://localhost:4000/medication`

### Run Backend

Run following command in the root directory to run the backend.

```
cd backend
npm i serverless@3.39.0
npm install
serverless offline
```

### Run unit tests

Run following command in the root directory

```
cd backend
npm test
```

### Calling Rest apis

#### Register a new drone

url: http://localhost:3000/dev/drones/register

method: POST

body: 

```
{  
	"model": "DJI Air 3S",
	"weight_limit": 600,
	"battery_capacity": 8000,
	"battery_percentage": 80,

}
```

#### Manage drones

url: http://localhost:3000/dev/drones/state

method: POST

body:

```
{  
	"id":4,  
	"state":"LOADING"
}
```

#### Load medications onto a drone

url: http://localhost:3000/dev/drones/state

method: POST

body:

```
{
  "name": "Pain Reliever",
  "weight": 250,
  "code": "PR-1234",
  "source_latitude": 34.0522,
  "source_longitude": -118.2437,
  "destination_latitude": 36.7783,
  "destination_longitude": -119.4179
}
```

## Features of frontend app

* You can view the app for admin through using following url
  ```
  http://localhost:4000/
  ```
* Register drone by clicking the Register Drone button which redirect to form for registering new drone where you can fill the details of the drone and submit the form.
* You can generate the report by clicking the download report button while specifying the date range ( if you don't specify the date range report will generate for all days)
* You can view charts for battery levels, drone status in that page with Battery logs.
* You can access the frontend app for the person who load medicine (ex: pharmacist) and fill the details of the medication and submit the form.

```
	 http://localhost:4000/medication
```

## Future Improvements

We can do following as future improvements.

* Implement searching for the best path using the latitude and longitude of source and destination of medications that the drone can take.
* Separately input pharamacies and delivery destinations with their latitude and longtiude to schedule the drones in a way that battery percentage of drones manage optimally.

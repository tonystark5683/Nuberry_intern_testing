Forecast Server Documentation
The forecast server is a Node.js application built with Express that serves forecasted sales data from a PostgreSQL database. It provides a simple API endpoint (/run_forecast) for fetching the forecasted data, and it is designed to handle Cross-Origin Resource Sharing (CORS) using the cors middleware.

Server Setup
The server script initializes an Express application, configures necessary middleware, and establishes a connection to a PostgreSQL database using the pg library. The database connection details (e.g., username, password, host, port, and database name) are provided in the pool configuration object.

javascript
Copy code
const express = require("express");
const cors = require("cors");
const app = express(); // server
const { Pool } = require("pg");

app.use(express.json()); // middlewares
app.use(cors());

const pool = new Pool({
  user: "postgres",
  password: "nuberry",
  host: "localhost",
  port: 5432,
  database: "nuebaby",
});

console.log("Successful connection to the database");
API Endpoint - /run_forecast
Endpoint Description
Path: /run_forecast
Method: GET
Description: Retrieves forecasted sales data from the PostgreSQL database.
Endpoint Implementation
The server defines a single GET endpoint at /run_forecast to fetch forecasted sales data from the database. The SQL query retrieves all records from the "DailyForecastByStrDptPrctBrd" table.

javascript
Copy code
app.get("/run_forecast", (req, res) => {
  const sql = 'SELECT * FROM public."DailyForecastByStrDptPrctBrd";';

  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(result.rows);
    res.json(result.rows);
  });
});
The endpoint uses the pool.query method to execute the SQL query and handle the result.
If an error occurs during the database query, an error message is logged to the console.
If successful, the fetched data is logged to the console, and the response is sent as JSON containing the fetched rows.
Server Initialization
The server listens on port 5000 for incoming HTTP requests and logs a message once it starts.

javascript
Copy code
app.listen(5000, () => {
  console.log("Server started (http://localhost:5000/) !");
});
The server is configured to listen on http://localhost:5000/.
Once started, a message is logged to the console indicating that the server is running.
Usage
Ensure that a PostgreSQL server is running with the specified connection details.

Run the server script using node:

bash
Copy code
node server.js
The server will be accessible at http://localhost:5000/.

Make a GET request to http://localhost:5000/run_forecast to fetch forecasted sales data.

Dependencies
express: Web application framework for Node.js.
cors: Middleware for enabling Cross-Origin Resource Sharing.
pg: PostgreSQL client for Node.js.
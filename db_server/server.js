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
  app.listen(5000, () => {
    console.log("Server started (http://localhost:5000/) !");
  });
  
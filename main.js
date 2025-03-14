const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "nothing here to see" });
});

// Open Weather Map API Key
app.get("/open-weather/key", (req, res) => {
  res.json({ apiKey: process.env.WEATHER_API_KEY });
});

// Middleware to handle undefined routes
app.use((req, res, next) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page not found</title>
    </head>
    <body>
        <h1>404 - Page not found</h1>
        <p>We're sorry, but the page you're looking for doesn't exist.</p>
    </body>
    </html>
  `);
});

// Middleware to handle other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

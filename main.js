import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "nothing here to see" });
});

// Open Weather Map API Request - GET Weather by City Name
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "A city name is required" });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === "400" || data.cod === "404") {
      return res.status(400).json({ error: `Invalid city` });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not get weather" });
  }
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

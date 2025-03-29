import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";

dotenv.config();

const app = express();

// Middleware para procesar datos JSON en el cuerpo de la solicitud
// app.use(express.json());

// Middleware para manejar datos de formularios con archivos adjuntos (multipart/form-data)
const formParser = multer();

// Middleware para permitir solicitudes desde otros orígenes (CORS)
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page not found</title>
    </head>
    <body>
        <h1>My API Hub </h1>
        <p>Different request to different APIs I use</p>
    </body>
    </html>
  `);
});

// Web3Forms API Request - POST message (to my email)
app.post("/contact/send", formParser.none(), async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No form data provided" });
  }

  const formData = { ...req.body, access_key: process.env.WEB3FORMS_API_KEY };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong on the server" });
  }
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

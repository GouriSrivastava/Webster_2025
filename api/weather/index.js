import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
console.log("API Key:", process.env.WEATHER_API_KEY);

const app = express();
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Weather server is running!");
});

/**
 * GET /weather?city=CityName&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Returns either current weather or forecast for a date range.
 */
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city || "Prayagraj";
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const apiKey = process.env.WEATHER_API_KEY;

    let url;

    if (startDate && endDate) {
      // Forecast for date range
      url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
        city
      )}/${startDate}/${endDate}?unitGroup=metric&key=${apiKey}&include=days`;
    } else {
      // Current weather (today)
      const today = new Date().toISOString().split("T")[0];
      url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
        city
      )}/${today}/${today}?unitGroup=metric&key=${apiKey}&include=days`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.days && data.days.length > 0) {
      const forecast = data.days.map((day) => ({
        date: day.datetime,
        temperature: day.temp,
        condition: day.conditions,
      }));

      res.json({
        city: data.resolvedAddress || data.address || city,
        forecast,
      });
    } else {
      res.json({ error: "No forecast available." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const city = req.query.city || "Prayagraj";
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const apiKey = process.env.WEATHER_API_KEY;

    let url;
    if (startDate && endDate) {
      url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
        city
      )}/${startDate}/${endDate}?unitGroup=metric&key=${apiKey}&include=days`;
    } else {
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

export default router;

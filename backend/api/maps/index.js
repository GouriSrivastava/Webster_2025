// routes/routes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination)
      return res.status(400).json({ error: "origin and destination required" });

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY,
          mode: "driving",
          alternatives: true, 
        },
      }
    );

    if (!response.data.routes || response.data.routes.length === 0)
      return res.status(404).json({ error: "No routes found" });

    const routes = response.data.routes.map((route) => ({
      polyline: route.overview_polyline.points,
      distance: route.legs[0].distance.text,
      duration: route.legs[0].duration.text,
      summary: route.summary,
    }));

    res.json({ routes });
  } catch (err) {
    console.error("Google Maps Directions error:", err.message);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

export default router;

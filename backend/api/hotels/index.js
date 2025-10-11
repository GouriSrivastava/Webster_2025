
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


export async function getCoordinates(placeName) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      { params: { address: placeName, key: process.env.GOOGLE_PLACES_API_KEY } }
    );
    const location = response.data.results[0]?.geometry?.location;
    if (!location) return null;
    return `${location.lat},${location.lng}`;
  } catch (err) {
    console.error("Error getting coordinates:", err.message);
    return null;
  }
}


export async function fetchHotels(locationCoords) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: { location: locationCoords, radius: 5000, type: "lodging", key: process.env.GOOGLE_PLACES_API_KEY },
      }
    );

    return response.data.results.slice(0, 10).map((h) => ({
      name: h.name,
      rating: h.rating,
      price: Math.floor(Math.random() * 10000) + 2000, 
      photo: h.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${h.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` : null,
      link: `https://www.google.com/maps/place/?q=place_id:${h.place_id}`,
    }));
  } catch (err) {
    console.error("Hotels error:", err.message);
    return [];
  }
}


router.get("/", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "Please provide a city name" });

    const locationCoords = await getCoordinates(city);
    if (!locationCoords) return res.status(400).json({ error: "Invalid city name" });

    const hotels = await fetchHotels(locationCoords);

    if (!hotels || hotels.length === 0) {
      return res.json({ message: "No hotels found for this location." });
    }

    res.json({
      city,
      hotels,
    });
  } catch (err) {
    console.error("Hotels API error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

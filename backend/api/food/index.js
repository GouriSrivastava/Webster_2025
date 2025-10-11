import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


async function getCoordinates(cityName) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      { params: { address: cityName, key: process.env.GOOGLE_PLACES_API_KEY } }
    );
    const location = response.data.results[0]?.geometry?.location;
    if (!location) return null;
    return `${location.lat},${location.lng}`;
  } catch (err) {
    console.error("Error getting coordinates:", err.message);
    return null;
  }
}

export async function fetchFood(locationCoords) {
  const maxResults = 12;
  let results = [];
  let nextPageToken = null;

  try {
    do {
      const params = {
        location: locationCoords,
        radius: 15000, 
        type: "restaurant",
        key: process.env.GOOGLE_PLACES_API_KEY,
        pagetoken: nextPageToken || undefined,
      };

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        { params }
      );

      results.push(
        ...response.data.results.map((r) => ({
          name: r.name,
          rating: r.rating,
          price: (Math.random() * 1000 + 500).toFixed(0),
          photo: r.photos
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${r.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            : null,
          link: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
        }))
      );

      nextPageToken = response.data.next_page_token;
      
      if (nextPageToken) await new Promise((r) => setTimeout(r, 2500));
    } while (results.length < maxResults && nextPageToken);

 
    return results.slice(0, maxResults);
  } catch (err) {
    console.error("Food API error:", err.message);
    return [];
  }
}


router.get("/", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "Please provide a city name" });

    const locationCoords = await getCoordinates(city);
    if (!locationCoords) return res.status(400).json({ error: "Invalid city name" });

    const food = await fetchFood(locationCoords);

    if (!food || food.length === 0) {
      return res.json({ message: "No restaurants found for this location." });
    }

    res.json({ city, food });
  } catch (err) {
    console.error("Food route error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

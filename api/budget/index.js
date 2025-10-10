import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());

// --- Initialize OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Convert user-entered place name → coordinates
async function getCoordinates(placeName) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: placeName,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );
    const location = response.data.results[0]?.geometry?.location;
    if (!location) return null;
    return `${location.lat},${location.lng}`;
  } catch (err) {
    console.error("Error getting coordinates:", err.message);
    return null;
  }
}

// --- Fetch flights using Amadeus API ---
async function fetchFlights(destination) {
  try {
    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        params: {
          originLocationCode: "DEL",
          destinationLocationCode: destination,
          adults: 1,
        },
        headers: {
          Authorization: `Bearer ${process.env.AMADEUS_API_KEY}`,
        },
      }
    );
    return response.data.data.slice(0, 3).map((f) => ({
      name: `Flight ${f.id}`,
      price: f.price.total + " INR",
      link: "https://www.amadeus.com/",
      photo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plane_sky.jpg",
    }));
  } catch (err) {
    console.error("Flights error:", err.message);
    return [];
  }
}

// --- Fetch hotels using Booking.com API ---
async function fetchHotels(destination) {
  try {
    const response = await axios.get(
      `https://booking-com.p.rapidapi.com/v1/hotels/search`,
      {
        params: {
          units: "metric",
          locale: "en-gb",
          order_by: "popularity",
          dest_id: "-2092174",
          filter_by_currency: "INR",
        },
        headers: {
          "X-RapidAPI-Key": process.env.BOOKING_API_KEY,
          "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        },
      }
    );
    return response.data.result.slice(0, 3).map((h) => ({
      name: h.hotel_name,
      price: `${h.price_breakdown?.gross_price?.toFixed(0)} INR`,
      link: h.url || "https://booking.com",
      photo: h.main_photo_url,
      rating: h.review_score,
    }));
  } catch (err) {
    console.error("Hotels error:", err.message);
    return [];
  }
}

// --- Fetch food places using Google Places API ---
async function fetchFood(locationCoords) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: locationCoords,
          radius: 5000,
          type: "restaurant",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );
    return response.data.results.slice(0, 3).map((r) => ({
      name: r.name,
      rating: r.rating,
      photo: r.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${r.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        : null,
      link: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
    }));
  } catch (err) {
    console.error("Food error:", err.message);
    return [];
  }
}

// --- Fetch activities using TripAdvisor API ---
async function fetchActivities(destination) {
  try {
    const response = await axios.get(
      `https://tripadvisor16.p.rapidapi.com/api/v1/attractions/search`,
      {
        params: { query: destination },
        headers: {
          "X-RapidAPI-Key": process.env.TRIPADVISOR_API_KEY,
          "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
        },
      }
    );
    return response.data.data.slice(0, 3).map((a) => ({
      name: a.title,
      rating: a.rating,
      photo: a.thumbnail?.photo_url,
      link: a.web_url,
    }));
  } catch (err) {
    console.error("Activities error:", err.message);
    return [];
  }
}

// --- Generate AI summary using OpenAI ---
async function generateAISummary(data) {
  const prompt = `
  Create a short 3-line summary for a personalized travel budget plan.
  Use the following options:
  Flights: ${data.flights.map((f) => f.name).join(", ")}
  Hotels: ${data.hotels.map((h) => h.name).join(", ")}
  Food: ${data.food.map((r) => r.name).join(", ")}
  Activities: ${data.activities.map((a) => a.name).join(", ")}
  Emphasize balance of cost, comfort, and fun.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI summary error:", err.message);
    return "Here’s your travel plan combining great value and comfort!";
  }
}

// --- Main Budget Route ---
app.post("/api/budget", async (req, res) => {
  try {
    const { destination } = req.body;

    const locationCoords = await getCoordinates(destination);
    if (!locationCoords)
      return res.status(400).json({ error: "Invalid destination name" });

    const [flights, hotels, food, activities] = await Promise.all([
      fetchFlights(destination),
      fetchHotels(destination),
      fetchFood(locationCoords),
      fetchActivities(destination),
    ]);

    const summary = await generateAISummary({
      flights,
      hotels,
      food,
      activities,
    });

    res.json({
      success: true,
      data: { flights, hotels, food, activities },
      summary,
    });
  } catch (err) {
    console.error("Budget route error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

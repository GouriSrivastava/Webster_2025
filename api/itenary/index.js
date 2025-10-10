import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

// Helper: get weather for destination and date range (reuse your Visual Crossing code)
async function getWeatherForecast(city, startDate, endDate) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    city
  )}/${startDate}/${endDate}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&include=days`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.days && data.days.length > 0) {
    return data.days.map((day) => ({
      date: day.datetime,
      temp: day.temp,
      condition: day.conditions,
    }));
  }
  return [];
}

// Helper: get top activities / attractions (example using TripAdvisor API via RapidAPI)
async function getTopAttractions(city) {
  try {
    const options = {
      method: "GET",
      url: `https://tripadvisor1.p.rapidapi.com/locations/search`,
      params: { query: city },
      headers: {
        "X-RapidAPI-Key": process.env.TRIPADVISOR_API_KEY,
        "X-RapidAPI-Host": "tripadvisor1.p.rapidapi.com",
      },
    };

    const res = await axios.request(options);
    // Return top 5 attractions if available
    return res.data.data?.[0]?.result_object?.web_url
      ? res.data.data.slice(0, 5).map((item) => ({
          name: item.result_object.name,
          type: item.result_object.category?.key || "Attraction",
          link: item.result_object.web_url,
        }))
      : [];
  } catch (err) {
    console.error("TripAdvisor API error:", err.message);
    return [];
  }
}

// Helper: get travel info between points (Google Maps Directions)
async function getTravelInfo(origin, destination) {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_MAPS_API_KEY,
          mode: "driving",
        },
      }
    );

    const leg = res.data.routes?.[0]?.legs?.[0];
    return leg
      ? { distance: leg.distance.text, duration: leg.duration.text }
      : {};
  } catch (err) {
    console.error("Google Maps Directions error:", err.message);
    return {};
  }
}

// POST /api/itinerary
app.post("/api/itinerary", async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, preferences } = req.body;

    if (!destination || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "destination, startDate, and endDate are required" });
    }

    // 1️⃣ Get weather forecast
    const weatherData = await getWeatherForecast(destination, startDate, endDate);

    // 2️⃣ Get top attractions / activities
    const attractions = await getTopAttractions(destination);

    // 3️⃣ (Optional) Get travel info between origin & destination, skipped if only one city

    // 4️⃣ Prepare prompt for OpenAI
    const prompt = `
Generate a day-by-day itinerary for a trip to ${destination} from ${startDate} to ${endDate}.
Include sightseeing, activities, and local attractions. 
Use the following weather information for each day: ${JSON.stringify(weatherData)}.
Include top attractions or places to visit: ${JSON.stringify(attractions)}.
Consider this budget info: ${JSON.stringify(budget)}.
Consider user preferences: ${JSON.stringify(preferences)}.
Return the itinerary in JSON format with this structure:
[
  { "date": "YYYY-MM-DD", "morning": "...", "afternoon": "...", "evening": "...", "weather": "..." }
]
`;

    // 5️⃣ Call OpenAI API
    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    const aiItineraryText =
      openAiResponse.data.choices?.[0]?.message?.content || "No itinerary generated";

    // 6️⃣ Try to parse JSON
    let itinerary = [];
    try {
      itinerary = JSON.parse(aiItineraryText);
    } catch (err) {
      console.warn("Could not parse AI response as JSON, sending raw text.");
      itinerary = [{ rawText: aiItineraryText }];
    }

    res.json({ destination, itinerary });
  } catch (err) {
    console.error("Itinerary generation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

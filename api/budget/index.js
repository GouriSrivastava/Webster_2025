import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());

// --- Initialize OpenAI ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Major Indian airports IATA codes ---
const INDIA_AIRPORTS = {
  "Delhi": "DEL",
  "Mumbai": "BOM",
  "Bengaluru": "BLR",
  "Chennai": "MAA",
  "Kolkata": "CCU",
  "Hyderabad": "HYD",
  "Goa": "GOI",
  "Pune": "PNQ",
  "Jaipur": "JAI",
  "Ahmedabad": "AMD",
  "Kochi": "COK",
  "Lucknow": "LKO",
  "Thiruvananthapuram": "TRV",
  "Indore": "IDR",
  "Nagpur": "NAG",
  "Varanasi": "VNS",
  "Shimla": "SLV",
"Manali": "BHU",          // Kullu-Manali Airport
"Rishikesh": "DED",       // Dehradun Airport
"Darjeeling": "IXB",      // Bagdogra Airport
"Andaman": "IXZ",         // Port Blair Airport
"Leh": "IXL",
"Jaisalmer": "JSA",
"Jodhpur": "JDH",
"Udaipur": "UDR",
"Hampi": "HBX",           // Hubli Airport
"Rann of Kutch": "BHJ",   // Bhuj Airport
"Coorg": "IXE",           // Mangalore Airport
"Munnar": "COK",          // Coch
"Srinagar": "SXR",
"Amritsar": "ATQ",
"Dehradun": "DED",
"Guwahati": "GAU",
"Ooty": "CJB" ,
"Prayagraj": "IXD"


};

// --- Budget ranges ---
const budgetRanges = {
  range1: { min: 0, max: 30000 },
  range2: { min: 30001, max: 75000 },
  range3: { min: 75001, max: 100000 },
  range4: { min: 100001, max: 450000 }
};

// --- Category allocations ---
const allocations = {
  hotels: 0.3,
  flights_trains: 0.4,
  food: 0.3
};

// --- Helper: Filter items by budget ---
function filterByBudget(items, maxBudget) {
  return items.filter(i => parseFloat(i.price) <= maxBudget);
}

// --- Get IATA code ---
async function getIATACode(cityName) {
  if (INDIA_AIRPORTS[cityName]) return INDIA_AIRPORTS[cityName];

  try {
    const tokenResponse = await axios.post(
      `https://test.api.amadeus.com/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations`,
      {
        params: { keyword: cityName, subType: "CITY" },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data.data[0]?.iataCode || null;
  } catch (err) {
    console.error("IATA Code error:", err.message);
    return null;
  }
}

// --- Fetch flights ---
async function fetchFlights(originCity, destinationCity, departureDate) {
  try {
    const originCode = await getIATACode(originCity);
    const destinationCode = await getIATACode(destinationCity);

    if (!originCode || !destinationCode) return [];

    const tokenResponse = await axios.post(
      `https://test.api.amadeus.com/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate,
          adults: 1,
          max: 5
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data.data.map((f) => ({
      name: `Flight ${f.id}`,
      price: parseFloat(f.price.total),
      link: "https://www.amadeus.com/",
      photo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Plane_sky.jpg",
    }));
  } catch (err) {
    console.error("Flights error:", err.response?.data || err.message);
    return [];
  }
}

// --- Fetch food ---
async function fetchFood(locationCoords) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: { location: locationCoords, radius: 5000, type: "restaurant", key: process.env.GOOGLE_PLACES_API_KEY },
      }
    );

    return response.data.results.slice(0, 10).map((r) => ({
      name: r.name,
      rating: r.rating,
      price: Math.floor(Math.random() * 1500) + 200, // Dummy price in INR
      photo: r.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${r.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` : null,
      link: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
    }));
  } catch (err) {
    console.error("Food error:", err.message);
    return [];
  }
}

// --- Fetch hotels ---
async function fetchHotels(locationCoords) {
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
      price: Math.floor(Math.random() * 10000) + 2000, // Dummy price in INR
      photo: h.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${h.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}` : null,
      link: `https://www.google.com/maps/place/?q=place_id:${h.place_id}`,
    }));
  } catch (err) {
    console.error("Hotels error:", err.message);
    return [];
  }
}

// --- Get coordinates ---
async function getCoordinates(placeName) {
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

// --- AI Summary ---
async function generateAISummary(data) {
  const prompt = `
  Create a short 3-line summary for a personalized travel budget plan.
  Flights: ${data.flights.map((f) => f.name).join(", ")}
  Hotels: ${data.hotels.map((h) => h.name).join(", ")}
  Food: ${data.food.map((r) => r.name).join(", ")}
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
    const { origin, destination, departureDate, budgetRange } = req.body;
    if (!origin || !destination || !departureDate || !budgetRange)
      return res.status(400).json({ error: "Please provide origin, destination, departureDate, and budgetRange." });

    const locationCoords = await getCoordinates(destination);
    if (!locationCoords) return res.status(400).json({ error: "Invalid destination name" });

    const [flights, hotels, food] = await Promise.all([
      fetchFlights(origin, destination, departureDate),
      fetchHotels(locationCoords),
      fetchFood(locationCoords),
    ]);

    const range = budgetRanges[budgetRange];
    if (!range) return res.status(400).json({ error: "Invalid budget range." });

    // Calculate allocated budgets
    const hotelsBudget = range.max * allocations.hotels;
    const flightsBudget = range.max * allocations.flights_trains; // Can include trains later
    const foodBudget = range.max * allocations.food;

    // Filter by allocated budgets
    const flightsFiltered = filterByBudget(flights, flightsBudget);
    const hotelsFiltered = filterByBudget(hotels, hotelsBudget);
    const foodFiltered = filterByBudget(food, foodBudget);

    const summary = await generateAISummary({ flights: flightsFiltered, hotels: hotelsFiltered, food: foodFiltered });

    res.json({
      success: true,
      data: { flights: flightsFiltered, hotels: hotelsFiltered, food: foodFiltered },
      summary,
    });
  } catch (err) {
    console.error("Budget route error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Start server ---
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));



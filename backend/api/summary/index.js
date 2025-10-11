import express from "express";
import OpenAI from "openai";
import { fetchFlights } from "../flights/index.js";
import { fetchHotels, getCoordinates } from "../hotels/index.js";
import { fetchFood } from "../food/index.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const budgetRanges = {
  range1: { min: 0, max: 30000 },
  range2: { min: 30001, max: 75000 },
  range3: { min: 75001, max: 100000 },
  range4: { min: 100001, max: 450000 },
};


const allocations = {
  flights_trains: 0.4,
  hotels: 0.35,
  food: 0.25,
};


function generateRealisticPrices(items, type) {
  return items.map((item) => {
    let basePrice;
    switch (type) {
      case "flights":
        basePrice = Math.random() > 0.6
          ? 15000 + Math.random() * 25000 
          : 4000 + Math.random() * 10000; 
        break;
      case "hotels":
        basePrice = 2000 + Math.random() * 5000; 
        break;
      case "food":
        basePrice = 500 + Math.random() * 1000; 
        break;
      default:
        basePrice = 1000;
    }
    return { ...item, price: Math.round(basePrice) };
  });
}


function filterByBudget(items, maxBudget) {
  return items
    .filter((i) => parseFloat(i.price) <= maxBudget)
    .sort((a, b) => a.price - b.price);
}


async function generateAISummary(data) {
  const prompt = `
Create a 3-line travel budget summary with realistic insights.

Flights: ${data.flights.length ? data.flights.map(f => `${f.name} (₹${f.price})`).join(", ") : "No flights found"}
Hotels: ${data.hotels.length ? data.hotels.map(h => `${h.name} (₹${h.price})`).join(", ") : "No hotels found"}
Food: ${data.food.length ? data.food.map(r => `${r.name} (₹${r.price})`).join(", ") : "No restaurants found"}

Focus on balance, comfort, and value for money.
  `;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return "Your travel plan balances comfort, great food, and smart spending!";
  }
}


router.post("/", async (req, res) => {
  try {
    const { origin, destination, departureDate, budgetRange } = req.body;
    if (!origin || !destination || !departureDate || !budgetRange)
      return res.status(400).json({ error: "Provide origin, destination, departureDate, and budgetRange." });

    const coords = await getCoordinates(destination);
    if (!coords) return res.status(400).json({ error: "Invalid destination name" });


    let [flights, hotels, food] = await Promise.all([
      fetchFlights(origin, destination, departureDate),
      fetchHotels(coords),
      fetchFood(coords),
    ]);


    flights = generateRealisticPrices(flights, "flights");
    hotels = generateRealisticPrices(hotels, "hotels");
    food = generateRealisticPrices(food, "food");

    const range = budgetRanges[budgetRange];
    if (!range) return res.status(400).json({ error: "Invalid budget range." });

    const totalBudget = (range.min + range.max) / 2;
    const flightsBudget = totalBudget * allocations.flights_trains;
    const hotelsBudget = totalBudget * allocations.hotels;
    const foodBudget = totalBudget * allocations.food;

    const flightsFiltered = filterByBudget(flights, flightsBudget);
    const hotelsFiltered = filterByBudget(hotels, hotelsBudget);
    const foodFiltered = filterByBudget(food, foodBudget);

    const summary = await generateAISummary(
      { flights: flightsFiltered, hotels: hotelsFiltered, food: foodFiltered }
    );

    res.json({
      success: true,
      data: {
        flights: flightsFiltered,
        hotels: hotelsFiltered,
        food: foodFiltered,
      },
      summary,
    });
  } catch (err) {
    console.error("Budget route error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

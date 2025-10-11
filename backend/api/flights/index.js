import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


const AIRLINE_NAMES = {
  "6E": "IndiGo",
  "AI": "Air India",
  "UK": "Vistara",
  "SG": "SpiceJet",
  "I5": "AirAsia India",
  "IX": "Air India Express",
  "G8": "Go First",
  "QP": "Akasa Air",
  "9W": "Jet Airways",
};


const INDIA_AIRPORTS = {
  Delhi: "DEL",
  Mumbai: "BOM",
  Bengaluru: "BLR",
  Chennai: "MAA",
  Kolkata: "CCU",
  Hyderabad: "HYD",
  Goa: "GOI",
  Pune: "PNQ",
  Jaipur: "JAI",
  Ahmedabad: "AMD",
  Kochi: "COK",
  Lucknow: "LKO",
  Thiruvananthapuram: "TRV",
  Indore: "IDR",
  Nagpur: "NAG",
  Varanasi: "VNS",
  Shimla: "SLV",
  Manali: "BHU",
  Rishikesh: "DED",
  Darjeeling: "IXB",
  Andaman: "IXZ",
  Leh: "IXL",
  Jaisalmer: "JSA",
  Jodhpur: "JDH",
  Udaipur: "UDR",
  Hampi: "HBX",
  Rann_of_Kutch: "BHJ",
  Coorg: "IXE",
  Munnar: "COK",
  Srinagar: "SXR",
  Amritsar: "ATQ",
  Dehradun: "DED",
  Guwahati: "GAU",
  Ooty: "CJB",
  Prayagraj: "IXD",
};


async function getIATACode(cityName) {
  if (INDIA_AIRPORTS[cityName]) return INDIA_AIRPORTS[cityName];
  return null;
}


export async function fetchFlights(originCity, destinationCity, departureDate) {
  const originCode = await getIATACode(originCity);
  const destinationCode = await getIATACode(destinationCity);
  try {

    
    if (!originCode || !destinationCode) {
      const gfLink = departureDate
        ? `https://www.google.com/travel/flights`
        : `https://www.google.com/travel/flights`;
      return Array.from({ length: 5 }, (_, i) => ({
        name: `Flight ${i + 1}`,
        link: gfLink,
      }));
    }

    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error("Amadeus credentials missing: set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in .env");
      throw new Error("Missing Amadeus credentials");
    }

    const tokenResp = await axios.post(
      `https://test.api.amadeus.com/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" } }
    );

    const accessToken = tokenResp?.data?.access_token;
    if (!accessToken) {
      console.error("Failed to obtain Amadeus access token:", tokenResp?.data);
      throw new Error("Amadeus OAuth failed");
    }
    
    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate,
          adults: 1,
          max: 5,
        },
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      }
    );

    const flights = (response.data.data || []).map((f) => {
      const firstSeg = f.itineraries?.[0]?.segments?.[0];

      const validatingCarrier = Array.isArray(f.validatingAirlineCodes) && f.validatingAirlineCodes.length > 0 ? f.validatingAirlineCodes[0] : undefined;
      const carrier = validatingCarrier || firstSeg?.carrierCode; 
      const flightNum = firstSeg?.number || f.id;   
      const originSegCode = firstSeg?.departure?.iataCode;
      const destSegCode = firstSeg?.arrival?.iataCode;

      const origin = originSegCode || originCode || "";
      const destination = destSegCode || destinationCode || "";
     
      const gfLink = origin && destination && departureDate
        ? `https://www.google.com/travel/flights?hl=en#flt=${origin}.${destination}.${departureDate};${carrier ? `c:${carrier}*;` : ''}sd:1;t:f`
        : `https://www.google.com/travel/flights`;

      const airlineName = carrier && AIRLINE_NAMES[carrier] ? AIRLINE_NAMES[carrier] : carrier;
      return {
        name: carrier && flightNum ? `${airlineName || 'Flight'} ${carrier}${flightNum}` : `Flight ${f.id}`,
        link: gfLink,
      };
    });

   
    while (flights.length < 5) {
      flights.push({
        name: `Flight ${flights.length + 1}`,
        link: originCode && destinationCode && departureDate
          ? `https://www.google.com/travel/flights?hl=en#flt=${originCode}.${destinationCode}.${departureDate};sd:1;t:f`
          : `https://www.google.com/travel/flights`,
      });
    }

    return flights;
  } catch (err) {
    console.error("Flights API error:", err.response?.data || err.message);
   
    const gfLink = originCode && destinationCode && departureDate
      ? `https://www.google.com/travel/flights?hl=en#flt=${originCode}.${destinationCode}.${departureDate};sd:1;t:f`
      : `https://www.google.com/travel/flights`;
    return Array.from({ length: 5 }, (_, i) => ({
      name: `Flight ${i + 1}`,
      
      link: gfLink,
    }));
  }
}

router.get("/", async (req, res) => {
  try {
    const { origin = "Delhi", destination = "Mumbai", departureDate } = req.query;

    if (!departureDate) return res.status(400).json({ error: "Please provide a departureDate" });

    const flights = await fetchFlights(origin, destination, departureDate);

    res.json({
      origin,
      destination,
      departureDate,
      flights,
    });
  } catch (err) {
    console.error("Flights route error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;


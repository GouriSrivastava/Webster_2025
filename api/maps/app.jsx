import { useState } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import axios from "axios";
import { decode } from "@googlemaps/polyline-codec";

export default function MapRoutes() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);

  const handleGetRoutes = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/routes", {
        origin,
        destination,
      });
      setRoutes(res.data.routes);
    } catch (err) {
      console.error("Error fetching routes:", err);
      alert("Failed to fetch routes. Make sure backend is running.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        placeholder="Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleGetRoutes} style={{ padding: "5px 10px" }}>
        Show Routes
      </button>

      <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            zoom={7}
            center={{ lat: 20.5937, lng: 78.9629 }} // India center
          >
            {routes.map((r, i) => (
              <Polyline
                key={i}
                path={decode(r.polyline)}
                options={{
                  strokeColor: i === 0 ? "blue" : "gray",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
                onClick={() =>
                  alert(
                    `${r.summary}\nDistance: ${r.distance}\nDuration: ${r.duration}`
                  )
                }
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

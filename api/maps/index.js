import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import axios from "axios";
import { decode } from "@googlemaps/polyline-codec";

export default function MapRoutes() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const mapRef = useRef(null);

  const handleGetRoutes = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/routes", {
        origin,
        destination,
      });
      const fetchedRoutes = res.data.routes;
      setRoutes(fetchedRoutes);
      setSelectedRoute(null); // reset selection

      // Fit map bounds to all routes
      if (fetchedRoutes.length && mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        fetchedRoutes.forEach((r) => {
          const path = decode(r.polyline).map(([lat, lng]) => ({ lat, lng }));
          path.forEach((point) => bounds.extend(point));
        });
        mapRef.current.fitBounds(bounds);
      }
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
            center={{ lat: 20.5937, lng: 78.9629 }}
            onLoad={(map) => (mapRef.current = map)}
          >
            {routes.map((r, i) => (
              <Polyline
                key={i}
                path={decode(r.polyline)}
                options={{
                  strokeColor:
                    selectedRoute?.id === r.id ? "green" : i === 0 ? "blue" : "gray",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
                onClick={() => setSelectedRoute(r)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {selectedRoute && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <h3>Selected Route:</h3>
          <p><strong>Summary:</strong> {selectedRoute.summary}</p>
          <p><strong>Distance:</strong> {selectedRoute.distance}</p>
          <p><strong>Duration:</strong> {selectedRoute.duration}</p>
          <p>
            <strong>From:</strong> {selectedRoute.start_address} <br />
            <strong>To:</strong> {selectedRoute.end_address}
          </p>
        </div>
      )}
    </div>
  );
}

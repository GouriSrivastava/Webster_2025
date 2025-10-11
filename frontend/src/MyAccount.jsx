import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savedTripsOpen, setSavedTripsOpen] = useState(false);
  const [savedTrips] = useState([
    { id: 1, title: "Paris Getaway", dates: "2025-05-12 to 2025-05-18" },
    { id: 2, title: "Tokyo Adventure", dates: "2025-07-01 to 2025-07-10" },
    { id: 3, title: "Goa Weekend", dates: "2025-11-20 to 2025-11-23" },
  ]);

  const toggleSavedTrips = () => setSavedTripsOpen(!savedTripsOpen);


  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("userEmail") || "";
      const storedName = localStorage.getItem("userName") || deriveNameFromEmail(storedEmail);
      if (storedEmail) setEmail(storedEmail);
      if (storedName) setName(storedName);
    } catch (e) {
     
    }
  }, []);

  const deriveNameFromEmail = (mail) => {
    if (!mail) return "";
    const part = mail.split("@")[0];
    return part
      .split(/[._-]+/)
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/home" className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">WANDERLY</Link>
          <div className="flex items-center space-x-6 text-gray-700">
            <Link to="/home" className="hover:text-blue-600">Home</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/contactus" className="hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
        <h1 className="text-5xl align-center text-center font-licorice font-bold text-gray-900 mb-6">My Account</h1>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Saved Trips</label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleSavedTrips}
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-gray-700">{savedTripsOpen ? "Hide" : "Show"} saved trips</span>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${savedTripsOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {savedTripsOpen && (
                <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                  {savedTrips.map((trip) => (
                    <div key={trip.id} className="px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{trip.title}</p>
                        <p className="text-sm text-gray-500">{trip.dates}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                    </div>
                  ))}
                  {savedTrips.length === 0 && (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">No saved trips yet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;



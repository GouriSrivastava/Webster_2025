import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import BudgetSection from "./budget";
import TripPlanner from "./tripplanner";
import axios from "axios";

const Home = () => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '',
    budget: ''
  });
  

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRecommendationsCard, setShowRecommendationsCard] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherOpen, setWeatherOpen] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState("");
  const [hotelsData, setHotelsData] = useState(null);
  const [hotelsOpen, setHotelsOpen] = useState(true);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError, setFoodError] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [foodOpen, setFoodOpen] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [flightsError, setFlightsError] = useState("");
  const [flightsData, setFlightsData] = useState(null);
  const [flightsOpen, setFlightsOpen] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [budgetData, setBudgetData] = useState(null);
  const [budgetOpen, setBudgetOpen] = useState(true);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState("");
  const [mapsData, setMapsData] = useState(null);
  const [mapsOpen, setMapsOpen] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.source.trim()) newErrors.source = 'Please enter departure city';
    if (!formData.destination.trim()) newErrors.destination = 'Please enter destination city';
    if (!formData.startDate) newErrors.startDate = 'Please select start date';
    if (!formData.endDate) newErrors.endDate = 'Please select end date';
    if (!formData.travelers) newErrors.travelers = 'Please select number of travelers';
    if (!formData.budget) newErrors.budget = 'Please select budget range';
    
  
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setWeatherLoading(true);
    setWeatherError("");
    setWeatherData(null);
    setHotelsLoading(true);
    setHotelsError("");
    setHotelsData(null);
    setFoodLoading(true);
    setFoodError("");
    setFoodData(null);
    setFlightsLoading(true);
    setFlightsError("");
    setFlightsData(null);
    setMapsLoading(true);
    setMapsError("");
    setMapsData(null);

    try {
      const params = new URLSearchParams({
        city: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      const flightParams = new URLSearchParams({
        origin: formData.source,
        destination: formData.destination,
        departureDate: formData.startDate
      });

      const [weatherRes, hotelsRes, foodRes, flightsRes, mapsRes] = await Promise.all([
        fetch(`http://localhost:5000/weather?${params.toString()}`),
        fetch(`http://localhost:5000/hotels?city=${encodeURIComponent(formData.destination)}`),
        fetch(`http://localhost:5000/food?city=${encodeURIComponent(formData.destination)}`),
        fetch(`http://localhost:5000/flights?${flightParams.toString()}`),
        fetch('http://localhost:5000/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: formData.source,
            destination: formData.destination
          })
        })
      ]);

      if (!weatherRes.ok) {
        throw new Error(`Weather API error: ${weatherRes.status}`);
      }
      const weatherJson = await weatherRes.json();
      if (weatherJson.error) {
        throw new Error(weatherJson.error);
      }
      setWeatherData(weatherJson);

      if (!hotelsRes.ok) {
        throw new Error(`Hotels API error: ${hotelsRes.status}`);
      }
      const hotelsJson = await hotelsRes.json();
      if (hotelsJson.error) {
        throw new Error(hotelsJson.error);
      }
      setHotelsData(hotelsJson);

      if (!foodRes.ok) {
        throw new Error(`Food API error: ${foodRes.status}`);
      }
      const foodJson = await foodRes.json();
      if (foodJson.error) {
        throw new Error(foodJson.error);
      }
      setFoodData(foodJson);

      if (!flightsRes.ok) {
        throw new Error(`Flights API error: ${flightsRes.status}`);
      }
      const flightsJson = await flightsRes.json();
      if (flightsJson.error) {
        throw new Error(flightsJson.error);
      }
      setFlightsData(flightsJson);

      if (!mapsRes.ok) {
        throw new Error(`Maps API error: ${mapsRes.status}`);
      }
      const mapsJson = await mapsRes.json();
      if (mapsJson.error) {
        throw new Error(mapsJson.error);
      }
      setMapsData(mapsJson);
    } catch (err) {
      console.error("API fetch failed:", err);
      setWeatherError(err.message || "Failed to load weather");
      setHotelsError(err.message || "Failed to load hotels");
      setFoodError(err.message || "Failed to load food");
      setFlightsError(err.message || "Failed to load flights");
      setMapsError(err.message || "Failed to load routes");
    } finally {
      setWeatherLoading(false);
      setHotelsLoading(false);
      setFoodLoading(false);
      setFlightsLoading(false);
      setMapsLoading(false);
      setIsSubmitting(false);
      setShowRecommendationsCard(true);
    }
  };

  const handleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };
  const token = localStorage.getItem("token");
  const handleLogout =  async () => {
    try {
    
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      
      localStorage.removeItem("token");

     
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };



  const handleMyAccount = () => {
    setShowUserDropdown(false);
    navigate('/account');
  };

  const closeRecommendationsCard = () => {
    setShowRecommendationsCard(false);
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{ backgroundImage: "url('/src/home.png')", fontFamily: 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-400/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/40 to-black/50"></div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-10 py-6 text-white opacity-0 animate-fadeInDown" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"' }}>
        <Link to="/" className="text-white group">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.8)] transition-all duration-300 tracking-wider">
            WANDERLY
          </h1>
        </Link>

        <ul className="flex space-x-8 items-center">
          {[{label: "About", href: "/about"}, {label: "Contact", href: "/contactus"}].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:text-yellow-400 cursor-pointer transition duration-300"
              >
                {item.label}
              </a>
            </li>
          ))}
          
          {/* User Account Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={handleUserDropdown}
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="text-center mb-12 opacity-0 animate-fadeInUp">
            <h1 className="text-5xl md:text-6xl font-bold text-teal-600 mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Discover amazing destinations and create unforgettable memories with our intelligent travel planner
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="flex items-center text-white/80">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Best Price </span>
              </div>
              <div className="flex items-center text-white/80">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">According to Your budget</span>
              </div>
              <div className="flex items-center text-white/80">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Best deals</span>
              </div>
            </div>
          </div>

          {/* Travel Planning Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl opacity-0 animate-fadeInUp transform translate-y-8" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Where would you like to go?</h2>
              <p className="text-gray-600">Fill in the details below to get personalized recommendations</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row - Source and Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="source" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="Enter departure city"
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200 group-hover:shadow-md ${
                        errors.source ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  {errors.source && <p className="mt-1 text-sm text-red-600">{errors.source}</p>}
                </div>

                <div className="group">
                  <label htmlFor="destination" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Enter destination city"
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200 group-hover:shadow-md ${
                        errors.destination ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination}</p>}
                </div>
              </div>

              {/* Second Row - Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="startDate" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200 group-hover:shadow-md ${
                        errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                <div className="group">
                  <label htmlFor="endDate" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200 group-hover:shadow-md ${
                        errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
              </div>

              {/* Third Row - Travelers and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="travelers" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <select
                      id="travelers"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200 group-hover:shadow-md appearance-none ${
                        errors.travelers ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      required
                    >
                      <option value="">Select travelers</option>
                      <option value="1">1 Traveler</option>
                      <option value="2">2 Travelers</option>
                      <option value="3">3 Travelers</option>
                      <option value="4">4 Travelers</option>
                      <option value="5+">5+ Travelers</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.travelers && <p className="mt-1 text-sm text-red-600">{errors.travelers}</p>}
                </div>

                <div className="group">
                  <label htmlFor="budget" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Budget Range
                  </label>
                  <div className="relative">
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all duration-200 group-hover:shadow-md appearance-none ${
                        errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      required
                    >
                      <option value="">Select budget</option>
                      <option value="0-30000">Under ₹30,000</option>
                      <option value="30001-75000">₹30,000 - ₹75,000</option>
                      <option value="75001-100000">₹75,000 - ₹1,00,000 </option>
                      <option value="100001-450000">Over ₹1,00,000</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`relative inline-flex items-center justify-center px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-2xl'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Planning Your Trip...
                    </>
                  ) : (
                    <>
                      Let's Go! 🚀
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Recommendations Dropdown Card */}
      {showRecommendationsCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out animate-slideInUp">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Personalized Travel Recommendations</h2>
                  <p className="text-gray-600">Based on your trip from {formData.source} to {formData.destination}</p>
                </div>
                <button
                  onClick={closeRecommendationsCard}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              {/* Weather Forecast (Dropdown Cards) */}
              <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setWeatherOpen(!weatherOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a4 4 0 100-8 6 6 0 10-12 0" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold tracking-wide text-gray-800">Weather Forecast {weatherData?.city ? `- ${weatherData.city}` : ""}</h3>
                      {weatherLoading && <p className="text-sm text-gray-600">Loading latest weather...</p>}
                      {weatherError && <p className="text-sm text-red-600">{weatherError}</p>}
                      {!weatherLoading && !weatherError && weatherData && (
                        <p className="text-sm text-gray-600">{weatherData.forecast.length} day forecast</p>
                      )}
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-600 transform transition-transform ${weatherOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {weatherOpen && (
                  <div className="px-6 py-4 bg-white">
                    {weatherLoading && (
                      <div className="flex items-center text-gray-600">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching weather...
                      </div>
                    )}
                    {!weatherLoading && weatherError && (
                      <div className="text-sm text-red-600">{weatherError}</div>
                    )}
                    {!weatherLoading && !weatherError && weatherData && weatherData.forecast && weatherData.forecast.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weatherData.forecast.map((day) => (
                          <div key={day.date} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-800">{new Date(day.date).toLocaleDateString()}</span>
                              <span className="text-sm text-blue-600">{Math.round(day.temperature)}°C</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a4 4 0 100-8 6 6 0 10-12 0" />
                              </svg>
                              <span className="text-sm">{day.condition}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hotels (Dropdown Cards) */}
              <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setHotelsOpen(!hotelsOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold tracking-wide text-gray-800">Hotels {hotelsData?.city ? `- ${hotelsData.city}` : ""}</h3>
                      {hotelsLoading && <p className="text-sm text-gray-600">Finding stays near your destination...</p>}
                      {hotelsError && <p className="text-sm text-red-600">{hotelsError}</p>}
                      {!hotelsLoading && !hotelsError && hotelsData && (
                        <p className="text-sm text-gray-600">Top {hotelsData.hotels?.length || 0} options</p>
                      )}
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-600 transform transition-transform ${hotelsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {hotelsOpen && (
                  <div className="px-6 py-4 bg-white">
                    {hotelsLoading && (
                      <div className="flex items-center text-gray-600">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching hotels...
                      </div>
                    )}
                    {!hotelsLoading && hotelsError && (
                      <div className="text-sm text-red-600">{hotelsError}</div>
                    )}
                    {!hotelsLoading && !hotelsError && hotelsData && hotelsData.hotels && hotelsData.hotels.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {hotelsData.hotels.map((h, idx) => (
                          <a key={`${h.name}-${idx}`} href={h.link || '#'} target="_blank" rel="noreferrer" className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="h-40 w-full overflow-hidden bg-gray-100">
                              <img src={h.photo || '/src/hoteldefault.jpeg'} alt={h.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-base font-semibold text-gray-900 line-clamp-1">{h.name}</h4>
                                {typeof h.rating === 'number' && (
                                  <span className="ml-3 inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {h.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{hotelsData.city}</span>
                                {typeof h.price === 'number' && (
                                  <span className="font-semibold text-gray-900">₹{h.price.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Food & Restaurants (Dropdown Cards) */}
              <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFoodOpen(!foodOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-50 to-rose-50 hover:from-orange-100 hover:to-rose-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 3h16M4 7h16M10 21V7m4 14V7m4 14V7M6 21V7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold tracking-wide text-gray-800">Food & Restaurants {foodData?.city ? `- ${foodData.city}` : ""}</h3>
                      {foodLoading && <p className="text-sm text-gray-600">Finding great places to eat...</p>}
                      {foodError && <p className="text-sm text-red-600">{foodError}</p>}
                      {!foodLoading && !foodError && foodData && (
                        <p className="text-sm text-gray-600">Top {foodData.food?.length || 0} picks</p>
                      )}
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-600 transform transition-transform ${foodOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {foodOpen && (
                  <div className="px-6 py-4 bg-white">
                    {foodLoading && (
                      <div className="flex items-center text-gray-600">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching restaurants...
                      </div>
                    )}
                    {!foodLoading && foodError && (
                      <div className="text-sm text-red-600">{foodError}</div>
                    )}
                    {!foodLoading && !foodError && foodData && foodData.food && foodData.food.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {foodData.food.map((r, idx) => (
                          <a key={`${r.name}-${idx}`} href={r.link || '#'} target="_blank" rel="noreferrer" className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="h-40 w-full overflow-hidden bg-gray-100">
                              <img src={r.photo || '/src/fooddefault.jpeg'} alt={r.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-base font-semibold text-gray-900 line-clamp-1">{r.name}</h4>
                                {typeof r.rating === 'number' && (
                                  <span className="ml-3 inline-flex items-center text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                                    <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {r.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{foodData.city}</span>
                                {r.price && (
                                  <span className="font-semibold text-gray-900">₹{r.price}</span>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Flights (Dropdown Cards) */}
              <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFlightsOpen(!flightsOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-sky-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold tracking-wide text-gray-800">Flights {flightsData?.origin && flightsData?.destination ? `- ${flightsData.origin} → ${flightsData.destination}` : ""}</h3>
                      {flightsLoading && <p className="text-sm text-gray-600">Searching the best flight options...</p>}
                      {flightsError && <p className="text-sm text-red-600">{flightsError}</p>}
                      {!flightsLoading && !flightsError && flightsData && (
                        <p className="text-sm text-gray-600">Top {flightsData.flights?.length || 0} options</p>
                      )}
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-gray-600 transform transition-transform ${flightsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {flightsOpen && (
                  <div className="px-6 py-4 bg-white">
                    {flightsLoading && (
                      <div className="flex items-center text-gray-600">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Fetching flights...
                      </div>
                    )}
                    {!flightsLoading && flightsError && (
                      <div className="text-sm text-red-600">{flightsError}</div>
                    )}
                    {!flightsLoading && !flightsError && flightsData && flightsData.flights && flightsData.flights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {flightsData.flights.map((f, idx) => (
                          <div key={`${f.name || 'flight'}-${idx}`} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-base font-semibold text-gray-900 line-clamp-1">{f.name || 'Flight Option'}</h4>
                                {typeof f.price === 'number' && (
                                  <span className="ml-3 text-sm font-semibold text-gray-900">₹{f.price.toLocaleString()}</span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-1 mb-3">
                                {flightsData?.departureDate && (
                                  <span className="inline-flex items-center bg-gray-50 px-2 py-0.5 rounded">🗓 {flightsData.departureDate}</span>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <a href={f.link || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors">
                                  Book
                                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 16" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Maps & Routes Section */}
              {(mapsData || mapsLoading || mapsError) && (
                <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMapsOpen(!mapsOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold tracking-wide text-gray-800">
                          Route Information
                        </h3>
                        {mapsLoading && (
                          <p className="text-sm text-gray-600">Finding best routes...</p>
                        )}
                        {mapsError && <p className="text-sm text-red-600">{mapsError}</p>}
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transform transition-transform ${
                        mapsOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-500 ${
                      mapsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 py-4 bg-white">
                      {mapsLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center text-gray-600">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                      {mapsError && (
                        <div className="text-center py-8">
                          <div className="text-sm text-red-600">{mapsError}</div>
                        </div>
                      )}
                      {!mapsLoading && !mapsError && mapsData && mapsData.routes && mapsData.routes.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Available Routes</h4>
                          {mapsData.routes.map((route, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-base font-semibold text-gray-900">
                                  Route {index + 1}
                                </h5>
                                <span className="text-sm text-gray-500">
                                  {route.summary || `Route ${index + 1}`}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="font-medium">Distance:</span>
                                  <span className="ml-1 text-gray-900">{route.distance}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Duration:</span>
                                  <span className="ml-1 text-gray-900">{route.duration}</span>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    const directionsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(formData.source)}/${encodeURIComponent(formData.destination)}`;
                                    window.open(directionsUrl, '_blank');
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Open in Maps
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Summary (Dropdown) */}
              {budgetData?.data && (
  <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    <button
      type="button"
      onClick={() => setBudgetOpen(!budgetOpen)}
      className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-colors"
    >
      <div className="flex items-center">
        <div className="bg-teal-100 p-2 rounded-lg mr-3">
          <svg
            className="w-6 h-6 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <div className="text-left">
          <h3 className="text-lg font-semibold tracking-wide text-gray-800">
            Budget Summary
          </h3>
          {budgetLoading && (
            <p className="text-sm text-gray-600">Optimizing your budget...</p>
          )}
          {budgetError && <p className="text-sm text-red-600">{budgetError}</p>}
        </div>
      </div>
      <svg
        className={`w-5 h-5 text-gray-600 transform transition-transform ${
          budgetOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      className={`transition-all duration-500 ${
        budgetOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden`}
    >
      <div className="px-6 py-4 bg-white">
        {budgetData.summary && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
            {budgetData.summary}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["flights", "hotels", "food"].map((cat) => (
            <div key={cat} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 capitalize">
                {cat} (suggested)
              </h4>
              {(budgetData.data?.[cat] || []).slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span className="truncate mr-2">{item.name}</span>
                  <span className="font-semibold text-gray-900">
                    {item.price
                      ? `₹${Number(item.price).toLocaleString()}`
                      : "—"}
                  </span>
                </div>
              ))}

              {(budgetData.data?.[cat] || []).length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100 text-sm font-medium text-gray-700">
                  Total: ₹
                  {(
                    budgetData.data[cat]
                      .slice(0, 3)
                      .reduce((sum, x) => sum + Number(x.price || 0), 0)
                  ).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}



              {/* Trip Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">From: <strong>{formData.source}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">To: <strong>{formData.destination}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">Duration: <strong>{formData.startDate} to {formData.endDate}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Travelers: <strong>{formData.travelers}</strong></span>
                  </div>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                
              </div>

                                          {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                
                <button
  type="button"
  onClick={async () => {
    try {
      setBudgetLoading(true);
      setBudgetError("");
      setBudgetData(null);
      const body = {
        origin: formData.source,
        destination: formData.destination,
        departureDate: formData.startDate,
        budgetRange: formData.budget
          ? formData.budget === "under-1000"
            ? "range1"
            : formData.budget === "1000-3000"
            ? "range2"
            : formData.budget === "3000-5000"
            ? "range3"
            : "range4"
          : "range2",
      };
      const res = await fetch("http://localhost:5000/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch budget");
      setBudgetData(json);
      setBudgetOpen(true);
    } catch (e) {
      setBudgetError(e.message);
    } finally {
      setBudgetLoading(false);
      setShowRecommendationsCard(true);
    }
  }}
  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-colors duration-200"
>
  {budgetLoading ? (
    <svg
      className="animate-spin h-5 w-5 mr-2 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  ) : null}
  {budgetLoading ? "Loading..." : "Get Budget Summary"}
</button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;



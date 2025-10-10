import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TripItinerarySection from "./TripItinerarySection";
import Home from "./Home";
import MyAccount from "./MyAccount";
import About from "./About";
import ContactUs from "./ContactUs";
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from "react";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);
    console.log("Logged in successfully!");
  }
}, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
     
      localStorage.setItem("token", data.token);
      console.log("User logged in:", data.user);

      
      setShowModal(false);
    } else {
      
      alert(data.message || "Check your credentials");
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Network error, please try again");
  }
};

 

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="-my-5 bg-[#FFFFFF]" >
          {/* ---------- Hero Section ---------- */}
          <section className="relative h-screen w-full overflow-hidden">
        {/* Background image (stays sharp) */}
        <img
          href="#"
          src="/main.png"
          alt="Adventure Background"
          className="absolute top-0 left-0 w-full h-full object-center cursor-pointer"
          style={{
            transform: "translateZ(0)", // GPU render for clarity
            imageRendering: "auto", // Try "crisp-edges" if still blurry
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>

        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 text-white z-50 opacity-0 [animation:fadeDown_800ms_ease-out_200ms_forwards]">


  <a href="#">
  <img
    href="#"
    src="src/logoo.png"
    alt="Adventor Logo"
    className="h-20 w-auto object-contain"
  />
</a>


  <ul className="flex space-x-8">
    {["Home", "About", "Contact"].map((item) => (
      <li key={item}>
        {item === "Home" ? (
          <Link
            to="/home"
            className="hover:text-yellow-400 cursor-pointer transition duration-300"
          >
            {item}
          </Link>
        ) : item === "About" ? (
          <Link
            to="/about"
            className="hover:text-yellow-400 cursor-pointer transition duration-300"
          >
            {item}
          </Link>
        ) : item === "Contact" ? (
          <Link
            to="/contactus"
            className="hover:text-yellow-400 cursor-pointer transition duration-300"
          >
            {item}
          </Link>
        ) : (
          <a
            href="#"
            className="hover:text-yellow-400 cursor-pointer transition duration-300"
          >
            {item}
          </a>
        )}
      </li>
    ))}
  </ul>
</nav>


        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white opacity-0 [animation:fadeUp_900ms_ease-out_400ms_forwards]">
         <p className="font-licorice text-5xl  tracking-wider mb-2">
  Discover the
</p>
          <h1 className=" font-russo text-5xl md:text-7xl font-extrabold mb-4">
            Adventure Travel
          </h1>
          <p className="font-licorice  text-3xl mb-6">Your best Adventure Deals with nature</p>
          {/* floating decorative blobs */}
          <span className="pointer-events-none absolute -z-0 -top-10 -left-10 w-72 h-72 rounded-full bg-cyan-300/15 blur-3xl [animation:floatBlob_12s_ease-in-out_infinite]"></span>
          <span className="pointer-events-none absolute -z-0 top-24 -right-8 w-64 h-64 rounded-full bg-fuchsia-300/15 blur-3xl [animation:floatBlob_14s_1.2s_ease-in-out_infinite]"></span>
          <button 
            onClick={toggleModal}
            className="relative inline-flex items-center justify-center px-8 py-3 rounded-full font-mono font-semibold text-white text-base tracking-wide
bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
bg-[length:200%_200%] [animation:gradientMove_7s_ease_infinite]
shadow-[0_0_18px_rgba(0,255,255,0.35)] hover:shadow-[0_0_36px_rgba(56,189,248,0.7)]
transition-transform duration-500 ease-out hover:scale-[1.06] active:scale-95
overflow-hidden group will-change-transform [transform:perspective(700px)] hover:[transform:perspective(700px)_rotateX(6deg)_rotateY(-4deg)]">
  {/* glow layer */}
  <span className="pointer-events-none absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl
  bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.45),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.45),transparent_55%)]"></span>
  {/* particles */}
  <span className="pointer-events-none absolute w-2 h-2 rounded-full bg-white/70 top-1/2 left-3 -translate-y-1/2 blur-[1px] [animation:floatParticle_3.6s_ease-in-out_infinite]"></span>
  <span className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-cyan-200/80 top-2 right-6 blur-[0.5px] [animation:floatParticle_4.2s_0.3s_ease-in-out_infinite]"></span>
  <span className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-fuchsia-200/80 bottom-2 left-6 blur-[0.5px] [animation:floatParticle_4.8s_0.6s_ease-in-out_infinite]"></span>
  {/* label */}
  <span className="relative z-10 drop-shadow-[0_1px_0_rgba(0,0,0,0.2)] [text-shadow:0_0_8px_rgba(255,255,255,0.35)]">Start Planning</span>
</button>

<style jsx>{`
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatParticle {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: .9; }
    25% { transform: translateY(-6px) translateX(3px) scale(1.06); opacity: 1; }
    50% { transform: translateY(0) translateX(0) scale(1); opacity: .85; }
    75% { transform: translateY(6px) translateX(-3px) scale(0.94); opacity: .9; }
    100% { transform: translateY(0) translateX(0) scale(1); opacity: .9; }
  }
  @keyframes kenBurns {
    0% { transform: scale(1) translate3d(0,0,0); }
    50% { transform: scale(1.06) translate3d(0, -1%, 0); }
    100% { transform: scale(1) translate3d(0,0,0); }
  }
  @keyframes fadeDown {
    0% { opacity: 0; transform: translateY(-8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatBlob {
    0% { transform: translateY(0) translateX(0) scale(1); }
    25% { transform: translateY(-10px) translateX(6px) scale(1.04); }
    50% { transform: translateY(0) translateX(0) scale(1); }
    75% { transform: translateY(10px) translateX(-6px) scale(0.96); }
    100% { transform: translateY(0) translateX(0) scale(1); }
  }
`}</style>

        </div>
      </section>

      {/* ---------- Adventure Ideas bg-[#afb3b4]  ---------- */}
      <section className="text-center bg-[#afb3b4] -my-2 py-20">
        <p className="font-licorice text-teal-600 text-5xl font-semibold">Take yourself</p>
        <h2 className="text-3xl font-bold mb-12">Adventure Ideas</h2>

        <div className="flex flex-nowrap justify-center gap-0">
          {[
            {
              title: "Zip Lines",
              img: "src/zip.jpg",
              desc: "Add some adrenalin to your travel senses by zipline travel.",
            },
            {
              title: "Kayaking",
              img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
              desc: "Kayaking takes thrill to the next level.",
            },
            {
              title: "Bungee Jump",
              img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
              desc: "Bungee jump is one of the most exhilarating adventures.",
            },
            {
              title: "Canoeing",
              img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              desc: "Just sail in the calm waters of the sea with complete safety.",
            },
          ].map((idea) => (
            <div key={idea.title} className="max-w-xs transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]">
              <img
                src={idea.img}
                alt={idea.title}
                className="w-40 h-40 mx-auto rounded-full object-cover mb-4 shadow-[0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              />
              <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
              <p className="text-gray-600 mb-4">{idea.desc}</p>
              
            </div>
          ))}
        </div>
      </section>


      {/*----------div------------- */}
    <section className="bg-[#afb3b4] py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-licorice  md:text-6xl font-semibold text-teal-800">
         Features to replace all your other tools
        </h2>
        

        {/* Grid Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl  mx-[400px] h-40 w-40  border-2 border-[#f1ede4]  bg-[url('src/bgm1.jpg')] bg-cover bg-center p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
              
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-[#f1ede4] p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
              Add places from guides with 1 click
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              We crawled the web so you don’t have to. Easily add mentioned places to your plan.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl  bg-[#d8c9b3] p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
              Import flight and hotel reservations 
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Connect or forward your emails to get it magically added into your trip plan.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border-2 border-[#d8c9b3] bg-[url('src/bgm2.jpg')] bg-cover bg-center h-40 w-40  p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
            </p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 5 */}
          <div className="rounded-2xl mx-[400px] h-40 w-40 border-2 border-[#f1ede4]  bg-[url('src/bgm3.png')] bg-cover bg-center p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
              
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl bg-[#f1ede4] p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
              Checklists for anything
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Stay organized with a packing list, to-do list, shopping list, any kind of list            </p>
          </div>

          {/* Card 7 */}
          <div className="rounded-2xl bg-[#d8c9b3] p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
              Import flight and hotel reservations 
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Connect or forward your emails to get it magically added into your trip plan.
            </p>
          </div>

          {/* Card 8 */}
          <div className="rounded-2xl border-2 border-[#d8c9b3] bg-[url('src/bgm4.png')] bg-cover bg-center h-40 w-40 p-8 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,0,0,0.12)]">
            <h3 className="text-lg font-semibold text-gray-900">
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
            </p>
          </div>
        </div>
      </div>
    </section>


     <section className="relative flex flex-col bg-[#afb3b4] md:flex-row items-center justify-between px-8 md:px-24 py-20  overflow-hidden">
      {/* Background abstract shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-70 -z-10 translate-x-[-50px] translate-y-[-80px]"></div>
      <div className="absolute top-16 right-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-70 -z-10 translate-x-[120px]"></div>

      {/* Left Text Section */}
      <div className="md:w-1/2 text-left mb-10 md:mb-0">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-snug">
          Making <span className="text-gray-900">Adventure tours,</span>
          <br /> activities affordable.
        </h2>
        <div className="w-12 h-[2px] bg-green-700 mb-6"></div>
        <p className="text-gray-600 text-base leading-relaxed max-w-md">
          Find an adventure, create a hobby that is related to nature in its very
          pristine shape for your goodness. Tempor incididunt ut labore. Et dolore magna
          aliqua. Quis ipsum suspendisse ultrices gravida.
        </p>
        <button className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800">
            Read More
          </button>
      </div>

      {/* Right Image Section */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Adventure"
          className="rounded-lg shadow-md w-full md:w-[420px] object-cover"
        />
      </div>
    </section>

    <TripItinerarySection/>

    {/* Modal Overlay */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleModal}>
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button 
            onClick={toggleModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>

          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? 'Log in to Wanderlog' : 'Sign up to take your trip planning to the next level'}
          </h2>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => (window.location.href = "http://localhost:5000/api/auth/google")}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLogin ? 'Log in with Google' : 'Sign up with Google'}
            </button>

          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isLogin ? 'Log in' : 'Sign up with email'}
            </button>
          </form>

          {/* Switch between login/signup */}
          <div className="mt-6 text-center">
            {isLogin ? (
              <p className="text-sm text-gray-600">
                Don't have an account yet?{' '}
                <button onClick={switchToSignup} className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={switchToLogin} className="text-blue-600 hover:text-blue-800 font-medium">
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
        } />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/account" element={<MyAccount />} />
      </Routes>
    </Router>
  );
};

export default App;

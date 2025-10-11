import React from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: "url('/src/bgabout.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6 text-white">
        <Link to="/" className="text-white group">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.8)] transition-all duration-300 tracking-wider">
            WANDERLY
          </h1>
        </Link>
        <ul className="flex space-x-8">
          <li>
            <Link to="/" className="hover:text-yellow-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-400 transition duration-300">
              About
            </Link>
          </li>
          {/* <li>
            <Link to="/contactus" className="hover:text-yellow-400 transition duration-300">
              Contact
            </Link>
          </li> */}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Get in touch with our team for any questions or support
            </p>
          </div>

          {/* Contact Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto opacity-0 animate-fadeInUp" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
            <div className="text-center">
              {/* Team Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Aadya */}
                  <div className="text-center">
                    <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-4 ring-blue-500/30 shadow-[0_10px_30px_rgba(59,130,246,0.3)] mb-3">
                      <img 
                        src="public/aadya.jpg" 
                        alt="Aadya" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Aadya</h3>
                    <p className="text-gray-600 text-sm">Frontend</p>
                  </div>

                  {/* Gouri */}
                  <div className="text-center">
                    <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.3)] mb-3">
                      <img 
                        src="public/gouri.jpg" 
                        alt="Gouri" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Gouri</h3>
                    <p className="text-gray-600 text-sm">Backend</p>
                  </div>

                  {/* Jigyasa */}
                  <div className="text-center">
                    <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-4 ring-pink-500/30 shadow-[0_10px_30px_rgba(236,72,153,0.3)] mb-3">
                      <img 
                        src="public/jigyasa.jpg" 
                        alt="Jigyasa" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Jigyasa</h3>
                    <p className="text-gray-600 text-sm">Backend</p>
                  </div>
                </div>
              </div>

              

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Contact
                </h3>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <a 
                    href="mailto:aadya.20244001@mnnit.ac.in"
                    className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200 break-all"
                  >
                    aadya.20244001@mnnit.ac.in
                  </a>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                  {/* <a 
                    href="mailto:aadya.20244001@mnnit.ac.in"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </a> */}
                  
                  <button 
                    onClick={() => navigator.clipboard.writeText('aadya.20244001@mnnit.ac.in')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <div className="mt-6 text-gray-600">
                <p className="text-sm">
                  We typically respond within 24 hours. For urgent matters, please mention "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS Animations */}
      <style jsx>{`
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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

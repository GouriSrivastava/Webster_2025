import React from "react";
import { Link } from "react-router-dom";

const teamMembers = [
  { name: "Aadya", role: "Frontend", img: "public/aadya.jpg" },
  { name: "Gouri", role: "Backend", img: "public/gouri.jpg" },
  { name: "Jigyasa", role: "Backend", img: "public/jigyasa.jpg" },
];

const About = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: "url('public/Task.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      <nav className="relative z-10 flex justify-between items-center px-10 py-6 text-white">
        
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.8)] transition-all duration-300 tracking-wider">
            WANDERLY
          </h1>
        
        <ul className="flex space-x-8">
        
          <li>
                      <Link to="/contactus" className="hover:text-yellow-400 transition duration-300">
                        Contact
                      </Link>
                    </li>
        </ul>
      </nav>

      <main className="relative z-10 px-6 md:px-12 py-16 md:py-24">
        {/* Section header */}
        <div className="text-center text-white mb-12">
          <h2 className="text-pink-800 tracking-[0.3em] text-6xl md:text-4xl font-extrabold mb-2">DEVELOPER SECTION</h2>
          <p className="text-white/70">Meet the minds behind Wanderly</p>
        </div>

        {/* Timeline layout */}
        <section className="relative max-w-6xl mx-auto animate-fadeInUp">
          {/* center vertical line */}
          <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-400/40 via-white/15 to-fuchsia-400/40"></span>

          {/* Items */}
          <div className="space-y-16 md:space-y-24">
            {/* Row 1 - Aadya profile center, about card on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* left spacer */}
              <div className="hidden md:block"></div>
              {/* Right card */}
              <div className="md:pl-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 text-white transition-transform duration-300 hover:-translate-y-1 animate-cardIn" style={{animationDelay:'120ms'}}>
                  <h3 className="flex items-center text-lg font-semibold mb-3"><span className="mr-2">🏆</span> About</h3>
                  <ul className="space-y-3 text-white/90 list-none">
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-cyan-400"></span>Full‑stack MERN developer with strong React, Node.js and MongoDB</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-cyan-400"></span>Frontend specialist focused on UX and performance</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-cyan-400"></span>MNNIT ALUMNI ASSOCIATION DESIGNER</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-cyan-400"></span>ECE CR</li>
                  </ul>
                </div>
              </div>

              {/* Center avatar on the line */}
              <div className="md:col-span-2 relative flex justify-center -mt-40 md:-mt-96 z-20">
                <div className="relative flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full overflow-hidden ring-2 ring-white/20 shadow-[0_6px_20px_rgba(168,85,247,0.35)]">
                    <img src={teamMembers[0].img} alt={teamMembers[0].name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-3 text-center text-white">
                    <div className="text-xl font-semibold">{teamMembers[0].name}</div>
                    <div className="text-pink-300 text-sm font-semibold">{teamMembers[0].role}</div>
                  </div>
                  {/* dot on line */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)] animate-glowPulse"></span>
                </div>
              </div>
            </div>

            {/* Row 2 - About card on left, profile for Gouri */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-8 items-center">
              {/* Left card */}
              <div className="md:pr-12 order-2 md:order-1">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 text-white transition-transform duration-300 hover:-translate-y-1 animate-cardIn" style={{animationDelay:'220ms'}}>
                  <h3 className="flex items-center text-lg font-semibold mb-3"><span className="mr-2">🏆</span> About</h3>
                  <ul className="space-y-3 text-white/90 list-none">
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-blue-400"></span>Full‑stack MERN developer with strong React, Node.js and MongoDB</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-blue-400"></span>Tailwind and React component systems</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-blue-400"></span>MNNIT ALUMNI ASSOCIATION MENTOR</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-blue-400"></span>SMP MENTOR</li>
                  </ul>
                </div>
              </div>
              {/* right spacer */}
              <div className="hidden md:block order-1 md:order-2"></div>

              {/* Center avatar */}
              <div className="md:col-span-2 relative flex justify-center mt-72 md:-mt-16">
                <div className="relative flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full overflow-hidden ring-2 ring-white/20 shadow-[0_6px_20px_rgba(34,211,238,0.35)]">
                    <img src={teamMembers[1].img} alt={teamMembers[1].name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-3 text-center text-white">
                    <div className="text-xl font-semibold">{teamMembers[1].name}</div>
                    <div className="text-pink-300 text-sm font-semibold">{teamMembers[1].role}</div>
                  </div>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-glowPulse"></span>
                </div>
              </div>
            </div>

            {/* Row 3 - About card on right, profile for Jigyasa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* right card */}
              <div className="hidden md:block"></div>
              <div className="md:pl-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-6 text-white transition-transform duration-300 hover:-translate-y-1 animate-cardIn" style={{animationDelay:'320ms'}}>
                  <h3 className="flex items-center text-lg font-semibold mb-3"><span className="mr-2">🏆</span> About</h3>
                  <ul className="space-y-3 text-white/90 list-none">
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-fuchsia-400"></span>Full‑stack MERN developer with strong React, Node.js and MongoDB</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-fuchsia-400"></span>Tailwind and React component systems</li>
                    <li className="flex items-start"><span className="mt-2 mr-3 h-2 w-2 rounded-full bg-fuchsia-400"></span>DARPAN- DRAMA COMMITTE MEMBER</li>
                  </ul>
                </div>
              </div>

              {/* Center avatar */}
              <div className="md:col-span-2 relative flex justify-center -mt-12 md:-mt-16">
                <div className="relative flex flex-col items-center">
                  <div className="h-32 w-32 rounded-full overflow-hidden ring-2 ring-white/20 shadow-[0_6px_20px_rgba(244,114,182,0.35)]">
                    <img src={teamMembers[2].img} alt={teamMembers[2].name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-3 text-center text-white">
                    <div className="text-xl font-semibold">{teamMembers[2].name}</div>
                    <div className="text-pink-300 text-sm font-semibold">{teamMembers[2].role}</div>
                  </div>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.9)] animate-glowPulse"></span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA footer like the screenshot */}
          
        </section>
      </main>

      {/* Local animations for this page */}
      <style jsx>{`
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.25);} 50% { box-shadow: 0 0 18px rgba(255,255,255,0.55);} }
        @keyframes cardIn { 0% { opacity: 0; transform: translateY(12px);} 100% { opacity: 1; transform: translateY(0);} }
        .animate-fadeInUp { animation: fadeInUp 700ms ease-out both; }
        .animate-glowPulse { animation: glowPulse 1.8s ease-in-out infinite; }
        .animate-cardIn { animation: cardIn 600ms ease-out both; }
      `}</style>
    </div>
  );
};

export default About;



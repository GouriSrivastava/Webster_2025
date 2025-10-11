import React from "react";

export default function TripItinerarySection() {
 
  const sections = [
    {
      img: "/src/nex1.jpg",
      title: "See top attractions and restaurants from the entire web",
      text: "Get recommended the top places to visit and the best restaurants. Get ratings for top attractions, check their opening hours, and access links to official websites. We’ve gathered the top attractions from across the web in one place so you can see what are the consensus picks.",
    },
  
    {
      img: "/src/nex2.jpg",
      title: "Plan smarter with AI-powered suggestions",
      text: "Automatically discover the best attractions and hidden gems near your destination. Our AI helps you find experiences tailored to your interests and travel style.",
    },
    {
      img: "/src/nex3.jpg",
      title: "See top attractions and restaurants from the entire web",
      text: "Share your itinerary with others and edit it together. Everyone can add attractions, leave comments, and make adjustments to build the perfect trip together.",
    },
    {
      img: "/src/nex4.png",
      title: "Manage your reservations with ease",
      text: "View your flights, hotels, and reservations in one place. No more searching through emails — everything is linked directly to your trip plan.",
    },
    {
      img: "/src/nex5.jpg",
      title: "Pack and budget efficiently",
      text: "View your flights, hotels, and reservations in one place. No more searching through emails — everything is linked directly to your trip plan.",
    },
  ];

  return (
    <div className="bg-[#afb3b4]">
      {sections.map((section, index) => (
        <section
          key={index}
          className={`flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-20 ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={section.img}
              alt={section.title}
              className="rounded-2xl shadow-xl w-[90%] md:w-[80%] object-cover"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0 md:px-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              {section.text}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}

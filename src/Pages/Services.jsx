import React from "react";
import {
  FaWifi,
  FaUtensils,
  FaConciergeBell,
  FaSwimmingPool,
  FaSpa,
  FaShuttleVan,
} from "react-icons/fa";
import Header from "./user/Header";
const services = [
  {
    icon: <FaWifi size={32} />,
    title: "Free Wi-Fi",
    desc: "High-speed internet in all rooms and public areas.",
  },
  {
    icon: <FaUtensils size={32} />,
    title: "Restaurant",
    desc: "Enjoy delicious cuisine at our in-house restaurant.",
  },
  {
    icon: <FaConciergeBell size={32} />,
    title: "24/7 Service",
    desc: "Our team is here to help you at any time.",
  },
  {
    icon: <FaSwimmingPool size={32} />,
    title: "Swimming Pool",
    desc: "Relax and unwind in our outdoor pool.",
  },
  {
    icon: <FaSpa size={32} />,
    title: "Spa & Wellness",
    desc: "Rejuvenate with our premium spa services.",
  },
  {
    icon: <FaShuttleVan size={32} />,
    title: "Airport Shuttle",
    desc: "Free pick-up and drop-off services available.",
  },
];

const Services = () => {
  return (
    <div>
      {/* Top Navigation */}
      <div>
        <Header />
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 text-center border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

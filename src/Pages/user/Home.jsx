import React, { useState, useRef, useEffect } from "react";
import AnimatedLoader from "../../components/AnimatedLoader"; // Adjust path if needed
import carouselImg1 from "../../assets/Home/pexels.jpg";
import room1 from "../../assets/Images/About Images/room-1.jpg";
import room2 from "../../assets/Images/About Images/room-2.jpg";
import room3 from "../../assets/Images/About Images/room-3.jpg";
import Header from "./Header";
import "animate.css";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HomeSearchBar from "./HomeSearchBar";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: icon library

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (e.g., API call)
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2s fade
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();
  const [videoSrc, setVideoSrc] = useState(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (type, delta) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const getSummary = () => {
    const total = Object.entries(guests)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => `${count} ${key}`)
      .join(", ");
    return total || "Select Guests";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleVideoOpen = (src) => {
    setVideoSrc(src);
  };

  const handleVideoClose = () => {
    setVideoSrc(null);
  };
  const rooms = [
    {
      image: room1,
      title: "Junior Suite",
      delay: "0.1s",
    },
    {
      image: room2,
      title: "Executive Suite",
      delay: "0.3s",
    },
    {
      image: room3,
      title: "Super Deluxe",
      delay: "0.6s",
    },
  ];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 1150; // Adjust to match card width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };


  const destinations = [
    { name: "Pondicherry", image: "src/assets/Popular destinations/Pondicherry.jpg" },
    { name: "Auroville", image: "src/assets/Popular destinations/Auroville.jpeg" },
    { name: "Kerala", image: "src/assets/Popular destinations/Kerala.webp" },
    { name: "bangalore", image: "src/assets/Popular destinations/bangalore.webp" },
    { name: "Mysore", image: "src/assets/Popular destinations/mysore.webp" },
    { name: "Pondicherry", image: "src/assets/Popular destinations/Pondicherry.jpg" },
    { name: "Auroville", image: "src/assets/Popular destinations/Auroville.jpeg" },
    { name: "Kerala", image: "src/assets/Popular destinations/Kerala.webp" },
    { name: "bangalore", image: "src/assets/Popular destinations/bangalore.webp" },
    { name: "Mysore", image: "src/assets/Popular destinations/mysore.webp" },
  ];
  const destination = [
    { name: "Pondicherry", image: "src/assets/Popular destinations/Pondicherry.jpg" },
    { name: "Auroville", image: "src/assets/Popular destinations/Auroville.jpeg" },
    { name: "Kerala", image: "src/assets/Popular destinations/Kerala.webp" },
    { name: "bangalore", image: "src/assets/Popular destinations/bangalore.webp" },
    { name: "Mysore", image: "src/assets/Popular destinations/mysore.webp" },
  ];
  if (loading) {
    return (
      <div className="flex items-center justify-center ml-50 w-80 h-80 ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="a8"><stop offset="0" stop-color="#071B35" stop-opacity="0"></stop><stop offset="1" stop-color="#071B35"></stop></linearGradient><circle fill="none" stroke="url(#a8)" stroke-width="15" stroke-linecap="round" stroke-dasharray="0 44 0 44 0 44 0 44 0 360" cx="100" cy="100" r="70" transform-origin="center"><animateTransform type="rotate" attributeName="transform" calcMode="discrete" dur="0.8" values="360;324;288;252;216;180;144;108;72;36" repeatCount="indefinite"></animateTransform></circle></svg>      </div>
    );
  }
  return (
    <motion.div
      className="bg-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Header  */}
      <Header />
      {/* Hero Section Start */}
      <div
        className="relative w-full bg-white bg-center bg-cover   h-full md:h-[180px] lg:h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${carouselImg1})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute  inset-0 h-200 bg-opacity-40 z-0" />
        {/* Centered Content */}
        <div className="relative z-10 flex flex-col  w-full px-4">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold ml-10 drop-shadow-lg">
            Where Every Stay Tells a Story
          </h1>
        </div>
      </div>
      {/* Floating Search Bar */}
      <div className=" flex   items-start bg-white justify-center bg-gray-50  -mt-14">
        <div className="w-full max-w-6xl rounded-full shadow-6xl px-8 py-6 flex flex-col justify-center min-h-[120px]">
          <HomeSearchBar />
        </div>
      </div>


      {/* Trending Destinations */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-1 animate__animated animate__fadeInUp" style={{ animationDelay: '1s' }}>Trending destinations</h2>
        <p className="text-gray-500 mb-8 text-lg animate__animated animate__fadeInUp" style={{ animationDelay: '1.2s' }}>Travelers searching for India also booked these</p>

        {/* Top 2 destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {destination.slice(0, 2).map((dest, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300  "
              style={{ animationDelay: `${1.4 + idx * 0.2}s` }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-64 object-cover group-hover:brightness-75 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold flex items-center gap-2 backdrop-blur-sm bg-white/10 px-2 py-2 rounded-lg">
                  {dest.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 3 destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {destination.slice(2).map((dest, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 "
              style={{ animationDelay: `${1.8 + idx * 0.2}s` }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-64 object-cover group-hover:brightness-75 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-lg">
                  {dest.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="relative max-w-6xl mx-auto px-4 mt-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 animate__animated animate__fadeInUp" style={{ animationDelay: '2.4s' }}>
          Popular Destinations
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-md border border-gray-200 hover:scale-105 hover:bg-white shadow-xl p-3 rounded-full transition duration-300 animate__animated animate__fadeInLeft"
            style={{ animationDelay: '2.6s' }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Scrollable list */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10"
          >
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 flex flex-col items-center animate__animated animate__fadeInUp"
                style={{ animationDelay: `${2.8 + index * 0.1}s` }}
              >
                <div className="transform hover:scale-105 transition-transform duration-500 ease-in-out rounded-2xl bg-white shadow-md overflow-hidden w-48 group">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-48 h-48 object-cover transition-transform duration-300 group-hover:scale-110 rounded-2xl"
                  />
                </div>
                <p className="mt-2 text-center text-gray-700 font-semibold">{dest.name}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-md border border-gray-200 hover:scale-105 hover:bg-white shadow-xl p-3 rounded-full transition duration-300 animate__animated animate__fadeInRight"
            style={{ animationDelay: '2.6s' }}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Hero Section End */}
      <div className="container-fluid bg-white">
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        ></div>

        <div className="py-10 mb-30 px-4 md:px-10">
          <div className="relative max-w-6xl mx-auto px-4 mt-10 mb-20 animate__animated animate__fadeInUp" style={{ animationDelay: '3.5s' }}>
            <p className="text-sm font-bold text-gray-800 mb-4">
              A hotelier is a dedicated professional who specializes in managing hotels, resorts, or hospitality businesses. Their role involves overseeing every aspect of hotel operations—from guest services and housekeeping to finance, marketing, and staff management. Hoteliers are passionate about hospitality and strive to create a welcoming environment where guests feel valued and comfortable. With a strong focus on customer satisfaction, attention to detail, and efficient management, hoteliers ensure that every guest experience is smooth, enjoyable, and memorable. In a fast-evolving travel industry, hoteliers also embrace innovation, sustainability, and personalized service to stay competitive and meet the growing expectations of modern travelers.
            </p>
          </div>

          <div className="max-w-6xl mx-auto border border-gray-300 rounded-3xl mt-10 overflow-hidden flex flex-col md:flex-row items-center animate__animated animate__fadeInUp" style={{ animationDelay: '3.8s' }}>
            {/* Left Image */}
            <div className="md:w-1/3 w-full">
              <img
                src="src\assets\Popular destinations\Gemini.png" // replace with your image path
                alt="Tropical destination"
                className=" object-cover w-full h-64 "
              />
            </div>

            {/* Content */}
            <div className="md:w-2/3 w-full md:pl-10 pt-6 md:pt-0 flex flex-col md:flex-row justify-between items-center">
              <div className=" md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Go further with the Expedia app
                </h2>
                <p className="mt-2 text-gray-700 text-sm max-w-xl">
                  Save on select hotels and earn OneKeyCash on bookings in the app.
                  Our app deals help you to save on trips so you can travel more and
                  manage it all on the go.
                </p>

                <p className="mt-4 font-semibold text-black">
                  Scan the QR code with your device camera and download our app
                </p>
              </div>

              {/* QR Code */}
              <div className="mt-6 md:mt-0 md:ml-6">
                <img
                  src="src\assets\Home\unnamed.png" // replace with your QR code path
                  alt="QR Code"
                  className="w-32 h-32"
                />
              </div>
            </div>
          </div>

          {/* Video Modal */}
          {videoSrc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white w-4/5 md:w-3/4 lg:w-1/2 p-5">
                <button
                  className="absolute top-0 right-0 p-3 text-white"
                  onClick={handleVideoClose}
                >
                  X
                </button>
                <iframe
                  src={videoSrc}
                  title="Video"
                  className="w-full h-60"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </motion.div>
  );
};

export default Home;
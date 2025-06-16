import React, { useState, useRef, useEffect } from "react";
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
  return (
    <div className="bg-white">
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
        <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Trending destinations</h2>
        <p className="text-gray-500 mb-8 text-lg">Travelers searching for India also booked these</p>

        {/* Top 2 destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {destination.slice(0, 2).map((dest, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 group"
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
              className="relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 group"
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
        <h2 className="text-3xl font-bold  mb-8 text-gray-800">
          Popular Destinations
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-md border border-gray-200 hover:scale-105 hover:bg-white shadow-xl p-3 rounded-full transition duration-300"
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
                className="flex-shrink-0 w-48 flex flex-col items-center"
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
            className="absolute right-0  top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-md border border-gray-200 hover:scale-105 hover:bg-white shadow-xl p-3 rounded-full transition duration-300"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Hero Section End */}
      <div className="container-fluid bg-white ">
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        ></div>

        {/* <div className="mb-5 md:px-10 ">
          <div className="max-w-7xl mx-auto">
            <div
              className="text-center animate__animated animate__fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <h6 className="section-title font-semibold uppercase tracking-widest">
                <span className="text-[#FEA116] uppercase">Our Rooms</span>
              </h6>
              <h1 className="text-3xl md:text-5xl font-bold mb-10">
                Explore Our{" "}
                <span className="text-[#FEA116] uppercase">Rooms</span>
              </h1>
            </div>

            <div className="grid grid-cols-1  mt-10 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, idx) => (
                <div
                  key={idx}
                  className="animate__animated animate__fadeInUp w-full md:w-80 mx-auto"
                  style={{ animationDelay: room.delay }}
                >
                  <div className="rounded shadow-lg overflow-hidden bg-white">
                    <div className="relative">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-40 object-cover"
                      />

                    </div>

                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <h5 className="text-base font-semibold">
                          {room.title}
                        </h5>

                      </div>

                      <div className="flex flex-wrap text-xs text-gray-600 mb-2 gap-x-3 gap-y-1">
                        <span className="border-r pr-2">
                          <i className="fa fa-bed text-[#FEA116] mr-1"></i>3 Bed
                        </span>
                        <span className="border-r pr-2">
                          <i className="fa fa-bath text-[#FEA116] mr-1"></i>2
                          Bath
                        </span>
                        <span>
                          <i className="fa fa-wifi text-[#FEA116] mr-1"></i>Wifi
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mb-3 line-clamp-3">
                        Erat ipsum justo amet duo et elitr dolor, est duo duo
                        eos lorem sed diam stet diam sed stet lorem.
                      </p>

                      {/* <div className="flex justify-between">
                        <a
                          href="#"
                          className="text-white bg-[#FEA116] px-3 py-1.5 text-xs rounded hover:bg-[#e1920e]"
                        >
                          View Detail
                        </a>
                        <a
                          href="#"
                          className="text-white bg-gray-800 px-3 py-1.5 text-xs rounded hover:bg-black"
                        >
                          Book Now
                        </a>
                      </div> */}
        {/* </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Call to Action Section */}
        {/* <div className="py-16 px-4 md:px-10 bg-gradient-to-r from-[#fff7e6] to-[#ffe8b3] max-w-4xl mx-auto rounded-3xl border border-gray-300">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ready to Book Your Perfect Stay?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover our luxurious rooms and suites, each designed to provide the ultimate comfort and experience.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FEA116] text-white font-bold py-4 px-8 rounded-full shadow-xl hover:bg-[#e1920e] transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate("/rooms")}
            >
              Book Your Room Now
            </motion.button>
          </motion.div>
        </div> */}




        <div className="py-10 mb-30 px-4 md:px-10">
          {/* <div className="flex flex-wrap g-0">
            <div className="w-full md:w-1/2 bg-black flex items-center">
              <div className="p-5">
                <h6 className="text-white text-uppercase text-xl mb-3">
                  Luxury Living
                </h6>
                <h1 className="text-white text-3xl mb-4">
                  Discover A Brand Luxurious Hotel
                </h1>
                <p className="text-white mb-4">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                  sed stet lorem sit clita duo justo magna dolore erat amet
                </p>
                <a
                  href="#"
                  className="btn bg-blue-500 text-white py-3 px-5 mr-3"
                >
                  Our Rooms
                </a>
                <a href="#" className="btn bg-gray-200 text-gray-700 py-3 px-5">
                  Book A Room
                </a>
              </div>
            </div>
          </div> */}


          <div className="relative max-w-6xl mx-auto px-4 mt-10 mb-20" >
            <p className="text-sm font-bold text-gray-800 mb-4">
              A hotelier is a dedicated professional who specializes in managing hotels, resorts, or hospitality businesses. Their role involves overseeing every aspect of hotel operations—from guest services and housekeeping to finance, marketing, and staff management. Hoteliers are passionate about hospitality and strive to create a welcoming environment where guests feel valued and comfortable. With a strong focus on customer satisfaction, attention to detail, and efficient management, hoteliers ensure that every guest experience is smooth, enjoyable, and memorable. In a fast-evolving travel industry, hoteliers also embrace innovation, sustainability, and personalized service to stay competitive and meet the growing expectations of modern travelers.
            </p>
          </div>


          <div className="max-w-6xl mx-auto border border-gray-300 rounded-3xl mt-10 overflow-hidden flex flex-col md:flex-row items-center ">
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
                  Go further with the Hotelier app
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
    </div>
  );
};

export default Home;

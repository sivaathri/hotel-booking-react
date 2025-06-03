import React, { useState, useRef, useEffect } from "react";
import carouselImg1 from "../../assets/Home/Leo.jpg";
import room1 from "../../assets/Images/About Images/room-1.jpg";
import room2 from "../../assets/Images/About Images/room-2.jpg";
import room3 from "../../assets/Images/About Images/room-3.jpg";
import Header from "./Header";
import "animate.css";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HomeSearchBar from "./HomeSearchBar";

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
  const destinations = [
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
        className="relative w-full bg-white   h-full md:h-[180px] lg:h-[400px] flex items-center justify-center"
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
      <div className="max-w-7xl mx-auto bg-white px-4 py-8">
      <h2 className="text-2xl font-bold">Trending destinations</h2>
      <p className="text-gray-600 mb-6">Travelers searching for India also booked these</p>
      
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {destination.map((dest, idx) => (
          <div key={idx} className="relative rounded-xl overflow-hidden shadow-md">
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-2 left-2  px-3 py-1 rounded-md">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                {dest.name}
           
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Popular Destinations */}
      <div className="max-w-6xl   mt-10 bg-white mx-auto px-4 py-8">
      <h2 className="text-2xl  font-bold mb-4">Popular destinations</h2>
      <div className="flex flex-wrap gap-4">
        {destinations.map((dest, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={dest.image}
              alt={dest.name}
              className="w-40 h-40 object-cover rounded-xl shadow"
            />
            <p className="mt-2 text-gray-800 font-medium">{dest.name}</p>
          </div>
        ))}
      </div>
    </div>

      {/* Hero Section End */}
      <div className="container-fluid bg-white ">
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        ></div>

        <div className="mb-5 md:px-10 ">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="py-16 px-4 md:px-10 bg-gradient-to-r from-[#fff7e6] to-[#ffe8b3] max-w-4xl mx-auto rounded-3xl border border-gray-300">
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
        </div>




        <div className="py-10 mb-30 px-4 md:px-10">
          <div className="flex flex-wrap g-0">
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
          </div>
          <div className="max-w-6xl mx-auto border border-gray-300 rounded-3xl mt-10 overflow-hidden flex flex-col md:flex-row items-center ">
            {/* Left Image */}
            <div className="md:w-1/3 w-full">
              <img
                src="src\assets\Home\Gemini.png" // replace with your image path
                alt="Tropical destination"
                className=" object-cover w-full h-64 "
              />
            </div>

            {/* Content */}
            <div className="md:w-2/3 w-full md:pl-10 pt-6 md:pt-0 flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Go further with the Expedia app
                </h2>
                <p className="mt-3 text-gray-700 max-w-xl">
                  Save on select hotels and earn OneKeyCash on bookings in the app.
                  Our app deals help you to save on trips so you can travel more and
                  manage it all on the go.
                </p>
                <p className="mt-4 font-semibold text-indigo-800">
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

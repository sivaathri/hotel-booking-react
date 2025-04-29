import React, { useState, useRef, useEffect } from "react";
import carouselImg1 from "../../assets/Images/About Images/carousel-1.jpg";
import carouselImg2 from "../../assets/Images/About Images/carousel-2.jpg";

import room1 from "../../assets/Images/About Images/room-1.jpg";
import room2 from "../../assets/Images/About Images/room-2.jpg";
import room3 from "../../assets/Images/About Images/room-3.jpg";
import Header from "./Header";
import "animate.css";
import Footer from "./Footer";
import { motion } from "framer-motion";

const Home = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,

  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (type, delta) => {
    setGuests(prev => ({
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
  return (
    <>
      {/* Header  */}
      <Header />
      {/* Header End */}
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active relative" style={{ height: "500px" }}>
              <img
                className="w-100 h-100 object-cover"
                src={carouselImg1}
                alt="Luxury Hotel 1"
              />

              {/* Overlay Content */}
              <div className="absolute top-0 left-0 w-full h-full flex items-start">
                <div className="container mt-12 sm:mt-16 md:mt-20">
                  <div className="p-3 pt-8 sm:pt-12" style={{ maxWidth: "900px" }}>
                    <h1
                      className="text-white mb-4 mt-0 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"

                    >
                      Find The Right Hotel Today
                    </h1>
                  </div>
                </div>
              </div>
            </div>


            <div className="carousel-item active relative" style={{ height: "500px" }}>
              <img
                className="w-100 h-100 object-cover"
                src={carouselImg2}
                alt="Luxury Hotel 1"
              />

              {/* Overlay Content */}
              <div className="absolute top-0 left-0 w-full h-full flex items-start">
                <div className="container mt-12 sm:mt-16 md:mt-20">
                  <div className="p-3 pt-8 sm:pt-12" style={{ maxWidth: "900px" }}>
                    <h1
                      className="text-white mb-4 mt-0 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                    >
                      Find The Right Hotel Today
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span
              className="mr-10 carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span
              className="ml-10 carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Carousel End */}
        <div className="w-full flex justify-center items-center absolute top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="container mx-auto bg-[#101828] bg-opacity-95 shadow-3xl p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6  ">
            {/* Destination */}
            <div className="flex flex-col w-full md:w-1/4">
              <label className="block text-white text-sm font-medium mb-1">Enter Destination</label>
              <input
                type="text"
                placeholder="Location"
                className="w-full border border-white rounded-lg bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Check-in */}
            <div className="flex flex-col w-full md:w-1/4">
              <label className="block text-white text-sm font-medium mb-1">Check-in</label>
              <input
                type="date"
                className="w-full border border-white rounded-lg bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100"
              />
            </div>
            {/* Check-out */}
            <div className="flex flex-col w-full md:w-1/4">
              <label className="block text-white text-sm font-medium mb-1">Check-out</label>
              <input
                type="date"
                className="w-full border border-white rounded-lg px-4 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Guests */}
            <div className="flex flex-col w-full md:w-1/4 relative" ref={dropdownRef}>
              <label className="block text-white text-sm font-medium mb-1">Rooms & Guests</label>
              <input
                readOnly
                onClick={() => setIsOpen(!isOpen)}
                value={getSummary()}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-gray-700 focus:outline-none cursor-pointer"
              />
              {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white p-4 rounded-lg shadow-md z-10">
                  {['adults', 'children'].map(type => (
                    <div key={type} className="flex justify-between items-center mb-2">
                      <span className="capitalize text-gray-700">{type}</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                          onClick={() => handleChange(type, -1)}
                        >
                          -
                        </button>
                        <span>{guests[type]}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                          onClick={() => handleChange(type, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Search Button */}
            <div className="flex items-end w-full md:w-auto">
              <button className="w-full md:w-auto rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-8 shadow-md transition duration-200 mt-4 md:mt-0">
                Search
              </button>
            </div>
          </div>
        </div>



        <div className="mt-50 py-10 px-4 md:px-10 bg-white">
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

            <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <small className="absolute left-4 top-[calc(100%-0.75rem)] transform -translate-y-1/2 bg-[#FEA116] text-white text-sm px-3 py-1 rounded shadow">
                        $100/Night
                      </small>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <h5 className="text-base font-semibold">{room.title}</h5>
                        <div className="space-x-1 text-[#FEA116]">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <i key={i} className="fa fa-star text-sm" />
                            ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap text-xs text-gray-600 mb-2 gap-x-3 gap-y-1">
                        <span className="border-r pr-2">
                          <i className="fa fa-bed text-[#FEA116] mr-1"></i>3 Bed
                        </span>
                        <span className="border-r pr-2">
                          <i className="fa fa-bath text-[#FEA116] mr-1"></i>2 Bath
                        </span>
                        <span>
                          <i className="fa fa-wifi text-[#FEA116] mr-1"></i>Wifi
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mb-3 line-clamp-3">
                        Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed
                        diam stet diam sed stet lorem.
                      </p>

                      <div className="flex justify-between">
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
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="py-16 px-4 md:px-10 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-md">
              Ready to Book Your Perfect Stay?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover our luxurious rooms and suites, each designed to provide the ultimate comfort and experience.
            </p>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full shadow-2xl hover:bg-yellow-50 hover:text-pink-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Book Your Room Now
            </motion.button>
          </div>
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
    </>
  );
};

export default Home;

import React, { useState } from "react";
import carouselImg1 from "../../assets/Leonardo_Phoenix.jpg";
import carouselImg2 from "../../assets/Images/About Images/carousel-2.jpg";
import about1 from "../../assets/Images/About Images/about-1.jpg";
import about2 from "../../assets/Images/About Images/about-2.jpg";
import about3 from "../../assets/Images/About Images/about-3.jpg";
import about4 from "../../assets/Images/About Images/about-4.jpg";
import { FaHotel, FaUsers, FaUsersCog } from "react-icons/fa";
import room1 from "../../assets/Images/About Images/room-1.jpg";
import room2 from "../../assets/Images/About Images/room-2.jpg";
import room3 from "../../assets/Images/About Images/room-3.jpg";
import Header from "./Header";
import "animate.css";
import Footer from "./Footer";

const Home = () => {
  const [videoSrc, setVideoSrc] = useState(null);

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
            <div className="carousel-item active position-relative" style={{ height: "500px" }}>
              <img
                className="w-100 h-100 object-fit-cover"
                src={carouselImg1}
                alt="Luxury Hotel 1"
                style={{ objectFit: "cover" }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-start">
                <div className="container mt-5 pt-5">
                  <div className="p-3" style={{ maxWidth: "900px", paddingTop: "50px" }}>
                    <h1 className="display-3 text-white mb-4"
                      style={{
                        fontSize: "60px",
                        fontWeight: "700",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                      }}>
                      Find The Right Hotel Today
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="carousel-item position-relative" style={{ height: "500px" }}>
              <img
                className="w-100 h-100 object-fit-cover"
                src={carouselImg2}
                alt="Luxury Hotel 2"
                style={{ objectFit: "cover" }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
                <div className="container">
                  <div className="p-3" style={{ maxWidth: "700px" }}>
                    <h1 className="display-3 text-white mb-4" 
                        style={{ 
                          fontSize: "60px", 
                          fontWeight: "700",
                          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                        }}>
                      Discover Luxury & Comfort
                    </h1>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
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
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button> */}
        </div>

        {/* Carousel End */}
        <div className="w-full pb-0 animate-fadeIn">

          <div className="container mx-auto px-4">
            <div className="bg-dark shadow-3xl p-8 rounded-2xl  relative border z-20  border-gray-100 -mt-75 z-20 relative">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Left: Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Enter Destination */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Enter Destination</label>
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full border border-white- rounded-lg bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Check-in */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Check-in</label>
                    <input
                      type="date"
                      className="w-full border border-white- rounded-lg bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Check-out */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Check-out</label>
                    <input
                      type="date"
                      className="w-full border border-white- rounded-lg px-4 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Adults */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Rooms&Guests</label>
                    <select className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Adult</option>
                      <option value="1">Adult 1</option>
                      <option value="2">Adult 2</option>
                      <option value="3">Adult 3</option>
                    </select>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="w-full  md:w-40">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200">
                    Submit
                  </button>
                </div>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <div className="w-full md:w-1/2">
              <div className="relative">
                <button
                  type="button"
                  className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 btn-play"
                  onClick={() =>
                    handleVideoOpen("https://www.youtube.com/embed/DWRcNpR6Kdc")
                  }
                >
                  <span className="text-white text-4xl">▶</span>
                </button>
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

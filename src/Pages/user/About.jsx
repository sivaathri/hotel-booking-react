import {useEffect} from "react";
import Header from "./Header";
import roomImage from "../../assets/Images/About Images/Gemini_Generated_Image_pfz6zqpfz6zqpfz6.jpeg";
import AOS from "aos";
import "aos/dist/aos.css";
const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div>
      {/* Top Navigation */}
      <Header />

      {/* About Section */}
      <section className="bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Room Booking - Text left, image right */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                🛏️ Room Booking
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Easily browse and book comfortable, verified hotel rooms that
                suit your budget and preferences. We partner with trusted hotels
                to ensure you get the best amenities and a smooth check-in
                experience.
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0" data-aos="fade-up">
              <img
                src={roomImage}
                alt="Room booking service"
                className="rounded-2xl shadow-xl w-full max-h-[400px] object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>

          {/* Bike & Car Rentals - Text right, image left */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16">
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                🛵 Bike & 🚗 Car Rentals
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Explore the city your way! Choose from our wide range of
                two-wheelers and four-wheelers at affordable rates. Our rental
                services are fast, flexible, and available in multiple locations
                for your convenience.
              </p>
            </div>

    <div className="md:w-1/2 mt-8 md:mt-0" data-aos="fade-up">
              <img
                src={roomImage}
                alt="Vehicle rental service"
                className="rounded-2xl shadow-xl w-full max-h-[400px] object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>

          {/* Food Details - Text left, image right */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            0
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                🍽️ Food Details
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Wondering what's on the menu before you check in? Discover
                detailed food options, from local cuisine to hotel specialties,
                so you know exactly what to expect at your chosen hotel.
              </p>
            </div>
    <div className="md:w-1/2 mt-8 md:mt-0" data-aos="fade-up">
              <img
                src={roomImage}
                alt="Food service details"
                className="rounded-2xl shadow-xl w-full max-h-[400px] object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>

          {/* College IV Trip Booking - Text right, image left */}
          <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16">
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                🎓 College IV Trip Booking
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We specialize in organizing college industrial visits (IV) and
                group trips. From transport to accommodation, we make group
                planning stress-free, safe, and budget-friendly.
              </p>
            </div>

    <div className="md:w-1/2 mt-8 md:mt-0" data-aos="fade-up">
              <img
                src={roomImage}
                alt="College trip booking"
                className="rounded-2xl shadow-xl w-full max-h-[400px] object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

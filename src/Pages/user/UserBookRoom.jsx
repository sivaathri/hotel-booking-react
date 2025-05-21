import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarCheck,
  FaUser,
  FaChild,
  FaMoneyBillWave,
  FaBed,
  FaWifi,
  FaParking,
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "./Header";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper function to construct image URL
const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/400x320?text=No+Image";
  return `${API_URL}/assets/${path}`;
};

const UserBookRoom = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  // New state for form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "India",
    paperless: true,
    mainGuest: true,
    travelingForWork: false,
  });

  useEffect(() => {
    if (location.state) {
      console.log("Location state received in UserBookRoom:", location.state);

      // Validate the incoming state
      const requiredFields = [
        "propertyName",
        "propertyAddress",
        "facilities",
        "amenities",
        "rules",
        "rooms",
        "dates",
        "guests",
        "price",
      ];
      const missingFields = requiredFields.filter(
        (field) => !location.state[field]
      );

      if (missingFields.length > 0) {
        console.error(
          "Missing required fields in location state:",
          missingFields
        );
        // Redirect back to property details if critical data is missing
        navigate(`/property/${propertyId}`);
        return;
      }

      // Log detailed property information
      console.log("Property details from state:", {
        propertyName: location.state.propertyName,
        propertyAddress: location.state.propertyAddress,
        facilities: location.state.facilities,
        amenities: location.state.amenities,
        rules: location.state.rules,
      });

      // Set booking details with validated data
      setBookingDetails({
        ...location.state,
        // Ensure these fields have default values if undefined
        facilities: location.state.facilities || {},
        amenities: location.state.amenities || [],
        rules: location.state.rules || {},
      });
    } else {
      console.log("No location state found, redirecting back to property");
      navigate(`/property/${propertyId}`);
    }
  }, [location.state, propertyId, navigate]);

  if (!bookingDetails) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </>
    );
  }

  const {
    rooms,
    dates,
    guests,
    price,
    propertyName,
    propertyType,
    propertyAddress,
    facilities,
    amenities,
    rules,
  } = bookingDetails;
  console.log("Property Details:", {
    propertyName,
    propertyType,
    propertyAddress,
    facilities,
    amenities,
    rules,
  });

  // Calculate number of nights between check-in and check-out
  const calculateNights = () => {
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const numberOfNights = calculateNights();

  // Calculate total price for each room
  const calculateRoomPrice = (room) => {
    const basePrice = room.price?.basePrice || 0;
    console.log("Calculating room price:", {
      roomType: room.room_type,
      basePrice,
      selectedCount: room.selectedCount,
    });
    return basePrice;
  };

  // Calculate total base price
  const totalBasePrice = rooms.reduce((total, room) => {
    const roomPrice = calculateRoomPrice(room);
    const roomTotal = roomPrice * room.selectedCount;
    console.log("Room total:", {
      roomType: room.room_type,
      roomPrice,
      selectedCount: room.selectedCount,
      roomTotal,
    });
    return total + roomTotal;
  }, 0);

  // Use the GST amount and final price from the passed state
  const gstAmount = price.gstAmount;
  const finalPrice = price.finalPrice;
  const gstRate = totalBasePrice <= 7500 ? 0.12 : 0.18;

  console.log("Price summary:", {
    totalBasePrice,
    gstAmount,
    finalPrice,
    gstRate,
  });

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${Math.max(0, amount).toLocaleString("en-IN")}`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Get the first room's image if available
  const propertyImage = bookingDetails?.rooms?.[0]?.image_urls?.[0]
    ? getImageUrl(bookingDetails.rooms[0].image_urls[0])
    : "https://placehold.co/400x320?text=No+Image";

  return (
    <>
      <Header />
      {/* Price Summary - Redesigned */}
      <div className="fixed mt-6  right-9 w-96 z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-blue-100 shadow-2xl transform hover:scale-105 transition-transform duration-300"
        >
          <div className="space-y-5 text-sm p-4 rounded-xl">
            <div className="flex items-center gap-4">
              {/* Property Image */}
              <div className="flex-shrink-0">
                <img
                  src={propertyImage}
                  alt={propertyName}
                  className="w-28 h-22 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x320?text=No+Image";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-xl text-gray-800">
                  {propertyName}
                </div>
                <div className="text-gray-800">{propertyType}</div>
              </div>
            </div>

            <div className="border-b border-gray-200 my-3"></div>
            <div className="font-bold text-xl text-gray-800">
              {" "}
              Price Summary
            </div>
            <div className="flex justify-between text-gray-600">
              <span>
                Price for {numberOfNights}{" "}
                {numberOfNights === 1 ? "night" : "nights"}{" "}
              </span>
              <span className="font-medium">
                {formatCurrency(totalBasePrice)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes </span>
              <span className="font-medium">₹{gstAmount}</span>
            </div>
            <div className="border-b border-gray-200 my-3"></div>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-xl text-gray-800"> Total (INR)</div>
              <div className="text-2xl font-bold text-blue-600 ">
                {formatCurrency(finalPrice)}
              </div>
            </div>

            <div className="text-sm text-gray-500  flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Includes all taxes and fees
            </div>
          </div>
        </motion.div>
      </div>
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar: Property & Price Summary - Enhanced */}
        <div className="md:col-span-1 space-y-6">
          {/* Property Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative">
              <div className="absolute mt-15 left-20 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Premium Property
              </div>
              <div className="text-xl text-gray-800 font-bold mb-3 mt-4">
                {propertyName}
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                <span className="text-sm">{propertyAddress}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  5.0 (120 reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm">
                  <FaWifi className="text-blue-500" /> Free Wifi
                </span>
                <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm">
                  <FaParking className="text-blue-500" /> Parking
                </span>
                <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm">
                  <FaBed className="text-blue-500" /> Luxury Rooms
                </span>
              </div>
            </div>
          </motion.div>

          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
          >
            <div className="flex items-center mb-6">
              <FaCalendarCheck className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                Booking Details
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">Check-in</div>
                  <div className="font-semibold text-gray-800">
                    {dates.checkIn}
                  </div>
                </div>
                <div className="h-12 w-px bg-blue-200"></div>
                <div>
                  <div className="text-sm text-gray-600">Check-out</div>
                  <div className="font-semibold text-gray-800">
                    {dates.checkOut}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-sm font-medium text-gray-800 mb-3">
                  Selected Rooms
                </div>
                {rooms.map((room, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">
                          {room.room_type.split("_")[0]}
                        </div>
                        <div className="text-sm text-gray-500">
                          x{room.selectedCount} rooms
                        </div>
                      </div>
                      <div className="text-blue-600 font-semibold">
                        {formatCurrency(calculateRoomPrice(room))}
                      </div>
                    </div>
                    {idx < rooms.length - 1 && (
                      <div className="border-b border-gray-100 my-2" />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Total Guests</div>
                  <div className="font-medium text-gray-800">
                    {guests.adults} adults, {guests.children} children
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UserBookRoom;

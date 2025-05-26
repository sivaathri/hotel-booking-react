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
  // Format date to show day of week and date (e.g., "Mon, 26 May")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    // Remove comma between day and date
    return formattedDate.replace(',', '');
  };

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
    const totalSelectedRooms = rooms.reduce((total, room) => total + (room.selectedCount || 0), 0);
  return (
    <>
      <Header />
      {/* Price Summary - Redesigned */}
      <div className="fixed mt-6 right-9 w-[450px] z-10 font-inter">

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-blue-100 shadow-xl transform hover:scale-[1.03] transition-transform duration-300"
        >
          <div className="space-y-6 text-sm text-gray-700">
            {/* Header: Property Info */}
            <div className="flex items-start gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={propertyImage}
                  alt={propertyName}
                  className="w-28 h-24 object-cover rounded-xl shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x320?text=No+Image";
                  }}
                />
              </div>
              {/* Details */}
              <div className="flex flex-col">
                <div className="text-lg font-semibold text-gray-900 leading-tight">
                  {propertyName}
                </div>
                <div className="text-sm text-gray-500 mt-1">{propertyType}</div>


              </div>
            </div>
            {/* Date Section */}
            <div className="text-sm mt-5 text-gray-700 flex items-center gap-3 flex-wrap">
              <FaCalendarCheck className="text-blue-500 text-base" />

              <span className="font-medium">
                {formatDate(dates.checkIn)} – {formatDate(dates.checkOut)}
              </span>

              <div className="w-px h-6 bg-gray-300 mx-2"></div>


              <span className="font-bold">
              {totalSelectedRooms} {totalSelectedRooms === 1 ? "room" : "rooms"}
              ,{guests.adults} {guests.adults === 1 ? "Guest" : "Guests"} 
              </span>
            </div>
            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Price Summary */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Price Summary</h3>
              <div className="flex justify-between">
                <span>
                  Room Price for {numberOfNights} {numberOfNights === 1 ? "Night" : "Nights"} x  {guests.adults} {guests.adults === 1 ? "Guest" : "Guests"}
                </span>
                <span className="font-medium">{formatCurrency(totalBasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium">₹{gstAmount}</span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800">Total (INR)</div>
              <div className="text-2xl font-extrabold text-blue-600">
                {formatCurrency(finalPrice)}
              </div>
            </div>

            {/* Footer note */}
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <FaCheckCircle className="text-green-500 mr-2 text-base" />
              Includes all taxes and fees
            </div>
          </div>
        </motion.div>
      </div>

   
    </>
  );
};

export default UserBookRoom;

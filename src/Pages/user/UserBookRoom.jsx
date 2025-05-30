import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "./Header";
import Paymentheader from "./payment Header/Paymentheader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getImageUrl = (path) =>
  path ? `${API_URL}/assets/${path}` : "https://placehold.co/400x320?text=No+Image";

const UserBookRoom = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const [form, setForm] = useState({
    bookingFor: "myself",
    Name: "",

    email: "",
    phone: "",
    country: "India",
    paperless: true,
    mainGuest: true,
    travelingForWork: false,
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'GET',
          credentials: 'include', // This is important for sending cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setForm(prev => ({
            ...prev,
            Name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
          }));
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    if (location.state) {
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
      const missingFields = requiredFields.filter((field) => !location.state[field]);
      if (missingFields.length > 0) {
        navigate(`/property/${propertyId}`);
        return;
      }
      setBookingDetails({
        ...location.state,
        facilities: location.state.facilities || {},
        amenities: location.state.amenities || [],
        rules: location.state.rules || {},
      });
    } else {
      navigate(`/property/${propertyId}`);
    }
  }, [location.state, propertyId, navigate]);

  if (!bookingDetails) {
    return (
      <>
        <Header />
        <div className="flex items-center  justify-center min-h-screen">
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
  } = bookingDetails;

  const calculateNights = () => {
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const numberOfNights = calculateNights();

  const calculateRoomPrice = (room) => room.price?.basePrice || 0;

  const totalBasePrice = rooms.reduce((total, room) => {
    const price = calculateRoomPrice(room);
    return total + price * (room.selectedCount || 0);
  }, 0);

  const gstAmount = price.gstAmount;
  const finalPrice = price.finalPrice;

  const formatCurrency = (amt) => `₹${Math.max(0, amt).toLocaleString("en-IN")}`;

  const propertyImage =
    bookingDetails?.rooms?.[0]?.image_urls?.[0]
      ? getImageUrl(bookingDetails.rooms[0].image_urls[0])
      : "https://placehold.co/400x320?text=No+Image";

  const totalSelectedRooms = rooms.reduce(
    (total, room) => total + (room.selectedCount || 0),
    0
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const sendOtp = async () => {
    if (!form.phone || form.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: form.phone }),
      });

      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setVerificationStatus('OTP sent successfully!');
      } else {
        setVerificationStatus('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setVerificationStatus('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: form.phone, otp }),
      });

      const data = await response.json();
      if (data.success) {
        setVerificationStatus('Phone number verified successfully!');
        return true;
      } else {
        setVerificationStatus('Invalid OTP. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setVerificationStatus('Failed to verify OTP. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      await sendOtp();
      return;
    }

    const isVerified = await verifyOtp();
    if (isVerified) {
      // Proceed with booking
      console.log('Proceeding with booking...');
    }
  };

  return (
    <>
      <Paymentheader />

      {/* Price Summary */}
      <div className="fixed top-40 right-[300px] w-[450px] z-10 font-inter">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 border border-blue-100 shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="space-y-6 text-gray-700">
            {/* Property Info */}
            <div className="flex items-start gap-5">
              <img
                src={propertyImage}
                alt={propertyName}
                className="w-28 h-24 object-cover rounded-xl shadow-sm"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x320?text=No+Image";
                }}
              />
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-gray-900">{propertyName}</h2>
                <p className="text-sm text-gray-500 mt-1">{propertyType}</p>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <FaCalendarCheck className="text-orange-500 text-lg" />
              <span className="font-medium">
                {formatDate(dates.checkIn)} – {formatDate(dates.checkOut)}
              </span>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <span className="font-semibold">
                {totalSelectedRooms} {totalSelectedRooms === 1 ? "room" : "rooms"},{" "}
                {guests.adults} {guests.adults === 1 ? "Guest" : "Guests"}
              </span>
            </div>

            <hr className="border-gray-200" />

            {/* Price Summary */}
            <div className="space-y-3 text-sm">
              <h3 className="text-lg font-semibold text-gray-900">Price Summary</h3>
              <div className="flex justify-between">
                <span>
                  Room Price for {numberOfNights} {numberOfNights === 1 ? "Night" : "Nights"} x{" "}
                  {guests.adults} {guests.adults === 1 ? "Guest" : "Guests"}
                </span>
                <span className="font-medium">{formatCurrency(totalBasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium">{formatCurrency(gstAmount)}</span>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-800">Total (INR)</div>
              <div className="text-3xl font-extrabold text-orange-600">
                {formatCurrency(finalPrice)}
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FaCheckCircle className="text-green-500 mr-2" />
              Includes all taxes and fees
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Form */}
      <div className="max-w-xl mt-20  ml-60 mr-20 p-8 bg-white  shadow-lg border border-gray-200 font-inter">
        <h2 className="flex items-center gap-3 text-2xl font-semibold mb-4">
          <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            1
          </span>
          Enter your details
        </h2>
        <p className="mb-8 text-gray-600">
          We will use these details to share your booking information
        </p>

        <form onSubmit={handleSubmit}>
          {/* Booking Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Who are you booking for?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bookingFor"
                  value="myself"
                  checked={form.bookingFor === "myself"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Myself</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bookingFor"
                  value="someone"
                  checked={form.bookingFor === "someone"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Someone else</span>
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="Name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={form.Name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          {/* Email and Phone */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="+91"
                className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send OTP
                </button>
              )}
            </div>
          </div>

          {otpSent && (
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {verificationStatus && (
            <div className={`mb-4 text-sm ${verificationStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {verificationStatus}
            </div>
          )}


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold text-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-shadow shadow-md"
          >
            {otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

      </div>
    </>
  );
};

export default UserBookRoom;

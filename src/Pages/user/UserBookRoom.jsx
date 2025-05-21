import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaUser, FaChild, FaMoneyBillWave, FaBed, FaWifi, FaParking } from 'react-icons/fa';
import Header from './Header';

const UserBookRoom = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  // New state for form fields
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'India',
    paperless: true,
    mainGuest: true,
    travelingForWork: false,
  });

  useEffect(() => {
    if (location.state) {
      console.log('Location state received in UserBookRoom:', location.state);
      
      // Validate the incoming state
      const requiredFields = ['propertyName', 'propertyAddress', 'facilities', 'amenities', 'rules', 'rooms', 'dates', 'guests', 'price'];
      const missingFields = requiredFields.filter(field => !location.state[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields in location state:', missingFields);
        // Redirect back to property details if critical data is missing
        navigate(`/property/${propertyId}`);
        return;
      }

      // Log detailed property information
      console.log('Property details from state:', {
        propertyName: location.state.propertyName,
        propertyAddress: location.state.propertyAddress,
        facilities: location.state.facilities,
        amenities: location.state.amenities,
        rules: location.state.rules
      });

      // Set booking details with validated data
      setBookingDetails({
        ...location.state,
        // Ensure these fields have default values if undefined
        facilities: location.state.facilities || {},
        amenities: location.state.amenities || [],
        rules: location.state.rules || {}
      });
    } else {
      console.log('No location state found, redirecting back to property');
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

  const { rooms, dates, guests, price, propertyName, propertyAddress, facilities, amenities, rules } = bookingDetails;
  console.log('Property Details:', { propertyName, propertyAddress, facilities, amenities, rules });

  // Calculate total price for each room
  const calculateRoomPrice = (room) => {
    const basePrice = room.price?.basePrice || 0;
    console.log('Calculating room price:', {
      roomType: room.room_type,
      basePrice,
      selectedCount: room.selectedCount
    });
    return basePrice;
  };

  // Calculate total base price
  const totalBasePrice = rooms.reduce((total, room) => {
    const roomPrice = calculateRoomPrice(room);
    const roomTotal = roomPrice * room.selectedCount;
    console.log('Room total:', {
      roomType: room.room_type,
      roomPrice,
      selectedCount: room.selectedCount,
      roomTotal
    });
    return total + roomTotal;
  }, 0);
  
  // Use the GST amount and final price from the passed state
  const gstAmount = price.gstAmount;
  const finalPrice = price.finalPrice;
  const gstRate = totalBasePrice <= 7500 ? 0.12 : 0.18;

  console.log('Price summary:', {
    totalBasePrice,
    gstAmount,
    finalPrice,
    gstRate
  });

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${Math.max(0, amount).toLocaleString('en-IN')}`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
  <>
      <Header />
      {/* Price Summary - Moved to top right */}
      <div className="fixed top-24 right-8 w-96 z-10">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-100 shadow-xl">
          <div className="font-bold text-xl text-gray-800 mb-2">Price Summary</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{formatCurrency(finalPrice)}</div>
          <div className="text-sm text-gray-500 mb-4">+ ₹{gstAmount} taxes and fees</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Base price</span>
              <span>{formatCurrency(totalBasePrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST ({gstRate * 100}%)</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>{formatCurrency(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="max-w-7xl mx-auto mt-8 mb-8 px-4">
        <div className="flex items-center justify-center gap-12">
          <div className="flex items-center group">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 transition-all duration-300 group-hover:scale-110">1</div>
            <span className="ml-3 font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">Your Selection</span>
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
          <div className="flex items-center group">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 transition-all duration-300 group-hover:scale-110">2</div>
            <span className="ml-3 font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">Your Details</span>
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
          <div className="flex items-center group">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold shadow-lg transition-all duration-300 group-hover:scale-110">3</div>
            <span className="ml-3 font-semibold text-gray-500 group-hover:text-gray-600 transition-colors">Finish booking</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar: Property & Price Summary */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-xl p-6 h-fit border border-gray-100">
          {/* Property Summary */}
          <div className="mb-8 border-2 border-blue-100 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">Apartment</div>
            <div className="text-xl text-gray-800 font-bold mb-2">{propertyName || 'Property Name'}</div>
            <div className="text-sm text-gray-600 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {propertyAddress || 'Property Address'}
            </div>
            <div className="flex gap-6 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <FaWifi className="text-blue-500 text-lg" /> Free Wifi
              </span>
              <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <FaParking className="text-blue-500 text-lg" /> Parking
              </span>
            </div>
          </div>

          {/* Property Details Section */}
          {(propertyName || propertyAddress || facilities || amenities || rules) && (
            <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Property Details
              </div>
              {propertyName && (
                <div className="text-sm text-gray-700 mb-3 flex items-center">
                  <span className="font-semibold text-gray-800 w-24">Name:</span>
                  <span className="text-gray-600">{propertyName}</span>
                </div>
              )}
              {propertyAddress && (
                <div className="text-sm text-gray-700 mb-3 flex items-center">
                  <span className="font-semibold text-gray-800 w-24">Address:</span>
                  <span className="text-gray-600">{propertyAddress}</span>
                </div>
              )}
              {facilities && (
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-semibold text-gray-800 block mb-2">Facilities:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(facilities)
                      .filter(([_, value]) => value === 1)
                      .map(([key]) => (
                        <span key={key} className="bg-gray-50 px-3 py-1 rounded-full text-gray-600 text-xs">
                          {key.replace(/_/g, ' ')}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              {amenities && (
                <div className="text-sm text-gray-700 mb-3">
                  <span className="font-semibold text-gray-800 block mb-2">Amenities:</span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(amenities) ? amenities : Object.keys(amenities)).map((amenity) => (
                      <span key={amenity} className="bg-gray-50 px-3 py-1 rounded-full text-gray-600 text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking Details */}
          <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
              <FaCalendarCheck className="w-5 h-5 mr-2 text-blue-500" />
              Your booking details
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium text-gray-800">{dates.checkIn}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium text-gray-800">{dates.checkOut}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Length of stay</span>
                <span className="font-medium text-gray-800">1 night</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-800 mb-3">Selected Rooms</div>
                {rooms.map((room, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-600 font-medium">{room.room_type.split('_')[0]}</span>
                      <span className="text-gray-800 font-medium">x{room.selectedCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 text-xs">Price per room</span>
                      <span className="text-blue-600 font-medium">{formatCurrency(calculateRoomPrice(room))}</span>
                    </div>
                    
                    {idx < rooms.length - 1 && <div className="border-b border-gray-100 my-2" />}
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium text-gray-800">{guests.adults} adults, {guests.children} children</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Section: Booking Form */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <FaUser className="w-6 h-6 mr-3 text-blue-500" />
            Enter your details
          </h1>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={form.firstName} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={form.lastName} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email address <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleInputChange} 
                required 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter your email address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone number <span className="text-red-500">*</span></label>
                <div className="flex">
                  <select 
                    name="country" 
                    value={form.country} 
                    onChange={handleInputChange} 
                    className="border border-gray-200 rounded-l-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="India">IN +91</option>
                    <option value="US">US +1</option>
                    <option value="UK">UK +44</option>
                  </select>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border border-gray-200 rounded-r-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Country/Region <span className="text-red-500">*</span></label>
                <select 
                  name="country" 
                  value={form.country} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="India">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-xl">
              <input 
                type="checkbox" 
                name="paperless" 
                checked={form.paperless} 
                onChange={handleInputChange} 
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              />
              <span className="ml-3 text-sm text-gray-700">Yes, I want free paperless confirmation (recommended)</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-semibold text-gray-800 mb-3">Who are you booking for? <span className="text-xs text-gray-400">(optional)</span></div>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="mainGuest" 
                      checked={form.mainGuest} 
                      onChange={() => setForm(f => ({ ...f, mainGuest: true }))} 
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">I'm the main guest</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="mainGuest" 
                      checked={!form.mainGuest} 
                      onChange={() => setForm(f => ({ ...f, mainGuest: false }))} 
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">I'm booking for someone else</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-semibold text-gray-800 mb-3">Are you traveling for work? <span className="text-xs text-gray-400">(optional)</span></div>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="travelingForWork" 
                      checked={form.travelingForWork} 
                      onChange={() => setForm(f => ({ ...f, travelingForWork: true }))} 
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="travelingForWork" 
                      checked={!form.travelingForWork} 
                      onChange={() => setForm(f => ({ ...f, travelingForWork: false }))} 
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300 font-medium"
                type="button"
                onClick={() => navigate(`/property/${propertyId}`)}
              >
                Back to Property
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium shadow-lg shadow-blue-200"
                type="submit"
                onClick={e => { e.preventDefault(); /* Handle payment/confirmation logic here */ console.log('Proceeding to payment...', form); }}
              >
                Proceed to Payment
              </motion.button>
            </div>
          </form>
        </div>
      </div>
  </>
  );
};

export default UserBookRoom;


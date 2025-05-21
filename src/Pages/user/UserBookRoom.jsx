import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaUser, FaChild, FaMoneyBillWave, FaBed } from 'react-icons/fa';
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
      {/* Step Progress Bar */}
      <div className="max-w-7xl mx-auto mt-6 mb-4">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
            <span className="ml-2 font-semibold text-blue-700">Your Selection</span>
          </div>
          <div className="h-1 w-8 bg-gray-300 rounded" />
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
            <span className="ml-2 font-semibold text-blue-700">Your Details</span>
          </div>
          <div className="h-1 w-8 bg-gray-300 rounded" />
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">3</div>
            <span className="ml-2 font-semibold text-gray-500">Finish booking</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar: Property & Price Summary */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
          {/* Property Summary */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 mb-1">Apartment</div>
            <div className="text-lg font-bold mb-1">{propertyName || 'Property Name'}</div>
            <div className="text-sm text-gray-600 mb-2">{propertyAddress || 'Property Address'}</div>
            <div className="flex gap-4 text-xs text-gray-500 mb-2">
              <span>Free Wifi</span>
              <span>Parking</span>
            </div>
          </div>
          {/* Property Details Section */}
          {(propertyName || propertyAddress || facilities || amenities || rules) && (
            <div className="mb-6">
              <div className="font-semibold mb-2">Property Details</div>
              {propertyName && (
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Name: </span>{propertyName}
                </div>
              )}
              {propertyAddress && (
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Address: </span>{propertyAddress}
                </div>
              )}
              {facilities && (
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Facilities: </span>
                  {Object.entries(facilities)
                    .filter(([_, value]) => value === 1)
                    .map(([key]) => key.replace(/_/g, ' ')).join(', ') || 'None'}
                </div>
              )}
              {amenities && (
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Amenities: </span>
                  {Array.isArray(amenities)
                    ? amenities.join(', ')
                    : Object.keys(amenities).join(', ')}
                </div>
              )}
              {rules && (
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Rules: </span>
                  <ul className="list-disc list-inside ml-4">
                    {Object.entries(rules).slice(0, 5).map(([key, value]) => (
                      <li key={key}>{key.replace(/_/g, ' ')}: {String(value)}</li>
                    ))}
                    {Object.entries(rules).length > 5 && <li>...and more</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
          {/* Booking Details */}
          <div className="mb-6">
            <div className="font-semibold mb-2">Your booking details</div>
            <div className="flex justify-between text-sm mb-1">
              <span>Check-in</span>
              <span className="font-medium">{dates.checkIn}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Check-out</span>
              <span className="font-medium">{dates.checkOut}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Total length of stay:</span>
              <span className="font-medium">1 night</span>
              </div>
            <div className="mt-2 text-sm">
              <span className="font-semibold">You selected</span>
              <div className="ml-2">
                {rooms.map((room, idx) => (
                  <div key={idx}>{room.selectedCount} x {room.room_type.split('_')[0]}</div>
                ))}
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span>{guests.adults} adults, {guests.children} children</span>
            </div>
          </div>
          {/* Price Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="font-bold text-lg mb-2">Price</div>
            <div className="text-2xl font-bold text-blue-700 mb-1">{formatCurrency(finalPrice)}</div>
            <div className="text-xs text-gray-500 mb-2">+ ₹{gstAmount} taxes and fees</div>
            <div className="text-xs text-gray-500">Excludes taxes and fees</div>
            <div className="mt-2 text-xs text-gray-500">Goods and services tax: ₹{gstAmount}</div>
          </div>
            </div>
        {/* Main Section: Booking Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Enter your details</h1>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First name <span className="text-red-500">*</span></label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name <span className="text-red-500">*</span></label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email address <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                <label className="block text-sm font-medium mb-1">Phone number <span className="text-red-500">*</span></label>
                <div className="flex">
                  <select name="country" value={form.country} onChange={handleInputChange} className="border rounded-l-lg px-2 py-2 bg-gray-50">
                    <option value="India">IN +91</option>
                    <option value="US">US +1</option>
                    <option value="UK">UK +44</option>
                  </select>
                  <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} required className="w-full border rounded-r-lg px-3 py-2" />
                      </div>
                    </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country/Region <span className="text-red-500">*</span></label>
                <select name="country" value={form.country} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="India">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
                  </div>
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" name="paperless" checked={form.paperless} onChange={handleInputChange} className="mr-2" />
              <span>Yes, I want free paperless confirmation (recommended)</span>
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-2">Who are you booking for? <span className="text-xs text-gray-400">(optional)</span></div>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="mainGuest" checked={form.mainGuest} onChange={() => setForm(f => ({ ...f, mainGuest: true }))} className="mr-2" />
                  I'm the main guest
                </label>
                <label className="flex items-center">
                  <input type="radio" name="mainGuest" checked={!form.mainGuest} onChange={() => setForm(f => ({ ...f, mainGuest: false }))} className="mr-2" />
                  I'm booking for someone else
                </label>
              </div>
              </div>
            <div className="mt-4">
              <div className="font-semibold mb-2">Are you traveling for work? <span className="text-xs text-gray-400">(optional)</span></div>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input type="radio" name="travelingForWork" checked={form.travelingForWork} onChange={() => setForm(f => ({ ...f, travelingForWork: true }))} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="travelingForWork" checked={!form.travelingForWork} onChange={() => setForm(f => ({ ...f, travelingForWork: false }))} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                type="button"
              onClick={() => navigate(`/property/${propertyId}`)}
            >
              Back to Property
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
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


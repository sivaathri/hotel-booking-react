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

  useEffect(() => {
    if (location.state) {
      console.log('Received booking details:', location.state);
      setBookingDetails(location.state);
    } else {
      // If no state is passed, redirect back to property details
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

  const { rooms, dates, guests, price } = bookingDetails;

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

  return (
  <>
      <Header />
      <div className="max-w-7xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-2xl font-bold mb-6">Booking Summary</h1>

          {/* Dates Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarCheck className="text-blue-600" />
              <h2 className="font-semibold">Stay Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-medium">{dates.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-medium">{dates.checkOut}</p>
              </div>
            </div>
          </div>

          {/* Guests Section */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaUser className="text-green-600" />
              <h2 className="font-semibold">Guest Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Adults</p>
                <p className="font-medium">{guests.adults}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Children</p>
                <p className="font-medium">{guests.children}</p>
              </div>
            </div>
          </div>

          {/* Selected Rooms Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaBed className="text-purple-600" />
              <h2 className="font-semibold">Selected Rooms</h2>
            </div>
            <div className="space-y-4">
              {rooms.map((room, index) => {
                const roomPrice = calculateRoomPrice(room);
                const roomTotalPrice = roomPrice * room.selectedCount;
                console.log('Rendering room:', {
                  roomType: room.room_type,
                  roomPrice,
                  selectedCount: room.selectedCount,
                  roomTotalPrice
                });
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{room.room_type}</h3>
                        <p className="text-sm text-gray-600">Quantity: {room.selectedCount}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(roomTotalPrice)}</p>
                        <p className="text-sm text-gray-600">per room</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown Section */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaMoneyBillWave className="text-yellow-600" />
              <h2 className="font-semibold">Price Breakdown</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>{formatCurrency(totalBasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(gstAmount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300"
              onClick={() => navigate(`/property/${propertyId}`)}
            >
              Back to Property
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              onClick={() => {
                // Handle payment/confirmation logic here
                console.log('Proceeding to payment...');
              }}
            >
              Proceed to Payment
            </motion.button>
          </div>
        </motion.div>
      </div>
  </>
  );
};

export default UserBookRoom;

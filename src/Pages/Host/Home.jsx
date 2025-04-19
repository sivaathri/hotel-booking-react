import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    async click(e) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      
      // Reverse geocode the coordinates
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-100 h-1">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

const PageTransition = ({ children, direction }) => (
  <motion.div
    initial={{ x: direction === 'left' ? -1000 : 1000, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: direction === 'left' ? 1000 : -1000, opacity: 0 }}
    transition={{ type: "spring", stiffness: 50, damping: 20 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const FloatingLabel = ({ children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mb-6"
  >
    {children}
  </motion.div>
);

const Home = () => {
  const [step, setStep] = useState(1);
  const [hotelData, setHotelData] = useState({
    hotelName: '',
    location: null,
    description: '',
    address: '',
    contact: '',
    roomType: '',
    price: '',
    capacity: '',
    facilities: [],
  });

  const facilitiesOptions = [
    { name: 'WiFi', icon: '📶' },
    { name: 'Air Conditioning', icon: '❄️' },
    { name: 'TV', icon: '📺' },
    { name: 'Mini Bar', icon: '🍷' },
    { name: 'Room Service', icon: '🛎️' },
    { name: 'Swimming Pool', icon: '🏊‍♂️' },
    { name: 'Gym', icon: '💪' },
    { name: 'Spa', icon: '💆‍♂️' },
    { name: 'Restaurant', icon: '🍽️' },
    { name: 'Parking', icon: '🅿️' },
  ];

  const handleFacilityChange = (facility) => {
    setHotelData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Hotel Data:', hotelData);
  };

  return (
    <div className="min-h-screen bg-white">
      <StepIndicator currentStep={step} totalSteps={5} />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <motion.h1 
              className="text-4xl font-bold mb-8 text-gray-800"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {step === 1 && "Let's Start Your Journey"}
              {step === 2 && "Pin Your Paradise"}
              {step === 3 && "Tell Us More"}
              {step === 4 && "Room Specifications"}
              {step === 5 && "Amazing Amenities"}
            </motion.h1>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <PageTransition key="step1" direction="right">
                  <FloatingLabel>
                    <input
                      type="text"
                      value={hotelData.hotelName}
                      onChange={(e) => setHotelData({ ...hotelData, hotelName: e.target.value })}
                      placeholder="Enter your hotel name"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
                    />
                  </FloatingLabel>
                </PageTransition>
              )}

              {step === 2 && (
                <PageTransition key="step2" direction="right">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side - Location Details */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selected Address</label>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[100px]">
                              {hotelData.address ? (
                                <p className="text-gray-800">{hotelData.address}</p>
                              ) : (
                                <p className="text-gray-400 italic">Click on the map to select a location</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              {hotelData.location ? (
                                <p className="text-gray-800">
                                  Latitude: {hotelData.location.lat.toFixed(6)}<br />
                                  Longitude: {hotelData.location.lng.toFixed(6)}
                                </p>
                              ) : (
                                <p className="text-gray-400 italic">No location selected</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            Click anywhere on the map to select your hotel location
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            The address will be automatically filled
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            You can drag the marker to adjust the location
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            Zoom in/out for more precise placement
                          </li>
                        </ul>
                      </motion.div>
                    </div>

                    {/* Right Side - Map */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="h-[60vh] w-full rounded-xl overflow-hidden shadow-md"
                    >
                      <MapContainer
                        center={[11.9416, 79.8083]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-xl"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker
                          position={hotelData.location}
                          setPosition={(pos) => setHotelData({ ...hotelData, location: pos })}
                          setAddress={(addr) => setHotelData({ ...hotelData, address: addr })}
                        />
                      </MapContainer>
                    </motion.div>
                  </div>
                </PageTransition>
              )}

              {step === 3 && (
                <PageTransition key="step3" direction="right">
                  <div className="space-y-6">
                    <FloatingLabel>
                      <input
                        type="text"
                        value={hotelData.address}
                        onChange={(e) => setHotelData({ ...hotelData, address: e.target.value })}
                        placeholder="Address"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
                      />
                    </FloatingLabel>
                    <FloatingLabel>
                      <input
                        type="text"
                        value={hotelData.contact}
                        onChange={(e) => setHotelData({ ...hotelData, contact: e.target.value })}
                        placeholder="Contact Number"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
                      />
                    </FloatingLabel>
                    <FloatingLabel>
                      <textarea
                        value={hotelData.description}
                        onChange={(e) => setHotelData({ ...hotelData, description: e.target.value })}
                        placeholder="Tell us about your hotel..."
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800 h-32 resize-none"
                      />
                    </FloatingLabel>
                  </div>
                </PageTransition>
              )}

              {step === 4 && (
                <PageTransition key="step4" direction="right">
                  <div className="space-y-6">
                    <FloatingLabel>
                      <input
                        type="text"
                        value={hotelData.roomType}
                        onChange={(e) => setHotelData({ ...hotelData, roomType: e.target.value })}
                        placeholder="Room Type (e.g., Deluxe Suite)"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
                      />
                    </FloatingLabel>
                    <FloatingLabel>
                      <input
                        type="number"
                        value={hotelData.price}
                        onChange={(e) => setHotelData({ ...hotelData, price: e.target.value })}
                        placeholder="Price per night"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
                      />
                    </FloatingLabel>
                    <FloatingLabel>
                      <input
                        type="number"
                        value={hotelData.capacity}
                        onChange={(e) => setHotelData({ ...hotelData, capacity: e.target.value })}
                        placeholder="Room Capacity"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
                      />
                    </FloatingLabel>
                  </div>
                </PageTransition>
              )}

              {step === 5 && (
                <PageTransition key="step5" direction="right">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {facilitiesOptions.map((facility) => (
                      <motion.div
                        key={facility.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                          <input
                            type="checkbox"
                            checked={hotelData.facilities.includes(facility.name)}
                            onChange={() => handleFacilityChange(facility.name)}
                            className="h-5 w-5 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-lg">{facility.icon}</span>
                          <span className="text-gray-700">{facility.name}</span>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </PageTransition>
              )}
            </AnimatePresence>

            <motion.div 
              className="mt-8 flex justify-between"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step > 1 && (
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Back
                </motion.button>
              )}
              {step < 5 ? (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  Submit
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

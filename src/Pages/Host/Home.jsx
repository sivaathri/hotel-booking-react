import React, { useState } from 'react';
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

const LocationMarker = ({ position, setPosition, setAddress, setAddressDetails }) => {
  useMapEvents({
    async click(e) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
          // Extract address components
          const address = data.address || {};
          setAddressDetails({
            addressLine1: address.road || '',
            addressLine2: address.house_number || '',
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            country: address.country || '',
            postalCode: address.postcode || ''
          });
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
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-100 h-2">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
};

const PageTransition = ({ children, direction }) => (
  <motion.div
    initial={{ x: direction === 'left' ? -1000 : 1000, opacity: 0, scale: 0.8 }}
    animate={{ x: 0, opacity: 1, scale: 1 }}
    exit={{ x: direction === 'left' ? 1000 : -1000, opacity: 0, scale: 0.8 }}
    transition={{ 
      type: "spring", 
      stiffness: 100, 
      damping: 20,
      mass: 1,
      velocity: 0.5
    }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const FloatingLabel = ({ children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="mb-6"
  >
    {children}
  </motion.div>
);

const InputField = ({ type = 'text', value, onChange, placeholder, className = '', ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-800 shadow-sm hover:shadow-md ${className}`}
    {...props}
  />
);

const Checkbox = ({ checked, onChange, label, className = '' }) => (
  <label className={`flex items-center space-x-3 p-4 bg-white rounded-xl cursor-pointer border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300 ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const RadioButton = ({ checked, onChange, label, name, className = '' }) => (
  <label className={`flex items-center space-x-3 p-4 bg-white rounded-xl cursor-pointer border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300 ${className}`}>
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 rounded-full text-indigo-500 focus:ring-indigo-500 border-gray-300"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-8 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Home = () => {
  const [step, setStep] = useState(1);
  const [hotelData, setHotelData] = useState({
    // Step 1: Basic Information
    propertyName: '',
    propertyType: '',
    
    // Step 2: Location
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    location: null,
    
    // Step 3: Rooms Setup
    rooms: [{
      name: '',
      capacity: '',
      bedType: '',
      hasBathroom: false,
      hasBalcony: false,
      balconyView: '',
      facilities: []
    }],
    
    // Step 4: Room Photos
    roomPhotos: [],
    
    // Step 5: Language Preference
    languages: [],
    otherLanguage: '',
    
    // Step 6: House Rules
    checkInTime: '',
    checkOutTime: '',
    petsAllowed: false,
    smokingAllowed: false,
    alcoholAllowed: false,
    noiseRestrictions: false,
    
    // Step 7: Pricing & Availability
    pricePerNight: '',
    discounts: {
      longStay: false,
      earlyBird: false,
      lastMinute: false
    },
    refundPolicy: '',
    availability: [],
    
    // Step 8: Guest Booking Preferences
    allowedGuests: [],
    instantBooking: false,
    manualApproval: false,
    
    // Step 9: Payment Setup
    paymentMethods: [],
    panGstId: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountName: ''
    },
    
    // Step 10: Verification
    idProof: null,
    ownershipProof: null,
    termsAccepted: false
  });

  const propertyTypes = [
    'Hotel', 'Apartment', 'Hut House', 'Resort', 'Beach House', 'Villa'
  ];

  const bedTypes = ['Queen', 'King', 'Twin'];
  const roomFacilities = [
    'Private Bathroom', 'Bathtub', 'Kitchen Access', 'Jacuzzi',
    'Washing Machine', 'Air Conditioning', 'Heating', 'Free WiFi',
    'Smart TV', 'Breakfast Included', 'Parking'
  ];

  const languages = ['English', 'Hindi'];
  const refundPolicies = ['Fully Refundable', 'Partial Refund', 'Non-refundable'];
  const allowedGuestTypes = ['Married Couples', 'Families', 'Solo Travelers', 'Friends'];
  const paymentMethodOptions = ['UPI', 'Bank Transfer', 'Cash at Check-In', 'Online'];

  const handleNext = () => {
    if (step < 10) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Hotel Data:', hotelData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StepIndicator currentStep={step} totalSteps={10} />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <motion.h1 
              className="text-4xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {step === 1 && "Basic Information"}
              {step === 2 && "Location Details"}
              {step === 3 && "Rooms Setup"}
              {step === 4 && "Room Photos"}
              {step === 5 && "Language Preference"}
              {step === 6 && "House Rules"}
              {step === 7 && "Pricing & Availability"}
              {step === 8 && "Booking Preferences"}
              {step === 9 && "Payment Setup"}
              {step === 10 && "Verification"}
            </motion.h1>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <PageTransition key="step1" direction="right">
                  <div className="space-y-6">
                    <FloatingLabel>
                      <InputField
                        value={hotelData.propertyName}
                        onChange={(e) => setHotelData({ ...hotelData, propertyName: e.target.value })}
                        placeholder="Enter your property name"
                      />
                    </FloatingLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {propertyTypes.map((type) => (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <RadioButton
                            checked={hotelData.propertyType === type}
                            onChange={() => setHotelData({ ...hotelData, propertyType: type })}
                            label={type}
                            name="propertyType"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 2 && (
                <PageTransition key="step2" direction="right">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Address Details</h3>
                      <div className="space-y-4">
                        <FloatingLabel>
                          <InputField
                            type="text"
                            value={hotelData.addressLine1}
                            onChange={(e) => setHotelData({ ...hotelData, addressLine1: e.target.value })}
                            placeholder="Address Line 1"
                          />
                        </FloatingLabel>
                        <FloatingLabel>
                          <InputField
                            type="text"
                            value={hotelData.addressLine2}
                            onChange={(e) => setHotelData({ ...hotelData, addressLine2: e.target.value })}
                            placeholder="Address Line 2"
                          />
                        </FloatingLabel>
                        <div className="grid grid-cols-2 gap-4">
                          <FloatingLabel>
                            <InputField
                              type="text"
                              value={hotelData.city}
                              onChange={(e) => setHotelData({ ...hotelData, city: e.target.value })}
                              placeholder="City"
                            />
                          </FloatingLabel>
                          <FloatingLabel>
                            <InputField
                              type="text"
                              value={hotelData.state}
                              onChange={(e) => setHotelData({ ...hotelData, state: e.target.value })}
                              placeholder="State/Province"
                            />
                          </FloatingLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FloatingLabel>
                            <InputField
                              type="text"
                              value={hotelData.country}
                              onChange={(e) => setHotelData({ ...hotelData, country: e.target.value })}
                              placeholder="Country"
                            />
                          </FloatingLabel>
                          <FloatingLabel>
                            <InputField
                              type="text"
                              value={hotelData.postalCode}
                              onChange={(e) => setHotelData({ ...hotelData, postalCode: e.target.value })}
                              placeholder="Postal/Zip Code"
                            />
                          </FloatingLabel>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm h-full">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Location on Map</h3>
                      <p className="text-sm text-gray-500 mb-4">Click on the map to select your property's location. The address will be automatically filled.</p>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="h-[calc(100%-6rem)] w-full rounded-xl overflow-hidden shadow-md"
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
                            setAddressDetails={(details) => setHotelData({ ...hotelData, ...details })}
                          />
                        </MapContainer>
                      </motion.div>
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 3 && (
                <PageTransition key="step3" direction="right">
                  <div className="space-y-6">
                    {hotelData.rooms.map((room, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4">Room {index + 1}</h3>
                        <div className="space-y-4">
                          <FloatingLabel>
                            <InputField
                              value={room.name}
                              onChange={(e) => {
                                const newRooms = [...hotelData.rooms];
                                newRooms[index].name = e.target.value;
                                setHotelData({ ...hotelData, rooms: newRooms });
                              }}
                              placeholder="Room Name / Type"
                            />
                          </FloatingLabel>
                          <div className="grid grid-cols-2 gap-4">
                            <FloatingLabel>
                              <InputField
                                type="number"
                                value={room.capacity}
                                onChange={(e) => {
                                  const newRooms = [...hotelData.rooms];
                                  newRooms[index].capacity = e.target.value;
                                  setHotelData({ ...hotelData, rooms: newRooms });
                                }}
                                placeholder="Capacity"
                              />
                            </FloatingLabel>
                            <FloatingLabel>
                              <select
                                value={room.bedType}
                                onChange={(e) => {
                                  const newRooms = [...hotelData.rooms];
                                  newRooms[index].bedType = e.target.value;
                                  setHotelData({ ...hotelData, rooms: newRooms });
                                }}
                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800"
                              >
                                <option value="">Select Bed Type</option>
                                {bedTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </FloatingLabel>
                          </div>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={room.hasBathroom}
                                onChange={(e) => {
                                  const newRooms = [...hotelData.rooms];
                                  newRooms[index].hasBathroom = e.target.checked;
                                  setHotelData({ ...hotelData, rooms: newRooms });
                                }}
                                className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                              />
                              <span>Attached Bathroom</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={room.hasBalcony}
                                onChange={(e) => {
                                  const newRooms = [...hotelData.rooms];
                                  newRooms[index].hasBalcony = e.target.checked;
                                  setHotelData({ ...hotelData, rooms: newRooms });
                                }}
                                className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                              />
                              <span>Balcony</span>
                            </label>
                          </div>
                          {room.hasBalcony && (
                            <FloatingLabel>
                              <InputField
                                value={room.balconyView}
                                onChange={(e) => {
                                  const newRooms = [...hotelData.rooms];
                                  newRooms[index].balconyView = e.target.value;
                                  setHotelData({ ...hotelData, rooms: newRooms });
                                }}
                                placeholder="Balcony View (e.g., Sea, Garden, City)"
                              />
                            </FloatingLabel>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {roomFacilities.map((facility) => (
                              <label key={facility} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={room.facilities.includes(facility)}
                                  onChange={(e) => {
                                    const newRooms = [...hotelData.rooms];
                                    if (e.target.checked) {
                                      newRooms[index].facilities.push(facility);
                                    } else {
                                      newRooms[index].facilities = newRooms[index].facilities.filter(f => f !== facility);
                                    }
                                    setHotelData({ ...hotelData, rooms: newRooms });
                                  }}
                                  className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                                />
                                <span>{facility}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setHotelData({
                          ...hotelData,
                          rooms: [...hotelData.rooms, {
                            name: '',
                            capacity: '',
                            bedType: '',
                            hasBathroom: false,
                            hasBalcony: false,
                            balconyView: '',
                            facilities: []
                          }]
                        });
                      }}
                      className="w-full px-6 py-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all duration-300"
                    >
                      Add Another Room
                    </button>
                  </div>
                </PageTransition>
              )}

              {step === 4 && (
                <PageTransition key="step4" direction="right">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {hotelData.rooms.map((room, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <h3 className="text-xl font-semibold mb-4">{room.name}</h3>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  const newRooms = [...hotelData.rooms];
                                  newRooms[index].photos = Array.from(e.target.files);
                                  setHotelData({ ...hotelData, rooms: newRooms });
                                }}
                                className="hidden"
                                id={`room-photos-${index}`}
                              />
                              <label
                                htmlFor={`room-photos-${index}`}
                                className="cursor-pointer text-gray-600 hover:text-indigo-500"
                              >
                                Click to upload photos
                                <p className="text-sm text-gray-400 mt-2">Max 5MB per image</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 5 && (
                <PageTransition key="step5" direction="right">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {languages.map((language) => (
                        <label key={language} className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            checked={hotelData.languages.includes(language)}
                            onChange={(e) => {
                              const newLanguages = e.target.checked
                                ? [...hotelData.languages, language]
                                : hotelData.languages.filter(l => l !== language);
                              setHotelData({ ...hotelData, languages: newLanguages });
                            }}
                            className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                          />
                          <span>{language}</span>
                        </label>
                      ))}
                    </div>
                    <FloatingLabel>
                      <InputField
                        value={hotelData.otherLanguage}
                        onChange={(e) => setHotelData({ ...hotelData, otherLanguage: e.target.value })}
                        placeholder="Other Language (if any)"
                      />
                    </FloatingLabel>
                  </div>
                </PageTransition>
              )}

              {step === 6 && (
                <PageTransition key="step6" direction="right">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingLabel>
                        <InputField
                          type="time"
                          value={hotelData.checkInTime}
                          onChange={(e) => setHotelData({ ...hotelData, checkInTime: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800"
                        />
                        <span className="text-sm text-gray-500">Check-In Time</span>
                      </FloatingLabel>
                      <FloatingLabel>
                        <InputField
                          type="time"
                          value={hotelData.checkOutTime}
                          onChange={(e) => setHotelData({ ...hotelData, checkOutTime: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-800"
                        />
                        <span className="text-sm text-gray-500">Check-Out Time</span>
                      </FloatingLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Pets Allowed', value: 'petsAllowed' },
                        { label: 'Smoking Allowed', value: 'smokingAllowed' },
                        { label: 'Alcohol Allowed', value: 'alcoholAllowed' },
                        { label: 'Noise Restrictions', value: 'noiseRestrictions' }
                      ].map((rule) => (
                        <label key={rule.value} className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            checked={hotelData[rule.value]}
                            onChange={(e) => setHotelData({ ...hotelData, [rule.value]: e.target.checked })}
                            className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                          />
                          <span>{rule.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 7 && (
                <PageTransition key="step7" direction="right">
                  <div className="space-y-6">
                    <FloatingLabel>
                      <InputField
                        type="number"
                        value={hotelData.pricePerNight}
                        onChange={(e) => setHotelData({ ...hotelData, pricePerNight: e.target.value })}
                        placeholder="Price Per Night (₹)"
                      />
                    </FloatingLabel>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Discounts</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Long Stay Discount', value: 'longStay' },
                          { label: 'Early Bird Discount', value: 'earlyBird' },
                          { label: 'Last Minute Discount', value: 'lastMinute' }
                        ].map((discount) => (
                          <label key={discount.value} className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <input
                              type="checkbox"
                              checked={hotelData.discounts[discount.value]}
                              onChange={(e) => {
                                const newDiscounts = { ...hotelData.discounts };
                                newDiscounts[discount.value] = e.target.checked;
                                setHotelData({ ...hotelData, discounts: newDiscounts });
                              }}
                              className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                            />
                            <span>{discount.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Refund Policy</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {refundPolicies.map((policy) => (
                          <label key={policy} className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <input
                              type="radio"
                              name="refundPolicy"
                              checked={hotelData.refundPolicy === policy}
                              onChange={() => setHotelData({ ...hotelData, refundPolicy: policy })}
                              className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                            />
                            <span>{policy}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 8 && (
                <PageTransition key="step8" direction="right">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Who can book?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {allowedGuestTypes.map((type) => (
                          <label key={type} className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <input
                              type="checkbox"
                              checked={hotelData.allowedGuests.includes(type)}
                              onChange={(e) => {
                                const newAllowedGuests = e.target.checked
                                  ? [...hotelData.allowedGuests, type]
                                  : hotelData.allowedGuests.filter(g => g !== type);
                                setHotelData({ ...hotelData, allowedGuests: newAllowedGuests });
                              }}
                              className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Booking Type</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            checked={hotelData.instantBooking}
                            onChange={(e) => setHotelData({ ...hotelData, instantBooking: e.target.checked })}
                            className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                          />
                          <span>Instant Booking</span>
                        </label>
                        <label className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <input
                            type="checkbox"
                            checked={hotelData.manualApproval}
                            onChange={(e) => setHotelData({ ...hotelData, manualApproval: e.target.checked })}
                            className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                          />
                          <span>Manual Approval</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 9 && (
                <PageTransition key="step9" direction="right">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Payment Methods</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {paymentMethodOptions.map((method) => (
                          <label key={method} className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <input
                              type="checkbox"
                              checked={hotelData.paymentMethods.includes(method)}
                              onChange={(e) => {
                                const newPaymentMethods = e.target.checked
                                  ? [...hotelData.paymentMethods, method]
                                  : hotelData.paymentMethods.filter(m => m !== method);
                                setHotelData({ ...hotelData, paymentMethods: newPaymentMethods });
                              }}
                              className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                            />
                            <span>{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <FloatingLabel>
                      <InputField
                        value={hotelData.panGstId}
                        onChange={(e) => setHotelData({ ...hotelData, panGstId: e.target.value })}
                        placeholder="PAN/GST ID"
                      />
                    </FloatingLabel>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Bank Details</h3>
                      <div className="space-y-4">
                        <FloatingLabel>
                          <InputField
                            value={hotelData.bankDetails.accountName}
                            onChange={(e) => setHotelData({
                              ...hotelData,
                              bankDetails: { ...hotelData.bankDetails, accountName: e.target.value }
                            })}
                            placeholder="Account Holder Name"
                          />
                        </FloatingLabel>
                        <FloatingLabel>
                          <InputField
                            value={hotelData.bankDetails.accountNumber}
                            onChange={(e) => setHotelData({
                              ...hotelData,
                              bankDetails: { ...hotelData.bankDetails, accountNumber: e.target.value }
                            })}
                            placeholder="Account Number"
                          />
                        </FloatingLabel>
                        <FloatingLabel>
                          <InputField
                            value={hotelData.bankDetails.ifscCode}
                            onChange={(e) => setHotelData({
                              ...hotelData,
                              bankDetails: { ...hotelData.bankDetails, ifscCode: e.target.value }
                            })}
                            placeholder="IFSC Code"
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                </PageTransition>
              )}

              {step === 10 && (
                <PageTransition key="step10" direction="right">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Upload Documents</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setHotelData({ ...hotelData, idProof: e.target.files[0] })}
                            className="hidden"
                            id="id-proof"
                          />
                          <label
                            htmlFor="id-proof"
                            className="cursor-pointer text-gray-600 hover:text-indigo-500"
                          >
                            Upload ID Proof
                          </label>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setHotelData({ ...hotelData, ownershipProof: e.target.files[0] })}
                            className="hidden"
                            id="ownership-proof"
                          />
                          <label
                            htmlFor="ownership-proof"
                            className="cursor-pointer text-gray-600 hover:text-indigo-500"
                          >
                            Upload Ownership Proof
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          checked={hotelData.termsAccepted}
                          onChange={(e) => setHotelData({ ...hotelData, termsAccepted: e.target.checked })}
                          className="h-5 w-5 rounded text-indigo-500 focus:ring-indigo-500 border-gray-300"
                        />
                        <span>I confirm all details are correct and accept TripNGrub's terms and policies</span>
                      </label>
                    </div>
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
                <Button
                  onClick={handleBack}
                  variant="secondary"
                >
                  Back
                </Button>
              )}
              {step < 10 ? (
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="success"
                  className="ml-auto"
                >
                  Submit
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

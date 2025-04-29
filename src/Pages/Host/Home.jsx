import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Check, X } from 'lucide-react';

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
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-100 h-1">
      <motion.div
        className="h-full bg-[#FF5A5F]"
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
    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder-gray-400 text-gray-800 ${className}`}
    {...props}
  />
);

const Checkbox = ({ checked, onChange, label, className = '' }) => (
  <label className={`flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer border border-gray-300 hover:border-primary transition-all duration-300 ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 rounded text-primary focus:ring-primary border-gray-300"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const RadioButton = ({ checked, onChange, label, name, className = '' }) => (
  <label className={`flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer border transition-all duration-300 ${
    checked 
      ? 'border-primary bg-primary/5' 
      : 'border-gray-300 hover:border-primary'
  } ${className}`}>
    <div className="relative">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        checked 
          ? 'border-primary bg-primary' 
          : 'border-gray-300'
      }`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </div>
    <span className={`font-medium ${
      checked ? 'text-primary' : 'text-gray-700'
    }`}>{label}</span>
  </label>
);

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    success: 'bg-success text-white hover:bg-success/90'
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
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
    termsAccepted: false,
    
    // Add new payment state
    appOwnerPayment: {
      amount: '1500',
      upiId: '',
      qrCodeScanned: false,
      transactionId: ''
    }
  });

  // Add ref for video element
  const videoRef = React.useRef(null);
  const [isScanning, setIsScanning] = React.useState(false);

  // Initialize camera when component mounts
  React.useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    if (step === 11 && !isScanning) {
      startCamera();
    }

    // Cleanup camera when component unmounts or step changes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setIsScanning(false);
      }
    };
  }, [step]);

  // Add new state for saved steps
  const [savedSteps, setSavedSteps] = useState(new Set());

  // Add save functionality
  const handleSave = () => {
    setSavedSteps(prev => new Set([...prev, step]));
    // Here you would typically make an API call to save the data
    console.log('Saving data for step:', step, hotelData);
  };

  const propertyTypes = [
    'Hotel', 'Apartment', 'Hut House', 'Resort', 'Beach House', 'Villa','Homestay','Lodge','Boutique Hotel','Cottage'
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

  // Modify handleNext to check if current step is saved
  const handleNext = () => {
    if (step < 11) {
      if (!savedSteps.has(step)) {
        handleSave();
      }
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
    <div className="min-h-screen bg-gray-50">
      <StepIndicator currentStep={step} totalSteps={11} />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-6xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <motion.h1 
              className="text-3xl font-bold mb-8 text-gray-800"
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
              {step === 11 && "App Owner Payment"}
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Where's your place located?</h3>
                        <p className="text-gray-600">Enter your address and we'll help you set up your listing.</p>
                      </div>
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

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Pin your location</h3>
                      <p className="text-gray-600">Click on the map to select your property's location.</p>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="h-[400px] w-full rounded-lg overflow-hidden shadow-sm"
                      >
                        <MapContainer
                          center={[11.9416, 79.8083]}
                          zoom={13}
                          style={{ height: '100%', width: '100%' }}
                          className="rounded-lg"
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

              {step === 11 && (
                <PageTransition key="step11" direction="right">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-gray-800">App Owner Payment</h3>
                      <p className="text-gray-600">Complete the payment to activate your listing. You can pay through UPI or scan the QR code.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h4 className="text-lg font-semibold mb-4">Payment Details</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                <InputField
                                  type="number"
                                  value={hotelData.appOwnerPayment.amount}
                                  onChange={(e) => setHotelData({
                                    ...hotelData,
                                    appOwnerPayment: { ...hotelData.appOwnerPayment, amount: e.target.value }
                                  })}
                                  placeholder="Enter amount"
                                  className="pl-8"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                              <InputField
                                type="text"
                                value={hotelData.appOwnerPayment.upiId}
                                onChange={(e) => setHotelData({
                                  ...hotelData,
                                  appOwnerPayment: { ...hotelData.appOwnerPayment, upiId: e.target.value }
                                })}
                                placeholder="Enter UPI ID"
                              />
                            </div>
                            <div className="pt-4">
                              <Button
                                onClick={() => {
                                  // Handle UPI payment
                                  console.log('Processing UPI payment...');
                                }}
                                variant="primary"
                                className="w-full"
                              >
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <h4 className="text-lg font-semibold mb-4">Scan QR Code</h4>
                          <div className="space-y-4">
                            <div className="aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
                              <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-sm">
                                <img 
                                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=athrimr-2@okicici&pn=Hotel%20Booking&am=1000&cu=INR" 
                                  alt="UPI QR Code"
                                  className="w-full h-full"
                                />
                              </div>
                              <div className="absolute inset-0 border-4 border-[#FF5A5F] rounded-lg pointer-events-none"></div>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600">Scan this QR code with any UPI app</p>
                              <p className="text-sm text-gray-500 mt-1">Amount: ₹1000 (One-time activation fee)</p>
                            </div>
                            <div className="flex items-center justify-center space-x-4">
                              <Button
                                onClick={() => {
                                  setHotelData({
                                    ...hotelData,
                                    appOwnerPayment: {
                                      ...hotelData.appOwnerPayment,
                                      qrCodeScanned: true,
                                      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                                    }
                                  });
                                }}
                                variant="primary"
                              >
                                Mark as Paid
                              </Button>
                              <Button
                                onClick={() => {
                                  // Handle payment verification
                                  console.log('Verifying payment...');
                                }}
                                variant="secondary"
                              >
                                Verify Payment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-4">Payment Information</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-[#FF5A5F] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          One-time payment for listing activation
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-[#FF5A5F] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Secure payment processing
                        </li>
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-[#FF5A5F] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Instant confirmation
                        </li>
                      </ul>
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
              <div className="flex gap-4">
                {!savedSteps.has(step) && (
                  <Button
                    onClick={handleSave}
                    variant="secondary"
                  >
                    Save
                  </Button>
                )}
                {step < 11 ? (
                  <Button
                    onClick={handleNext}
                    variant="primary"
                  >
                    {savedSteps.has(step) ? "Next" : "Save and Next"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="success"
                  >
                    Complete Registration
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

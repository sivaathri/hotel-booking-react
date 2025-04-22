import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiInfo, FiCheck, FiClock, FiCalendar, FiCreditCard, FiShield } from 'react-icons/fi';
import HostHeader from './HostHeader';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { QRCodeSVG } from 'qrcode.react';
import { FiGrid } from "react-icons/fi"

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

const styles = `
  @keyframes checkmark {
    0% {
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes circle {
    0% {
      stroke-dashoffset: 283;
    }
    100% {
      stroke-dashoffset: 75;
    }
  }

  .animate-checkmark circle {
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: circle 1s ease-in-out forwards;
  }

  .animate-checkmark path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: checkmark 0.5s ease-in-out 0.5s forwards;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const CreateNewListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [formData, setFormData] = useState({
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
    mapLocation: null,

    // Step 3: Rooms Setup
    rooms: [{
      name: '',
      floor: '',
      bhk: '',
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
    availabilityCalendar: [],

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
      accountHolderName: ''
    },

    // Step 10: Verification
    idProof: null,
    propertyProof: null,
    termsAccepted: false,

    // Step 11: App Owner Payment
    paymentMethod: '',
    paymentStatus: 'pending',
    cardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  const propertyTypes = [
    'Hotel',
    'Apartment',
    'Hut House',
    'Resort',
    'Beach House',
    'Villa'
  ];

  const bedTypes = ['Queen', 'King', 'Twin'];
  const floorTypes = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor', '10th Floor'];
  const bhkTypes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Studio'];
  const roomFacilities = [
    'Private Bathroom',
    'Bathtub',
    'Kitchen Access',
    'Jacuzzi',
    'Washing Machine',
    'Air Conditioning',
    'Heating',
    'Free Wi-Fi',
    'Smart TV',
    'Breakfast Included',
    'Parking'
  ];

  const languages = ['English', 'Hindi'];
  const guestTypes = ['Married Couples', 'Families', 'Solo Travelers', 'Friends'];
  const paymentOptions = ['UPI', 'Bank Transfer', 'Cash at Check-In', 'Online'];
  const refundPolicies = ['Fully Refundable', 'Partial Refund', 'Non-refundable'];

  const handleNext = () => {
    if (step < 11) {
      setStep(step + 1);
    } else {
      // Handle payment completion
      if (formData.paymentMethod) {
        setPaymentSuccess(true);
        setShowSuccessAnimation(true);
        
        // After animation completes, navigate to dashboard
        setTimeout(() => {
          navigate('/host/dashboard');
        }, 3000);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleRoomChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  const addNewRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, {
        name: '',
        floor: '',
        bhk: '',
        capacity: '',
        bedType: '',
        hasBathroom: false,
        hasBalcony: false,
        balconyView: '',
        facilities: []
      }]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Name</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter property name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      className={`p-4 border rounded-lg text-center ${formData.propertyType === type
                          ? 'border-black bg-gray-100'
                          : 'hover:border-gray-400'
                        }`}
                      onClick={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                    >
                      <FiHome className="mx-auto mb-2" />
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Location Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zip/Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter zip/postal code"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>Make it clear to guests where your place is located. We'll only share your exact address after they've made a reservation.</p>
                <button
                  className="text-black underline hover:text-gray-700 mt-1"
                  onClick={() => window.open('https://www.tripngrub.com/help/location-privacy', '_blank')}
                >
                  Learn more
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  className="w-full p-4 border rounded-lg flex items-center justify-center gap-2 hover:border-gray-400"
                  onClick={() => setShowMap(true)}
                >
                  <FiMapPin />
                  Select Location on Map
                </button>
                <button
                  className="w-full p-4 border rounded-lg flex items-center justify-center gap-2 hover:border-gray-400"
                  onClick={async () => {
                    // Validate required fields
                    if (!formData.city || !formData.country) {
                      alert('Please enter at least the city and country');
                      return;
                    }

                    // Construct address parts with better formatting
                    const addressParts = [
                      formData.addressLine1,
                      formData.addressLine2,
                      formData.city,
                      formData.state,
                      formData.country,
                      formData.postalCode
                    ].filter(part => part && part.trim() !== '');

                    // First try: Full address with postal code
                    const fullAddress = addressParts.join(', ');
                    console.log('Searching for full address:', fullAddress);

                    try {
                      // Try with full address first using Nominatim
                      const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&addressdetails=1`,
                        {
                          headers: {
                            'User-Agent': 'TripNGrub/1.0 (https://tripngrub.com)',
                            'Accept-Language': 'en-US,en;q=0.9'
                          }
                        }
                      );
                      const data = await response.json();
                      console.log('Nominatim geocoding response:', data);

                      if (data && data[0]) {
                        const result = data[0];
                        const { lat, lon } = result;
                        const address = result.address || {};

                        // Validate the result matches our input
                        const isMatch = (
                          (!formData.city || address.city?.toLowerCase() === formData.city.toLowerCase()) &&
                          (!formData.state || address.state?.toLowerCase() === formData.state.toLowerCase()) &&
                          (!formData.country || address.country?.toLowerCase() === formData.country.toLowerCase()) &&
                          (!formData.postalCode || address.postcode === formData.postalCode)
                        );

                        if (isMatch) {
                          const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
                          console.log('Found matching location:', newLocation);

                          setSelectedLocation(newLocation);
                          setFormData(prev => ({
                            ...prev,
                            mapLocation: newLocation
                          }));
                          setShowMap(true);
                          return;
                        }
                      }

                      // If full address fails, try with just city and postal code
                      const cityPostal = `${formData.city}, ${formData.postalCode}`;
                      console.log('Trying city and postal code:', cityPostal);

                      const cityResponse = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityPostal)}&limit=1&addressdetails=1`,
                        {
                          headers: {
                            'User-Agent': 'TripNGrub/1.0 (https://tripngrub.com)',
                            'Accept-Language': 'en-US,en;q=0.9'
                          }
                        }
                      );
                      const cityData = await cityResponse.json();
                      console.log('City/postal geocoding response:', cityData);

                      if (cityData && cityData[0]) {
                        const result = cityData[0];
                        const { lat, lon } = result;
                        const address = result.address || {};

                        // Validate the result matches our input
                        const isMatch = (
                          (!formData.city || address.city?.toLowerCase() === formData.city.toLowerCase()) &&
                          (!formData.postalCode || address.postcode === formData.postalCode)
                        );

                        if (isMatch) {
                          const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
                          console.log('Found matching city location:', newLocation);

                          setSelectedLocation(newLocation);
                          setFormData(prev => ({
                            ...prev,
                            mapLocation: newLocation
                          }));
                          setShowMap(true);
                          return;
                        }
                      }

                      // If all attempts fail
                      alert(`Could not find an exact match for: ${fullAddress}\nPlease verify the address details and try again.`);
                    } catch (error) {
                      console.error('Error geocoding address:', error);
                      alert('Error finding location. Please try again.');
                    }
                  }}
                >
                  <FiMapPin />
                  Show Address on Map
                </button>
              </div>
              {formData.mapLocation && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected Location: {formData.city}, {formData.state}, {formData.country}
                </p>
              )}
            </div>
            {renderMap()}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
              <FiGrid className="text-blue-600" />
              Rooms Setup
            </h2>

            <div className="space-y-6">
              {formData.rooms.map((room, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-xl space-y-4 transition-shadow shadow-sm hover:shadow-lg bg-white"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Room {index + 1}</h3>
                    {index > 0 && (
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            rooms: prev.rooms.filter((_, i) => i !== index),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Floor</label>
                      <select
                        value={room.floor}
                        onChange={(e) => handleRoomChange(index, "floor", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Floor</option>
                        {floorTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">BHK Type</label>
                      <select
                        value={room.bhk}
                        onChange={(e) => handleRoomChange(index, "bhk", e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select BHK Type</option>
                        {bhkTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Room Name/Type</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => handleRoomChange(index, "name", e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., Deluxe Room, Family Suite"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      value={room.capacity}
                      onChange={(e) => handleRoomChange(index, "capacity", e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Number of guests"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bed Type</label>
                    <div className="grid grid-cols-3 gap-4">
                      {bedTypes.map((type) => (
                        <button
                          key={type}
                          className={`p-2 border rounded-xl text-center font-medium transition-colors duration-200 ${room.bedType === type
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "hover:border-gray-400 text-gray-700"
                            }`}
                          onClick={() => handleRoomChange(index, "bedType", type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={room.hasBathroom}
                          onChange={(e) =>
                            handleRoomChange(index, "hasBathroom", e.target.checked)
                          }
                        />
                        Attached Bathroom
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={room.hasBalcony}
                          onChange={(e) =>
                            handleRoomChange(index, "hasBalcony", e.target.checked)
                          }
                        />
                        Balcony/View
                      </label>
                    </div>
                  </div>

                  {room.hasBalcony && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Balcony View</label>
                      <input
                        type="text"
                        value={room.balconyView}
                        onChange={(e) =>
                          handleRoomChange(index, "balconyView", e.target.value)
                        }
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Sea, Garden, City"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-800">
                      Facilities
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {roomFacilities.map((facility) => {
                        const isSelected = room.facilities.includes(facility);
                        return (
                          <button
                            key={facility}
                            onClick={() => {
                              const newFacilities = isSelected
                                ? room.facilities.filter((f) => f !== facility)
                                : [...room.facilities, facility];
                              handleRoomChange(index, "facilities", newFacilities);
                            }}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium 
            ${isSelected
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                              }`}
                          >
                            {facility}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))}

              <button
                onClick={addNewRoom}
                className="w-full p-4 border border-dashed rounded-xl flex items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all text-blue-600 font-medium"
              >
                <FiHome className="text-xl" />
                Add Another Room
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Room Photos</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Upload 5 separate images for each room (Max size: 5MB per image)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, index) => {
                  const photo = formData.roomPhotos[index];
                  return (
                    <div key={index} className="relative">
                      {photo ? (
                        <>
                          <img src={URL.createObjectURL(photo)} alt={`Room photo ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                          <button
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              roomPhotos: prev.roomPhotos.filter((_, i) => i !== index)
                            }))}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <label className="border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400">
                          <FiImage className="text-2xl" />
                          <span className="text-sm">Upload Photo {index + 1}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              // Check file size
                              if (file.size > 5 * 1024 * 1024) {
                                alert('File exceeds the 5MB size limit');
                                return;
                              }

                              setFormData(prev => {
                                const newPhotos = [...prev.roomPhotos];
                                newPhotos[index] = file;
                                return {
                                  ...prev,
                                  roomPhotos: newPhotos
                                };
                              });
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
              {formData.roomPhotos.length > 0 && (
                <p className="text-sm text-gray-600">
                  {formData.roomPhotos.length} photo(s) uploaded. {5 - formData.roomPhotos.length} photo(s) remaining.
                </p>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Language Preference</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select languages spoken by staff</p>
              <div className="grid grid-cols-2 gap-4">
                {languages.map(language => (
                  <label key={language} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={() => handleArrayToggle('languages', language)}
                    />
                    {language}
                  </label>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Other Language</label>
                  <input
                    type="text"
                    name="otherLanguage"
                    value={formData.otherLanguage}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter other language"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">House Rules</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-In Time</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-Out Time</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="petsAllowed"
                    checked={formData.petsAllowed}
                    onChange={handleCheckboxChange}
                  />
                  Pets Allowed
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="smokingAllowed"
                    checked={formData.smokingAllowed}
                    onChange={handleCheckboxChange}
                  />
                  Smoking Allowed
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="alcoholAllowed"
                    checked={formData.alcoholAllowed}
                    onChange={handleCheckboxChange}
                  />
                  Alcohol Allowed
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="noiseRestrictions"
                    checked={formData.noiseRestrictions}
                    onChange={handleCheckboxChange}
                  />
                  Noise Restrictions
                </label>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Pricing & Availability</h2>

            {/* Room Summary Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Room Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Floor</th>

                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rooms Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Capacity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bed Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price/Night (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.rooms.map((room, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{room.floor || '-'}</td>

                        <td className="px-4 py-3 text-sm text-gray-900">{room.bhk || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{room.capacity ? `${room.capacity} persons` : '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{room.bedType || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <input
                            type="number"
                            value={room.price || ''}
                            onChange={(e) => handleRoomChange(index, "price", e.target.value)}
                            className="w-24 p-1 border rounded"
                            placeholder="Enter price"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-sm text-gray-600">Total Rooms: {formData.rooms.length}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Discounts</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.discounts.longStay}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        discounts: { ...prev.discounts, longStay: e.target.checked }
                      }))}
                    />
                    Long Stay Discount
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.discounts.earlyBird}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        discounts: { ...prev.discounts, earlyBird: e.target.checked }
                      }))}
                    />
                    Early Bird Discount
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.discounts.lastMinute}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        discounts: { ...prev.discounts, lastMinute: e.target.checked }
                      }))}
                    />
                    Last Minute Discount
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Refund Policy</label>
                <div className="grid grid-cols-3 gap-4">
                  {refundPolicies.map(policy => (
                    <button
                      key={policy}
                      className={`p-2 border rounded-lg text-center ${formData.refundPolicy === policy ? 'border-black bg-gray-100' : 'hover:border-gray-400'
                        }`}
                      onClick={() => setFormData(prev => ({ ...prev, refundPolicy: policy }))}
                    >
                      {policy}
                    </button>
                  ))}
                </div>
              </div>
             
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Guest Booking Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Who can book?</label>
                <div className="grid grid-cols-2 gap-4">
                  {guestTypes.map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.allowedGuests.includes(type)}
                        onChange={() => handleArrayToggle('allowedGuests', type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="instantBooking"
                    checked={formData.instantBooking}
                    onChange={handleCheckboxChange}
                  />
                  Instant Booking
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="manualApproval"
                    checked={formData.manualApproval}
                    onChange={handleCheckboxChange}
                  />
                  Manual Approval
                </label>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Payment Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Methods</label>
                <div className="grid grid-cols-2 gap-4">
                  {paymentOptions.map(method => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method)}
                        onChange={() => handleArrayToggle('paymentMethods', method)}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">PAN/GST ID</label>
                <input
                  type="text"
                  name="panGstId"
                  value={formData.panGstId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter PAN or GST ID"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bank Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Number</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.bankDetails.ifscCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, ifscCode: e.target.value }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountHolderName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountHolderName: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Verification & Submission</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">ID Proof</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    idProof: e.target.files[0]
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Property Ownership Proof</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    propertyProof: e.target.files[0]
                  }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                  />
                  I confirm all details are correct
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                  />
                  I accept TripNGrub's terms and policies
                </label>
              </div>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">App Owner Payment</h2>
            <div className="space-y-4">
              {showSuccessAnimation ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-16 h-16 text-green-500 animate-checkmark" 
                        viewBox="0 0 52 52"
                      >
                        <circle 
                          className="animate-circle" 
                          cx="26" 
                          cy="26" 
                          r="25" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        />
                        <path 
                          className="animate-check" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mt-6 text-green-600">Payment Successful!</h3>
                  <p className="text-gray-600 mt-2">Thank you for listing your property with TripNGrub</p>
                  <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-lg font-medium">Payment Amount: ₹1500</p>
                    <p className="text-sm text-gray-600">This is a one-time payment for listing your property on TripNGrub</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Choose Payment Method</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        className={`p-4 border rounded-lg text-center ${formData.paymentMethod === 'debit_card'
                            ? 'border-black bg-gray-100'
                            : 'hover:border-gray-400'
                          }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'debit_card' }))}
                      >
                        <FiCreditCard className="mx-auto mb-2" />
                        Debit Card
                      </button>

                      <button
                        className={`p-4 border rounded-lg text-center ${formData.paymentMethod === 'upi'
                            ? 'border-black bg-gray-100'
                            : 'hover:border-gray-400'
                          }`}
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                      >
                        <FiShield className="mx-auto mb-2" />
                        UPI Payment
                      </button>
                    </div>

                    {formData.paymentMethod === 'debit_card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Card Number</label>
                          <input
                            type="text"
                            value={formData.cardDetails.cardNumber}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              cardDetails: { ...prev.cardDetails, cardNumber: e.target.value }
                            }))}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter card number"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Expiry Date</label>
                            <input
                              type="text"
                              value={formData.cardDetails.expiryDate}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                cardDetails: { ...prev.cardDetails, expiryDate: e.target.value }
                              }))}
                              className="w-full p-2 border rounded-lg"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">CVV</label>
                            <input
                              type="text"
                              value={formData.cardDetails.cvv}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                cardDetails: { ...prev.cardDetails, cvv: e.target.value }
                              }))}
                              className="w-full p-2 border rounded-lg"
                              placeholder="CVV"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Scan the QR code to pay</p>
                          <div className="bg-white p-4 rounded-lg inline-block">
                            <QRCodeSVG
                              value={`upi://pay?pa=athrimr-2@okicici&pn=TripNGrub&am=1500&cu=INR`}
                              size={192}
                              level="H"
                              includeMargin={true}
                              className="w-48 h-48"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-600">UPI ID: athrimr-2@okicici</p>
                          <p className="mt-1 text-sm text-gray-600">Amount: ₹1500</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMap = () => {
    if (!showMap) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg w-4/5 h-4/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Location</h3>
            <button
              onClick={() => setShowMap(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="h-[calc(100%-40px)] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={selectedLocation || [11.9139, 79.8145]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    {formData.addressLine1} {formData.addressLine2}<br />
                    {formData.city}, {formData.state}<br />
                    {formData.country} {formData.postalCode}
                  </Popup>
                </Marker>
              )}
              <LocationMarker
                position={selectedLocation}
                setPosition={(pos) => {
                  setSelectedLocation(pos);
                  setFormData(prev => ({
                    ...prev,
                    mapLocation: pos
                  }));
                }}
                setAddress={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
                setAddressDetails={(details) => setFormData(prev => ({ ...prev, ...details }))}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <HostHeader />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold">Create your listing</h1>
            <span className="text-gray-500">Step {step} of 11</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full"
              style={{ width: `${(step / 11) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-6 py-2 border rounded-lg ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
              }`}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {step === 11 ? 'Complete Payment' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateNewListing; 
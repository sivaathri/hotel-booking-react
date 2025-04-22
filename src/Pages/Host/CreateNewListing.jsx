import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiInfo, FiCheck, FiClock, FiCalendar, FiCreditCard, FiShield } from 'react-icons/fi';
import HostHeader from './HostHeader';

const CreateNewListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
    mapLocation: { lat: null, lng: null },
    
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
    termsAccepted: false
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
    if (step < 10) {
      setStep(step + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      navigate('/host/dashboard');
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
                      className={`p-4 border rounded-lg text-center ${
                        formData.propertyType === type
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
                <label className="block text-sm font-medium mb-2">Pin Location on Map</label>
                <button className="w-full p-4 border rounded-lg flex items-center justify-center gap-2 hover:border-gray-400">
                  <FiMapPin />
                  Select Location on Map
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Rooms Setup</h2>
            <div className="space-y-6">
              {formData.rooms.map((room, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Room {index + 1}</h3>
                    {index > 0 && (
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          rooms: prev.rooms.filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Room Name/Type</label>
                      <input
                        type="text"
                        value={room.name}
                        onChange={(e) => handleRoomChange(index, 'name', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Deluxe Room, Family Suite"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Capacity</label>
                      <input
                        type="number"
                        value={room.capacity}
                        onChange={(e) => handleRoomChange(index, 'capacity', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Number of guests"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bed Type</label>
                    <div className="grid grid-cols-3 gap-4">
                      {bedTypes.map(type => (
                        <button
                          key={type}
                          className={`p-2 border rounded-lg text-center ${
                            room.bedType === type ? 'border-black bg-gray-100' : 'hover:border-gray-400'
                          }`}
                          onClick={() => handleRoomChange(index, 'bedType', type)}
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
                          onChange={(e) => handleRoomChange(index, 'hasBathroom', e.target.checked)}
                        />
                        Attached Bathroom
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={room.hasBalcony}
                          onChange={(e) => handleRoomChange(index, 'hasBalcony', e.target.checked)}
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
                        onChange={(e) => handleRoomChange(index, 'balconyView', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Sea, Garden, City"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">Facilities</label>
                    <div className="grid grid-cols-2 gap-4">
                      {roomFacilities.map(facility => (
                        <label key={facility} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={room.facilities.includes(facility)}
                            onChange={() => {
                              const newFacilities = room.facilities.includes(facility)
                                ? room.facilities.filter(f => f !== facility)
                                : [...room.facilities, facility];
                              handleRoomChange(index, 'facilities', newFacilities);
                            }}
                          />
                          {facility}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addNewRoom}
                className="w-full p-4 border rounded-lg flex items-center justify-center gap-2 hover:border-gray-400"
              >
                <FiHome />
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
              <p className="text-sm text-gray-600">Upload multiple images per room (Max size: 5MB per image)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.roomPhotos.map((photo, index) => (
                  <div key={index} className="relative">
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
                  </div>
                ))}
                <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400">
                  <FiImage className="text-2xl" />
                  <span className="text-sm">Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData(prev => ({
                        ...prev,
                        roomPhotos: [...prev.roomPhotos, ...files]
                      }));
                    }}
                  />
                </label>
              </div>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Per Night (₹)</label>
                <div className="flex items-center gap-2">
                  <FiDollarSign />
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter price per night"
                  />
                </div>
              </div>
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
                      className={`p-2 border rounded-lg text-center ${
                        formData.refundPolicy === policy ? 'border-black bg-gray-100' : 'hover:border-gray-400'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, refundPolicy: policy }))}
                    >
                      {policy}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Room Availability Calendar</label>
                <button className="w-full p-4 border rounded-lg flex items-center justify-center gap-2 hover:border-gray-400">
                  <FiCalendar />
                  Update Availability Calendar
                </button>
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
      default:
        return null;
    }
  };

  return (
    <>
      <HostHeader />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold">Create your listing</h1>
            <span className="text-gray-500">Step {step} of 10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full"
              style={{ width: `${(step / 10) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-6 py-2 border rounded-lg ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {step === 10 ? 'Submit Listing' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateNewListing; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiInfo, FiCheck, FiClock, FiCalendar, FiCreditCard, FiShield } from 'react-icons/fi';
import HostHeader from './HostHeader';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { QRCodeSVG } from 'qrcode.react';
import { FiGrid } from "react-icons/fi"
import Step1 from './CreateListingSteps/Step1';
import Step2 from './CreateListingSteps/Step2';
import Step3 from './CreateListingSteps/Step3';
import Step4 from './CreateListingSteps/Step4';
import Step5 from './CreateListingSteps/Step5';
import Step6 from './CreateListingSteps/Step6';
import Step7 from './CreateListingSteps/Step7';
import Step8 from './CreateListingSteps/Step8';
import Step9 from './CreateListingSteps/Step9';
import Step10 from './CreateListingSteps/Step10';
import Step11 from './CreateListingSteps/Step11';

// Add Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

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
      console.log('Selected Coordinates:', {
        latitude: newPosition.lat.toFixed(6),
        longitude: newPosition.lng.toFixed(6)
      });

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
          console.log('Address Details:', {
            fullAddress: data.display_name,
            addressComponents: address
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

  const handleNext = async () => {
    if (step < 11) {
      setStep(step + 1);
    } else {
      // Handle payment completion
      setShowSuccessAnimation(true);
      setTimeout(() => {
        navigate('/host/dashboard');
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} setFormData={setFormData} propertyTypes={propertyTypes} />;
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            showMap={showMap}
            setShowMap={setShowMap}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            floorTypes={floorTypes}
            bhkTypes={bhkTypes}
            bedTypes={bedTypes}
            roomFacilities={roomFacilities}
          />
        );
      case 4:
        return <Step4 formData={formData} setFormData={setFormData} />;
      case 5:
        return <Step5 formData={formData} setFormData={setFormData} languages={languages} />;
      case 6:
        return <Step6 formData={formData} setFormData={setFormData} />;
      case 7:
        return <Step7 formData={formData} setFormData={setFormData} refundPolicies={refundPolicies} />;
      case 8:
        return <Step8 formData={formData} setFormData={setFormData} guestTypes={guestTypes} />;
      case 9:
        return <Step9 formData={formData} setFormData={setFormData} paymentOptions={paymentOptions} />;
      case 10:
        return <Step10 formData={formData} setFormData={setFormData} />;
      case 11:
        return <Step11 formData={formData} setFormData={setFormData} showSuccessAnimation={showSuccessAnimation} />;
      default:
        return null;
    }
  };

  return (
    <>
      <HostHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900">Create your listing</h1>
                <span className="text-lg font-medium text-gray-600">Step {step} of 11</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(step / 11) * 100}%` }}
                />
              </div>
            </div>

            <div className="min-h-[600px]">
              {renderStep()}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                className={`px-8 py-3 border-2 rounded-xl text-lg font-medium transition-all duration-200 ${
                  step === 1 
                    ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                    : 'border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500'
                }`}
                disabled={step === 1}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {step === 11 ? 'Complete Payment' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewListing; 
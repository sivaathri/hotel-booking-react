import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HostHeader from './HostHeader';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { API_URL } from '../../config/api.config';
import { useUser } from '../../context/UserContext';
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
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    propertyName: '',
    propertyType: '',

    // Step 2: Location
    addressLine1: '',
    addressLine2: '',
    city: '',
    state_province: '',
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

  const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Twin'];
  const floorTypes = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor', '10th Floor'];
  const bhkTypes = [
    'Single',
    'Double',
    'Twin',
    'Twin/Double',
    'Triple',
    'Quadruple',
    'Family',
    'Suite',
    'Studio',
    'Apartment',
    'Dormitory Room',
    'Bed in Dormitory',
    'Bungalow',
    'Chalet',
    'Villa',
    'Holiday Home',
    'Mobile Home',
    'Tent',
    '1 BHK',
    '2 BHK',
    '3 BHK',
    '4 BHK',
    '5 BHK',
    '6 BHK'
  ];
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
    'Swimming Pool',
    'Parking',
    'Gym',
    'Laundry Service',
    'Room Service',
    '24-Hour Reception',
   'Cab Service',
   
  
    
  ];

  const languages = ['English', 'Hindi'];
  const guestTypes = ['Married Couples', 'Families', 'Solo Travelers', 'Friends'];
  const paymentOptions = ['UPI', 'Bank Transfer', 'Cash at Check-In', 'Online'];
  const refundPolicies = ['Fully Refundable', 'Partial Refund', 'Non-refundable'];

  const saveBasicInfo = async () => {
    try {
      setIsLoading(true);
  
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        `${API_URL}/basicInfo/create/${user.id}`,
        {
          property_name: formData.propertyName,
          property_type: formData.propertyType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Basic information saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStep(step + 1);
      } else {
        toast.error('Failed to save basic information. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error saving basic information:', error);
      toast.error('An error occurred while saving. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveLocationDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Ensure all required fields are present and not null
      const locationData = {
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2 || '',
        city: formData.city || '',
        state_province: formData.state_province || '',
        country: formData.country || '',
        postalCode: formData.postalCode || '',
        latitude: formData.mapLocation?.lat || 0,
        longitude: formData.mapLocation?.lng || 0
      };

      const response = await axios.post(
        `${API_URL}/location/create/${user.id}`,
        locationData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Location details saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStep(step + 1);
      } else {
        toast.error(response.data.message || 'Failed to save location details. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error saving location details:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoomSetup = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Process each room in the formData
      const roomPromises = formData.rooms.map(async (room) => {
        const response = await axios.post(
          `${API_URL}/roomSetup/`,
          {
            user_id: user.id,
            floor: room.floor,
            room_type: room.bhk,
            number_of_rooms: 1, // Assuming 1 room per entry
            capacity: room.capacity,
            bed_type: room.bedType,
            has_attached_bathroom: room.hasBathroom,
            has_balcony: room.hasBalcony,
            facilities: room.facilities
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        return response.data;
      });

      const results = await Promise.all(roomPromises);
      
      if (results.every(result => result.success)) {
        toast.success('Room setup saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStep(step + 1);
      } else {
        toast.error('Failed to save some room details. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error saving room setup:', error);
      toast.error('An error occurred while saving. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoomPhotos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!formData.roomPhotos || formData.roomPhotos.length === 0) {
        toast.error('Please add at least one room photo', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      // Create FormData object to send files
      const formDataToSend = new FormData();
      formData.roomPhotos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append('images', photo);
        }
      });

      const response = await axios.post(
        `${API_URL}/uploadImages/user/${user.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Room photos saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStep(step + 1);
      } else {
        toast.error(response.data.message || 'Failed to save room photos. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error saving room photos:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while saving. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      // Save basic information when in step 1
      await saveBasicInfo();
    } else if (step === 2) {
      // Save location details when in step 2
      await saveLocationDetails();
    } else if (step === 3) {
      // Save room setup when in step 3
      await saveRoomSetup();
    } else if (step === 4) {
      // Save room photos when in step 4
      await saveRoomPhotos();
    } else if (step < 11) {
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

  const handleNextStep = () => {
    if (step < 11) {
      setStep(step + 1);
    }
  };

  const renderStep = () => {
    const currentStep = (() => {
      switch (step) {
        case 1:
          return <Step1 formData={formData} setFormData={setFormData} propertyTypes={propertyTypes} isEditing={isEditing} />;
        case 2:
          return (
            <Step2
              formData={formData}
              setFormData={setFormData}
              showMap={showMap}
              setShowMap={setShowMap}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              isEditing={isEditing}
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
              isEditing={isEditing}
            />
          );
        case 4:
          return <Step4 formData={formData} setFormData={setFormData} isEditing={isEditing} />;
        case 5:
          return <Step5 formData={formData} setFormData={setFormData} languages={languages} isEditing={isEditing} />;
        case 6:
          return <Step6 formData={formData} setFormData={setFormData} isEditing={isEditing} />;
        case 7:
          return <Step7 formData={formData} setFormData={setFormData} refundPolicies={refundPolicies} isEditing={isEditing} />;
        case 8:
          return <Step8 formData={formData} setFormData={setFormData} guestTypes={guestTypes} isEditing={isEditing} />;
        case 9:
          return <Step9 formData={formData} setFormData={setFormData} paymentOptions={paymentOptions} isEditing={isEditing} />;
        case 10:
          return <Step10 formData={formData} setFormData={setFormData} isEditing={isEditing} />;
        case 11:
          return <Step11 formData={formData} setFormData={setFormData} showSuccessAnimation={showSuccessAnimation} isEditing={isEditing} />;
        default:
          return null;
      }
    })();

    return (
      <div className="relative">
        {currentStep}
        {step !== 11 && (
          <button
            onClick={handleNextStep}
            className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Next Step
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <HostHeader />
      <ToastContainer />
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
                disabled={isLoading}
                className={`px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Saving...' : (step === 11 ? 'Complete Payment' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewListing; 
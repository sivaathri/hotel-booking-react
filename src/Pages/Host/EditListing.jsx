import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api.config';
import { getAuthToken } from '../../utils/getAuthToken';
import axios from 'axios';
import HostHeader from './HostHeader';
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

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const bhkTypes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Studio','Villa'];
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

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/basicInfo/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const property = response.data.data;
          setFormData(prev => ({
            ...prev,
            propertyName: property.property_name,
            propertyType: property.property_type,
            // Add other property details as needed
          }));
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        toast.error('Failed to load property details');
        navigate('/host/listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, navigate]);

  const handleNext = async () => {
    if (step === 10) {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const response = await axios.put(
          `${API_URL}/basicInfo/property/${id}`,
          {
            property_name: formData.propertyName,
            property_type: formData.propertyType,
            // Add other fields as needed
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success('Property updated successfully!');
          navigate('/host/listings');
        }
      } catch (error) {
        console.error('Error updating property:', error);
        toast.error('Failed to update property');
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(step + 1);
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
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <>
      <HostHeader />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 10</span>
              <span className="text-sm font-medium text-gray-700">{Math.round((step / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-rose-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg border ${
                step === 1
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              {step === 10 ? 'Save Changes' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditListing; 
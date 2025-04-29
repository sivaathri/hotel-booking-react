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
  const [isEditing, setIsEditing] = useState(false);
  const [stepEditing, setStepEditing] = useState({});
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
  });

  const propertyTypes = [
    'Hotel',
    'Apartment',
    'Hut House',
    'Resort',
    'Beach House',
    'Villa'
  ];

  const bedTypes = ['Single'];
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
        const response = await axios.get(`${API_URL}/getall/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const property = response.data.data;
          
          // Log the raw property data
          console.log('Raw Property Data:', property);
          console.log('Location Data:', property.location);

          // Parse facilities from string to array if it exists
          const rooms = property.rooms?.map(room => ({
            name: `Room ${room.room_id}`,
            floor: room.floor?.toString() || '',
            bhk: room.room_type || '',
            capacity: room.capacity?.toString() || '',
            bedType: room.bed_type || '',
            hasBathroom: room.has_attached_bathroom === 1,
            hasBalcony: room.has_balcony === 1,
            balconyView: '',
            facilities: room.facilities ? JSON.parse(room.facilities) : []
          })) || [];

          // Initialize location data with empty values if location is null
          const locationData = property.location || {
            address_line1: '',
            address_line2: '',
            city: '',
            state_province: '',
            country: '',
            postal_code: '',
            coordinates: null
          };

          // Log the processed location data
          console.log('Processed Location Data:', locationData);

          setFormData(prev => ({
            ...prev,
            // Step 1: Basic Information
            propertyName: property.property_name || '',
            propertyType: property.property_type || '',

            // Step 2: Location
            addressLine1: locationData.address_line1 || '',
            addressLine2: locationData.address_line2 || '',
            city: locationData.city || '',
            state_province: locationData.state_province || '',
            country: locationData.country || '',
            postalCode: locationData.postal_code || '',
            mapLocation: locationData.coordinates || null,

            // Step 3: Rooms Setup
            rooms: rooms,

            // Step 4: Room Photos
            roomPhotos: property.room_photos || [],

            // Step 5: Language Preference
            languages: property.languages || [],
            otherLanguage: property.other_language || '',

            // Step 6: House Rules
            checkInTime: property.check_in_time || '',
            checkOutTime: property.check_out_time || '',
            petsAllowed: property.pets_allowed || false,
            smokingAllowed: property.smoking_allowed || false,
            alcoholAllowed: property.alcohol_allowed || false,
            noiseRestrictions: property.noise_restrictions || false,

            // Step 7: Pricing & Availability
            pricePerNight: property.price_per_night || '',
            discounts: property.discounts || {
              longStay: false,
              earlyBird: false,
              lastMinute: false
            },
            refundPolicy: property.refund_policy || '',
            availabilityCalendar: property.availability_calendar || [],

            // Step 8: Guest Booking Preferences
            allowedGuests: property.allowed_guests || [],
            instantBooking: property.instant_booking || false,
            manualApproval: property.manual_approval || false,

            // Step 9: Payment Setup
            paymentMethods: property.payment_methods || [],
            panGstId: property.pan_gst_id || '',
            bankDetails: property.bank_details || {
              accountNumber: '',
              ifscCode: '',
              accountHolderName: ''
            },

            // Step 10: Verification
            idProof: property.id_proof || null,
            propertyProof: property.property_proof || null,
            termsAccepted: property.terms_accepted || false,
          }));
          setIsEditing(true); // Enable editing mode since we have data
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
      return;
    }

    // Validate current step data before proceeding
    let canProceed = true;
    
    switch (step) {
      case 1:
        if (!formData.propertyName || !formData.propertyType) {
          canProceed = false;
          toast.error('Please fill in all required fields');
        }
        break;
      case 2:
        if (!formData.addressLine1 || !formData.city || !formData.state_province || !formData.country || !formData.postalCode) {
          canProceed = false;
          toast.error('Please fill in all address details');
        }
        break;
      case 3:
        if (formData.rooms.length === 0 || !formData.rooms[0].name || !formData.rooms[0].floor || !formData.rooms[0].bhk) {
          canProceed = false;
          toast.error('Please add at least one room with required details');
        }
        break;
      case 4:
        if (formData.roomPhotos.length === 0) {
          canProceed = false;
          toast.error('Please add at least one room photo');
        }
        break;
      case 5:
        if (formData.languages.length === 0) {
          canProceed = false;
          toast.error('Please select at least one language');
        }
        break;
      case 6:
        if (!formData.checkInTime || !formData.checkOutTime) {
          canProceed = false;
          toast.error('Please set check-in and check-out times');
        }
        break;
      case 7:
        if (!formData.pricePerNight || !formData.refundPolicy) {
          canProceed = false;
          toast.error('Please set price and refund policy');
        }
        break;
      case 8:
        if (formData.allowedGuests.length === 0) {
          canProceed = false;
          toast.error('Please select allowed guest types');
        }
        break;
      case 9:
        if (formData.paymentMethods.length === 0 || !formData.panGstId) {
          canProceed = false;
          toast.error('Please add payment methods and PAN/GST ID');
        }
        break;
    }

    if (canProceed) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStepEdit = (stepNumber) => {
    setStepEditing(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} setFormData={setFormData} propertyTypes={propertyTypes} isEditing={stepEditing[1] || false} />;
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            showMap={showMap}
            setShowMap={setShowMap}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            isEditing={stepEditing[2] || false}
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
            isEditing={stepEditing[3] || false}
          />
        );
      case 4:
        return <Step4 formData={formData} setFormData={setFormData} isEditing={stepEditing[4] || false} />;
      case 5:
        return <Step5 formData={formData} setFormData={setFormData} languages={languages} isEditing={stepEditing[5] || false} />;
      case 6:
        return <Step6 formData={formData} setFormData={setFormData} isEditing={stepEditing[6] || false} />;
      case 7:
        return <Step7 formData={formData} setFormData={setFormData} refundPolicies={refundPolicies} isEditing={stepEditing[7] || false} />;
      case 8:
        return <Step8 formData={formData} setFormData={setFormData} guestTypes={guestTypes} isEditing={stepEditing[8] || false} />;
      case 9:
        return <Step9 formData={formData} setFormData={setFormData} paymentOptions={paymentOptions} isEditing={stepEditing[9] || false} />;
      case 10:
        return <Step10 formData={formData} setFormData={setFormData} isEditing={stepEditing[10] || false} />;
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{Math.round((step / 10) * 100)}%</span>
              </div>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {step === 1 && "Basic Information"}
                {step === 2 && "Location Details"}
                {step === 3 && "Rooms Setup"}
                {step === 4 && "Room Photos"}
                {step === 5 && "Language Preference"}
                {step === 6 && "House Rules"}
                {step === 7 && "Pricing & Availability"}
                {step === 8 && "Guest Booking Preferences"}
                {step === 9 && "Payment Setup"}
                {step === 10 && "Verification"}
              </h2>
              <button
                onClick={() => handleStepEdit(step)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  stepEditing[step]
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {stepEditing[step] ? 'Save' : 'Edit'}
              </button>
            </div>
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
              className={`px-6 py-2 rounded-lg ${
                stepEditing[step]
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
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
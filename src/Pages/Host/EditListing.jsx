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
  
  // Add debug logging
  console.log('Route params:', useParams());
  console.log('Property ID from params:', id);

  // Add early return if no id
  if (!id) {
    console.error('No property ID found in URL parameters');
    toast.error('Invalid property ID');
    navigate('/host/listings');
    return null;
  }

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
    selectedRoomTypes: [],
    roomDetails: {},
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditStep, setCurrentEditStep] = useState(null);

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
        console.log('Property ID:', id); // Debug log
        if (!id) {
          toast.error('Property ID is missing');
          navigate('/host/listings');
          return;
        }
        setIsLoading(true);
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/getall/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const property = response.data.data[0]; // Get first property from array
          
          // Log the raw property data
          console.log('Raw Property Data:', property);
          console.log('Location Data:', property.location);

          // Parse room data
          const selectedRoomTypes = [property.room.room_type];
          const roomDetails = {
            [property.room.room_type]: {
              floor: property.room.floor ? `${property.room.floor}${property.room.floor === 1 ? 'st' : property.room.floor === 2 ? 'nd' : property.room.floor === 3 ? 'rd' : 'th'} Floor` : '',
              numberOfRooms: property.room.number_of_rooms || 1,
              bedType: 'Single', // Default value since not in API
              hasBathroom: true, // Default value since not in API
              hasBalcony: false, // Default value since not in API
              balconyView: '',
              facilities: [], // Default empty array since not in API
              pricePerNight: property.room.base_price?.toString() || '',
              occupancyRanges: [],
              individualRoomCapacities: {}
            }
          };

          // Add debug logging for room data
          console.log('Selected Room Types:', selectedRoomTypes);
          console.log('Room Details:', roomDetails);
          console.log('Original Room Data:', property.room);

          // Parse room photos
          const roomPhotos = property.room.image_paths ? JSON.parse(property.room.image_paths) : [];

          // Parse rules
          const rules = property.rules || {};

          setFormData(prev => ({
            ...prev,
            // Step 1: Basic Information
            propertyName: property.property_name || '',
            propertyType: property.property_type || '',

            // Step 2: Location
            addressLine1: property.location?.address_line1 || '',
            addressLine2: property.location?.address_line2 || '',
            city: property.location?.city || '',
            state_province: property.location?.state_province || '',
            country: property.location?.country || '',
            postalCode: property.location?.postal_code || '',
            mapLocation: property.location?.latitude && property.location?.longitude ? {
              lat: parseFloat(property.location.latitude),
              lng: parseFloat(property.location.longitude)
            } : null,

            // Step 3: Rooms Setup
            selectedRoomTypes: selectedRoomTypes,
            roomDetails: roomDetails,
            rooms: [{
              name: `Room ${property.room.room_id}`,
              numberOfRooms: property.room.number_of_rooms || 1,
              floor: property.room.floor ? `${property.room.floor}${property.room.floor === 1 ? 'st' : property.room.floor === 2 ? 'nd' : property.room.floor === 3 ? 'rd' : 'th'} Floor` : '',
              bhk: property.room.room_type || '',
              capacity: property.room.total_capacity?.toString() || '',
              bedType: 'Single', // Default value since not in API
              hasBathroom: true, // Default value since not in API
              hasBalcony: false, // Default value since not in API
              balconyView: '',
              facilities: [] // Default empty array since not in API
            }],

            // Step 4: Room Photos
            roomPhotos: roomPhotos,

            // Step 5: Language Preference
            languages: [], // Default empty array since not in API
            otherLanguage: '',

            // Step 6: House Rules
            checkInTime: rules.check_in_time || '',
            checkOutTime: rules.check_out_time || '',
            petsAllowed: rules.pets_allowed || false,
            smokingAllowed: rules.smoking_allowed || false,
            alcoholAllowed: rules.alcohol_allowed || false,
            noiseRestrictions: false, // Default value since not in API

            // Step 7: Pricing & Availability
            pricePerNight: property.room.base_price?.toString() || '',
            discounts: {
              longStay: false,
              earlyBird: false,
              lastMinute: false
            },
            refundPolicy: 'Fully Refundable', // Default value since not in API
            availabilityCalendar: [],

            // Step 8: Guest Booking Preferences
            allowedGuests: [
              ...(rules.can_book_married_couples ? ['Married Couples'] : []),
              ...(rules.can_book_families ? ['Families'] : []),
              ...(rules.can_book_solo_travelers ? ['Solo Travelers'] : []),
              ...(rules.can_book_friends ? ['Friends'] : [])
            ],
            instantBooking: rules.instant_booking || false,
            manualApproval: rules.manual_approval || false,

            // Step 9: Payment Setup
            paymentMethods: [], // Default empty array since not in API
            panGstId: '', // Default empty string since not in API
            bankDetails: {
              accountNumber: '',
              ifscCode: '',
              accountHolderName: ''
            },

            // Step 10: Verification
            idProof: null,
            propertyProof: null,
            termsAccepted: false,
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

  const handleStepEdit = async (stepNumber) => {
    if (isEditMode && currentEditStep === stepNumber) {
      // If already in edit mode for this step, save the changes
      try {
        setIsLoading(true);
        const token = getAuthToken();
        let updateData = {};

        // Prepare update data based on the current step
        switch (stepNumber) {
          case 1: // Basic Information
            if (!formData.propertyName || !formData.propertyType) {
              toast.error('Please fill in all required fields for Basic Information');
              return;
            }
            updateData = {
              property_name: formData.propertyName,
              property_type: formData.propertyType
            };
            break;
          case 2: // Location
            if (!formData.addressLine1 || !formData.city || !formData.state_province || !formData.country || !formData.postalCode) {
              toast.error('Please fill in all required address details');
              return;
            }
            updateData = {
              location: {
                address_line1: formData.addressLine1,
                address_line2: formData.addressLine2,
                city: formData.city,
                state_province: formData.state_province,
                country: formData.country,
                postal_code: formData.postalCode,
                latitude: formData.mapLocation?.lat || '',
                longitude: formData.mapLocation?.lng || ''
              }
            };
            break;
          case 3: // Rooms
            if (formData.rooms.length === 0 || !formData.rooms[0].name || !formData.rooms[0].floor || !formData.rooms[0].bhk) {
              toast.error('Please add at least one room with required details');
              return;
            }
            // Log the room data structure
            console.log('Step 3 Room Data:', {
              rooms: formData.rooms.map(room => ({
                floor: room.floor,
                room_type: room.bhk,
                number_of_rooms: room.numberOfRooms,
                capacity: room.capacity,
                bed_type: room.bedType,
                has_attached_bathroom: room.hasBathroom ? 1 : 0,
                has_balcony: room.hasBalcony ? 1 : 0,
                facilities: JSON.stringify(room.facilities)
              }))
            });
            updateData = {
              rooms: formData.rooms.map(room => ({
                floor: room.floor,
                room_type: room.bhk,
                number_of_rooms: room.numberOfRooms,
                capacity: room.capacity,
                bed_type: room.bedType,
                has_attached_bathroom: room.hasBathroom ? 1 : 0,
                has_balcony: room.hasBalcony ? 1 : 0,
                facilities: JSON.stringify(room.facilities)
              }))
            };
            break;
          case 4: // Room Photos
            if (formData.roomPhotos.length === 0) {
              toast.error('Please add at least one room photo');
              return;
            }
            updateData = {
              room_photos: formData.roomPhotos
            };
            break;
          case 5: // Language Preference
            if (formData.languages.length === 0) {
              toast.error('Please select at least one language');
              return;
            }
            updateData = {
              languages: formData.languages,
              other_language: formData.otherLanguage
            };
            break;
          case 6: // House Rules
            if (!formData.checkInTime || !formData.checkOutTime) {
              toast.error('Please set check-in and check-out times');
              return;
            }
            updateData = {
              check_in_time: formData.checkInTime,
              check_out_time: formData.checkOutTime,
              pets_allowed: formData.petsAllowed,
              smoking_allowed: formData.smokingAllowed,
              alcohol_allowed: formData.alcoholAllowed,
              noise_restrictions: formData.noiseRestrictions
            };
            break;
          case 7: // Pricing & Availability
            if (!formData.pricePerNight || !formData.refundPolicy) {
              toast.error('Please set price and refund policy');
              return;
            }
            updateData = {
              price_per_night: formData.pricePerNight,
              discounts: formData.discounts,
              refund_policy: formData.refundPolicy,
              availability_calendar: formData.availabilityCalendar
            };
            break;
          case 8: // Guest Booking Preferences
            if (formData.allowedGuests.length === 0) {
              toast.error('Please select allowed guest types');
              return;
            }
            updateData = {
              allowed_guests: formData.allowedGuests,
              instant_booking: formData.instantBooking,
              manual_approval: formData.manualApproval
            };
            break;
          case 9: // Payment Setup
            if (formData.paymentMethods.length === 0 || !formData.panGstId) {
              toast.error('Please add payment methods and PAN/GST ID');
              return;
            }
            updateData = {
              payment_methods: formData.paymentMethods,
              pan_gst_id: formData.panGstId,
              bank_details: formData.bankDetails
            };
            break;
          case 10: // Verification
            if (!formData.idProof || !formData.propertyProof || !formData.termsAccepted) {
              toast.error('Please complete all verification requirements');
              return;
            }
            updateData = {
              id_proof: formData.idProof,
              property_proof: formData.propertyProof,
              terms_accepted: formData.termsAccepted
            };
            break;
        }

        const response = await axios.put(
          `${API_URL}/getall/${id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(`Step ${stepNumber} updated successfully!`);
          setIsEditMode(false);
          setCurrentEditStep(null);
          setStepEditing(prev => ({
            ...prev,
            [stepNumber]: false
          }));
        } else {
          toast.error(`Failed to update Step ${stepNumber}: ${response.data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error updating property:', error);
        toast.error(`Failed to update Step ${stepNumber}: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enter edit mode for this step
      setIsEditMode(true);
      setCurrentEditStep(stepNumber);
      setStepEditing(prev => ({
        ...prev,
        [stepNumber]: true
      }));
    }
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
                  isEditMode && currentEditStep === step
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditMode && currentEditStep === step ? 'Save' : 'Edit'}
              </button>
            </div>
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={step === 1 || isEditMode}
              className={`px-6 py-2 rounded-lg border ${
                step === 1 || isEditMode
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isEditMode}
              className={`px-6 py-2 rounded-lg ${
                isEditMode
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
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
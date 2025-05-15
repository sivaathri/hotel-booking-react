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
import { getAuthToken } from '../../utils/getAuthToken';
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
  const [completedSteps, setCompletedSteps] = useState(new Set());
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
     
    }],

    // Step 4: Room Photos
    roomPhotos: [],

    // Step 5: Property Rules & Policies
    // Must Read Rules
    checkInTime: null,
    checkOutTime: null,
    minAge: 18,
    acceptedIds: [],

    // Guest Profile
    unmarriedCouplesAllowed: false,
    maleOnlyGroupsAllowed: false,
    scantyBaggageAllowed: false,

    // Smoking & Alcohol
    smokingAllowed: false,
    alcoholAllowed: false,

    // Food Arrangement
    nonVegAllowed: false,
    outsideFoodAllowed: false,
    foodDeliveryOptions: [],

    // Property Accessibility
    wheelchairAccessible: false,
    wheelchairProvided: false,

    // Pet Policy
    petsAllowed: false,
    petsOnProperty: false,

    // Child & Extra Bed Policy
    extraMattressChildCost: 0,
    extraMattressAdultCost: 0,
    extraCotCost: 0,

    // Other Rules
    otherRules: '',

    // Step 6: Language Preference
    languages: [],
    otherLanguage: '',

    // Step 7: House Rules
    checkInTime: '',
    checkOutTime: '',
    petsAllowed: false,
    smokingAllowed: false,
    alcoholAllowed: false,
    noiseRestrictions: false,

    // Step 8: Pricing & Availability
    pricePerNight: '',
    discounts: {
      longStay: false,
      earlyBird: false,
      lastMinute: false
    },
    refundPolicy: '',
    availabilityCalendar: [],

    // Step 9: Guest Booking Preferences
    allowedGuests: [],
    instantBooking: false,
    manualApproval: false,

    // Step 10: Payment Setup
    paymentMethods: [],
    panGstId: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    },

    // Step 11: Verification
    idProof: null,
    propertyProof: null,
    termsAccepted: false,

    // Step 12: App Owner Payment
    paymentMethod: '',
    paymentStatus: 'pending',
    cardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    },
    roomIds: [],
    property_id: null
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
  
      const token = getAuthToken();
  
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
        // Store the property_id in formData
        const property_id = response.data.data.property_id;
        console.log('Received property_id:', property_id); // Debug log
        
        setFormData(prev => ({
          ...prev,
          property_id: property_id
        }));

        // Verify property_id was set
        console.log('Updated formData:', { ...formData, property_id }); // Debug log

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
      const token = getAuthToken();

      if (!formData.property_id) {
        toast.error('Property ID is missing. Please complete Step 1 first.', {
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

      // Ensure all required fields are present and not null
      const locationData = {
        property_id: formData.property_id,
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
      const token = getAuthToken();

      if (!formData.property_id) {
        toast.error('Property ID is missing. Please complete Step 1 first.', {
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

      // Process each room in the formData
      const roomPromises = formData.rooms.map(async (room) => {
        const response = await axios.post(
          `${API_URL}/roomSetup/`,
          {
            property_id: formData.property_id,
            user_id: user.id,
            floor: room.floor,
            room_type: room.bhk,
            number_of_rooms: 1, // Assuming 1 room per entry
           
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
        // Store the room IDs for later use
        const roomIds = results.map(result => result.insertId);
        setFormData(prev => ({ ...prev, roomIds }));
        
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
      const token = getAuthToken();

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

      if (!formData.roomIds || formData.roomIds.length === 0) {
        toast.error('No room IDs found. Please complete room setup first.', {
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

      // Upload images for each room
      const uploadPromises = formData.roomIds.map(roomId => 
        axios.post(
          `${API_URL}/uploadImages/room/${roomId}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      );

      const results = await Promise.all(uploadPromises);
      
      if (results.every(result => result.data.success)) {
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
        toast.error('Failed to save some room photos. Please try again.', {
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
      toast.error('An error occurred while saving photos. Please try again.', {
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

  const savePropertyRules = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      // Validate property_id exists
      if (!formData.property_id) {
        toast.error('Property ID is missing. Please complete Step 1 first.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      // Format the data according to the database schema
      const propertyData = {
        property_id: formData.property_id,
        user_id: user.id,
        // Basic property rules
        check_in_time: formData.checkInTime,
        check_out_time: formData.checkOutTime,
        min_guest_age: formData.minAge,

        // ID proof - take the first selected ID type
        proof_type: formData.acceptedIds[0] || null,

        // Guest profile rules
        unmarried_couples_allowed: formData.unmarriedCouplesAllowed,
        male_only_groups_allowed: formData.maleOnlyGroupsAllowed,
        scanty_baggage_allowed: formData.scantyBaggageAllowed,

        // Smoking & alcohol rules
        smoking_allowed: formData.smokingAllowed,
        alcohol_allowed: formData.alcoholAllowed,

        // Food rules
        non_veg_allowed: formData.nonVegAllowed,
        outside_food_allowed: formData.outsideFoodAllowed,
        // Take the first food delivery service if any are selected
        food_delivery_service: formData.foodDeliveryOptions[0] || null,

        // Accessibility rules
        wheelchair_accessible: formData.wheelchairAccessible,
        wheelchair_provided: formData.wheelchairProvided,

        // Pet policy
        pets_allowed: formData.petsAllowed,
        pets_on_property: formData.petsOnProperty,

        // Extra bed policy
        mattress_cost_child: formData.extraMattressChildCost,
        mattress_cost_adult: formData.extraMattressAdultCost,
        cot_cost: formData.extraCotCost,

        // Additional rules
        rule_description: formData.otherRules
      };

      console.log('Sending property rules data:', propertyData); // Debug log

      const response = await axios.post(
        `${API_URL}/property/rules/create/${user.id}`,
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Property rules saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStep(step + 1);
        return true;
      } else {
        toast.error(response.data.message || 'Failed to save property rules. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving property rules:', error);
      // More detailed error message
      const errorMessage = error.response?.data?.message || 
        (error.response?.status === 404 ? 'Property not found. Please complete Step 1 first.' : 
        'An error occurred while saving. Please try again.');
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveFacilities = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!formData.property_id) {
        toast.error('Property ID is missing. Please complete Step 1 first.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      // Create facilities object from formData with exact database column names
      const facilitiesData = {
        gym: formData.gym || false,
        swimming_pool: formData.swimmingPool || false,
        spa: formData.spa || false,
        restaurant: formData.restaurant || false,
        room_service_24hr: formData.roomService || false,
        lounge: formData.lounge || false,
        steam_sauna: formData.steamSauna || false,
        bar: formData.bar || false,
        free_parking: formData.freeParking || false,
        free_wifi: formData.freeWifi || false,
        refrigerator: formData.refrigerator || false,
        laundry_service: formData.laundryService || false,
        housekeeping: formData.housekeeping || false,
        air_conditioning: formData.airConditioning || false,
        power_backup: formData.powerBackup || false,
        ev_charging: formData.evCharging || false,
        smoke_detector: formData.smokeDetector || false,
        umbrellas: formData.umbrellas || false,
        elevator: formData.elevator || false,
        paid_lan: formData.paidLan || false,
        dining_area: formData.diningArea || false,
        cafe_24hr: formData.cafe24h || false,
        barbeque: formData.barbeque || false,
        bakery: formData.bakery || false,
        coffee_shop_24hr: formData.coffeeShop24h || false,
        fire_extinguishers: formData.fireExtinguishers || false,
        cctv: formData.cctv || false,
        security_alarms: formData.securityAlarms || false,
        reflexology: formData.reflexology || false,
        first_aid: formData.firstAid || false,
        tv: formData.tv || false,
        luggage_storage: formData.luggageStorage || false,
        wake_up_call: formData.wakeupCall || false,
        concierge: formData.concierge || false,
        doctor_on_call: formData.doctorOnCall || false,
        wheelchair: formData.wheelchair || false,
        luggage_assistance: formData.luggageAssistance || false,
        bellboy_service: formData.bellboyService || false,
        accessible_facilities: formData.disabledFacilities || false,
        pool_beach_towels: formData.poolTowels || false,
        multilingual_staff: formData.multilingualStaff || false,
        massage: formData.massage || false,
        printer: formData.printer || false,
        photocopying: formData.photocopying || false,
        conference_room: formData.conferenceRoom || false,
        banquet: formData.banquet || false
      };

      const response = await axios.post(
        `${API_URL}/amenities/facilities/${formData.property_id}`,
        facilitiesData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Facilities saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      } else {
        toast.error(response.data.message || 'Failed to save facilities. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving facilities:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoomPricing = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!formData.property_id) {
        toast.error('Property ID is missing. Please complete Step 1 first.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      // Process each room's pricing data
      const roomPricingPromises = formData.rooms.map(async (room) => {
        // Calculate room capacities
        const roomCapacityAdults = Object.values(room.individualRoomCapacities || {}).reduce((sum, capacity) => 
          sum + (capacity?.adults || 0), 0);
        const roomCapacityChildren = Object.values(room.individualRoomCapacities || {}).reduce((sum, capacity) => 
          sum + (capacity?.children || 0), 0);

        // Calculate total capacity
        const totalCapacity = roomCapacityAdults + roomCapacityChildren;

        // Format occupancy price adjustments
        const occupancyPriceAdjustments = (room.occupancyRanges || []).map(range => ({
          minGuests: range.minGuests,
          maxGuests: range.maxGuests,
          adjustment: range.value,
          type: range.type
        }));

        // Format child pricing data
        const childPricingData = (formData.childPricing || []).map(pricing => ({
          ageFrom: pricing.ageFrom,
          ageTo: pricing.ageTo,
          price: pricing.price,
          type: pricing.type
        }));

        const pricingData = {
          property_id: formData.property_id,
          floor: room.floor,
          room_type: room.bhk,
          number_of_rooms: room.numberOfRooms,
          room_capacity_adults: roomCapacityAdults,
          room_capacity_children: roomCapacityChildren,
          total_capacity: totalCapacity,
          base_price: parseFloat(room.pricePerNight),
          occupancy_price_adjustments: JSON.stringify(occupancyPriceAdjustments),
          child_pricing: JSON.stringify(childPricingData),
          instant_payment_enabled: formData.instantPayment || false,
          free_cancellation_enabled: formData.freeCancellation || false,
          // Refund Policy 1 - Fully Refundable
          refundable1: formData.refundPolicies?.[0]?.type === 'Fully Refundable',
          days_before1: formData.refundPolicies?.[0]?.daysBeforeCheckIn || null,
          refund_percent1: formData.refundPolicies?.[0]?.percentage || null,
          // Refund Policy 2 - Partially Refundable
          refundable2: formData.refundPolicies?.[1]?.type === 'Partial Refund',
          days_before2: formData.refundPolicies?.[1]?.daysBeforeCheckIn || null,
          refund_percent2: formData.refundPolicies?.[1]?.percentage || null,
          // Refund Policy 3 - Non-Refundable
          refundable3: formData.refundPolicies?.[2]?.type === 'Non-refundable',
          days_before3: formData.refundPolicies?.[2]?.daysBeforeCheckIn || null,
          refund_percent3: formData.refundPolicies?.[2]?.percentage || null
        };

        const response = await axios.post(
          `${API_URL}/roomPricing/create`,
          pricingData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        return response.data;
      });

      const results = await Promise.all(roomPricingPromises);
      
      if (results.every(result => result.success)) {
        toast.success('Room pricing saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      } else {
        toast.error('Failed to save some room pricing details. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving room pricing:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveGuestBookingPreferences = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!formData.property_id) {
        toast.error('Property ID is missing. Please complete Step 1 first.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }

      const bookingPreferencesData = {
        property_id: formData.property_id,
        description: formData.description || '',
        nearest_beach_distance: formData.nearest_beach_distance || 0,
        nearest_railway_station_distance: formData.nearest_railway_station_distance || 0,
        nearest_airport_distance: formData.nearest_airport_distance || 0,
        nearest_bus_stand_distance: formData.nearest_bus_stand_distance || 0,
        can_book_married_couples: formData.allowedGuests?.includes('Married Couples') || false,
        can_book_families: formData.allowedGuests?.includes('Families') || false,
        can_book_solo_travelers: formData.allowedGuests?.includes('Solo Travelers') || false,
        can_book_friends: formData.allowedGuests?.includes('Friends') || false,
        instant_booking: formData.instant_booking || false,
        manual_approval: formData.manual_approval || false
      };

      const response = await axios.post(
        `${API_URL}/propertyDetails/create-or-update`,
        bookingPreferencesData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Guest booking preferences saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      } else {
        toast.error(response.data.message || 'Failed to save guest booking preferences. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }
    } catch (error) {
      console.error('Error saving guest booking preferences:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      // Save basic information when in step 1
      await saveBasicInfo();
      setCompletedSteps(prev => new Set([...prev, 1]));
    } else if (step === 2) {
      // Save location details when in step 2
      await saveLocationDetails();
      setCompletedSteps(prev => new Set([...prev, 2]));
    } else if (step === 3) {
      // Save room setup when in step 3
      await saveRoomSetup();
      setCompletedSteps(prev => new Set([...prev, 3]));
    } else if (step === 4) {
      // Save room photos when in step 4
      await saveRoomPhotos();
      setCompletedSteps(prev => new Set([...prev, 4]));
    } else if (step === 5) {
      // Save property rules when in step 5
      const success = await savePropertyRules();
      if (success) {
        setCompletedSteps(prev => new Set([...prev, 5]));
        setStep(step + 1);
      }
    } else if (step === 6) {
      // Save facilities when in step 6
      const success = await saveFacilities();
      if (success) {
        setCompletedSteps(prev => new Set([...prev, 6]));
        setStep(step + 1);
      }
    } else if (step === 7) {
      // Save room pricing when in step 7
      const success = await saveRoomPricing();
      if (success) {
        setCompletedSteps(prev => new Set([...prev, 7]));
        setStep(step + 1);
      }
    } else if (step === 8) {
      // Save guest booking preferences when in step 8
      const success = await saveGuestBookingPreferences();
      if (success) {
        setCompletedSteps(prev => new Set([...prev, 8]));
        setStep(step + 1);
      }
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
    if (step > 1 && !completedSteps.has(step - 1)) {
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
          return <Step5 formData={formData} setFormData={setFormData} languages={languages} isEditing={isEditing} savePropertyRules={savePropertyRules} />;
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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  step === 1 || completedSteps.has(step - 1)
                    ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                    : 'border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500'
                }`}
                disabled={step === 1 || completedSteps.has(step - 1)}
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
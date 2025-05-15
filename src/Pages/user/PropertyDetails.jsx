import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaSnowflake, FaConciergeBell, FaBed, FaArrowUp, FaUmbrellaBeach, FaVideo, FaFirstAid, FaBell, FaSuitcaseRolling, FaHandHoldingHeart, FaRuler, FaUser, FaChild, FaCalendarCheck, FaMoneyBillWave, FaCheck } from 'react-icons/fa';
import { MdMeetingRoom, MdLocalLaundryService, MdPower, MdSecurity, MdTv, MdRoom } from 'react-icons/md';
import { GiVacuumCleaner } from 'react-icons/gi';
import { BiRestaurant } from 'react-icons/bi';
import Header from './Header';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

// Add API URL constant
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to construct image URL
const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  return `${API_URL}/assets/${path}`;
};

const FACILITY_MAP = [
  { key: 'room_service_24hr', label: 'Room service', icon: <FaConciergeBell /> },
  { key: 'free_wifi', label: 'Free WiFi', icon: <FaWifi /> },
  { key: 'non_smoking_rooms', label: 'Non-smoking rooms', icon: <FaBed /> },
  { key: 'facilities_for_disabled_guests', label: 'Facilities for disabled guests', icon: <MdSecurity /> },
  { key: 'free_parking', label: 'Free parking', icon: <FaParking /> },
  { key: 'airport_shuttle', label: 'Airport shuttle', icon: <FaSuitcaseRolling /> },
  { key: 'family_rooms', label: 'Family rooms', icon: <MdRoom /> },
  { key: 'tea_coffee_maker', label: 'Tea/coffee maker in all rooms', icon: <BiRestaurant /> },
  { key: 'very_good_breakfast', label: <span className="underline">Very good breakfast</span>, icon: <FaUtensils /> },
  { key: 'swimming_pool', label: 'Swimming Pool', icon: <FaSwimmingPool /> },
  { key: 'restaurant', label: 'Restaurant', icon: <FaUtensils /> },
  { key: 'lounge', label: 'Lounge', icon: <FaBed /> },
  { key: 'refrigerator', label: 'Refrigerator', icon: <MdPower /> },
  { key: 'housekeeping', label: 'Housekeeping', icon: <GiVacuumCleaner /> },
  { key: 'air_conditioning', label: 'Air Conditioning', icon: <FaSnowflake /> },
  { key: 'power_backup', label: 'Power Backup', icon: <MdPower /> },
  { key: 'smoke_detector', label: 'Smoke Detector', icon: <MdSecurity /> },
  { key: 'elevator', label: 'Elevator', icon: <FaArrowUp /> },
  { key: 'fire_extinguishers', label: 'Fire Extinguishers', icon: <FaFirstAid /> },
  { key: 'cctv', label: 'CCTV Security', icon: <FaVideo /> },
  { key: 'security_alarms', label: 'Security Alarms', icon: <MdSecurity /> },
  { key: 'first_aid', label: 'First Aid', icon: <FaFirstAid /> },
  { key: 'tv', label: 'TV', icon: <MdTv /> },
  { key: 'luggage_storage', label: 'Luggage Storage', icon: <FaSuitcaseRolling /> },
  { key: 'wake_up_call', label: 'Wake-up Call', icon: <FaBell /> },
  { key: 'doctor_on_call', label: 'Doctor on Call', icon: <FaFirstAid /> },
  { key: 'luggage_assistance', label: 'Luggage Assistance', icon: <FaSuitcaseRolling /> },
  { key: 'pool_beach_towels', label: 'Pool/Beach Towels', icon: <FaUmbrellaBeach /> },
  { key: 'massage', label: 'Massage', icon: <FaHandHoldingHeart /> },
  { key: 'printer', label: 'Printer', icon: <MdPower /> },
  { key: 'photocopying', label: 'Photocopying', icon: <MdPower /> },
  { key: 'conference_room', label: 'Conference Room', icon: <MdMeetingRoom /> },
  { key: 'banquet', label: 'Banquet', icon: <MdMeetingRoom /> },
  // Add more as needed
];

// Helper to convert rules object to readable array
function getReadableRules(rules) {
  if (!rules) return [];
  const readable = [];

  if (rules.min_guest_age)
    readable.push(`Primary guest should be at least ${rules.min_guest_age} years of age`);
  if (rules.proof_type)
    readable.push(`${rules.proof_type.charAt(0).toUpperCase() + rules.proof_type.slice(1)} is accepted as ID proof`);
  if ('pets_allowed' in rules)
    readable.push(rules.pets_allowed ? "Pets are allowed" : "Pets are not allowed");
  if ('smoking_allowed' in rules)
    readable.push(rules.smoking_allowed ? "Smoking is allowed" : "Smoking within the premises is not allowed");
  if ('alcohol_allowed' in rules)
    readable.push(rules.alcohol_allowed ? "Alcohol is allowed" : "Alcohol is not allowed");
  if ('non_veg_allowed' in rules)
    readable.push(rules.non_veg_allowed ? "Non-veg food is allowed" : "Non-veg food is not allowed");
  if ('outside_food_allowed' in rules)
    readable.push(rules.outside_food_allowed ? "Outside food is allowed" : "Outside food is not allowed");
  if ('unmarried_couples_allowed' in rules)
    readable.push(rules.unmarried_couples_allowed ? "Unmarried couples are allowed" : "Unmarried couples are not allowed");
  if ('male_only_groups_allowed' in rules)
    readable.push(rules.male_only_groups_allowed ? "Male-only groups are allowed" : "Male-only groups are not allowed");
  if ('scanty_baggage_allowed' in rules)
    readable.push(rules.scanty_baggage_allowed ? "Scanty baggage is allowed" : "Scanty baggage is not allowed");
  if ('wheelchair_accessible' in rules)
    readable.push(rules.wheelchair_accessible ? "Wheelchair accessible" : "Not wheelchair accessible");
  if ('wheelchair_provided' in rules)
    readable.push(rules.wheelchair_provided ? "Wheelchair provided" : "Wheelchair not provided");
  if (rules.rule_description)
    readable.push(rules.rule_description);

  return readable;
}

function getRulesSections(rules) {
  if (!rules) return {};

  return {
    "Must Read Rules": [
      rules.min_guest_age ? `Primary guest should be at least ${rules.min_guest_age} years of age` : null,
      rules.proof_type ? `${rules.proof_type.charAt(0).toUpperCase() + rules.proof_type.slice(1)} is accepted as ID proof` : null,
      rules.pets_allowed === 0 ? "Pets are not allowed" : null,
      rules.smoking_allowed === 0 ? "Smoking within the premises is not allowed" : null,
    ].filter(Boolean),
    "Guest Profile": [
      rules.unmarried_couples_allowed === 1 ? "Unmarried couples allowed" : null,
      rules.min_guest_age ? `Primary guest should be at least ${rules.min_guest_age} years of age` : null,
      rules.male_only_groups_allowed === 0 ? "Groups with only male guests are not allowed at this property" : null,
    ].filter(Boolean),
    "ID Proof Related": [
      rules.proof_type ? `${rules.proof_type.charAt(0).toUpperCase() + rules.proof_type.slice(1)} is accepted as ID proof` : null,
      rules.local_id_not_allowed === 1 ? "Local ids not allowed" : null,
    ].filter(Boolean),
    "Smoking/Alcohol consumption Rules": [
      rules.alcohol_allowed === 1 ? "There are no restrictions on alcohol consumption." : "Alcohol is not allowed.",
      rules.smoking_allowed === 1 ? "Smoking is allowed" : "Smoking within the premises is not allowed",
    ].filter(Boolean),
    "Food Arrangement": [
      rules.non_veg_allowed === 1 ? "Non veg food is allowed" : "Non veg food is not allowed",
      rules.outside_food_allowed === 1 ? "Outside food is allowed" : "Outside food is not allowed",
      rules.food_delivery_service === 1 ? "Food Delivery is available" : null,
      rules.food_delivery_service === 1 ? "Food Delivery available from Zomato, Swiggy, Local restaurants and UberEats" : null,
      rules.in_room_dining === 1 ? "In room dining available" : null,
    ].filter(Boolean),
    "Property Accessibility": [
      rules.wheelchair_accessible === 1 ? "This property is accessible to guests who use a wheelchair." : "This property is not accessible to guests who use a wheelchair.",
      rules.wheelchair_provided === 1 ? "Wheelchair provided" : "Guests are requested to carry their own wheelchair.",
    ].filter(Boolean),
    "Pet(s) Related": [
      rules.pets_allowed === 1 ? "Pets are allowed" : "Pets are not allowed",
      rules.pets_on_property === 1 ? "Pets live on property" : null,
    ].filter(Boolean),
  };
}

const mockReviews = {
  overall: 7.4,
  label: "Good",
  count: 143,
  categories: [
    { name: "Staff", score: 8.1 },
    { name: "Facilities", score: 7.7 },
    { name: "Cleanliness", score: 8.0 },
    { name: "Comfort", score: 8.0 },
    { name: "Value for money", score: 7.6 },
    { name: "Location", score: 7.9 },
    { name: "Free WiFi", score: 8.5 },
  ],
};

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [property, setProperty] = useState(location.state?.property || null);
  const [searchParamsState, setSearchParamsState] = useState({
    destination: searchParams.get('destination') || location.state?.searchParams?.destination || '',
    checkIn: searchParams.get('checkIn') || location.state?.searchParams?.checkIn || '',
    checkOut: searchParams.get('checkOut') || location.state?.searchParams?.checkOut || '',
    adults: searchParams.get('adults') || location.state?.searchParams?.adults || '1',
    children: searchParams.get('children') || location.state?.searchParams?.children || '0'
  });
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeRulesTab, setActiveRulesTab] = useState("");
  const modalContentRef = useRef(null);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomSelections, setRoomSelections] = useState({});

  // Calculate guest capacity from search params
  const capacity = Number(searchParams.get('adults') || 1) + Number(searchParams.get('children') || 0);

  // Calculate price based on occupancy adjustments or base price
  let totalPrice = 0;
  const numberOfAdults = parseInt(searchParams.get('adults')) || 0;
  const numberOfChildren = parseInt(searchParams.get('children')) || 0;
  
  // Add more detailed logging for children ages parsing
  console.log('Raw childrenAges from URL:', searchParams.get('childrenAges'));
  let childrenAges = [];
  try {
    const rawChildrenAges = searchParams.get('childrenAges');
    if (rawChildrenAges) {
      childrenAges = JSON.parse(rawChildrenAges);
      console.log('Parsed childrenAges:', childrenAges);
    } else {
      console.log('No childrenAges parameter found in URL');
      // If no ages provided but children count > 0, create default ages
      if (numberOfChildren > 0) {
        childrenAges = Array(numberOfChildren).fill(6); // Default age of 6
        console.log('Created default ages for children:', childrenAges);
      }
    }
  } catch (error) {
    console.error('Error parsing childrenAges:', error);
    if (numberOfChildren > 0) {
      childrenAges = Array(numberOfChildren).fill(6); // Default age of 6
      console.log('Created default ages after error:', childrenAges);
    }
  }

  // Get the first room if rooms is an array
  const room = Array.isArray(property?.rooms) && property.rooms.length > 0 
    ? property.rooms[0] 
    : property.room;

  // Log room data for debugging
  console.log('Property data:', property);
  console.log('Room data:', room);
  console.log('Room structure:', {
    base_price: room?.base_price,
    occupancy_price_adjustments: room?.occupancy_price_adjustments,
    child_pricing: room?.child_pricing,
    image_urls: room?.image_urls
  });

  // Get images from the room data
  const images = room?.image_urls || [];
  console.log('Raw image URLs:', room?.image_urls);
  console.log('Processed images array:', images);
  console.log('First image URL:', images[0] ? getImageUrl(images[0]) : 'No image available');

  // Price calculation
  const calculatePrice = useCallback(() => {
    let price = Number(room?.base_price || 0);
    console.log('Initial base price:', price);

    // Apply occupancy-based pricing adjustments
    if (room?.occupancy_price_adjustments) {
      try {
        let occupancyPricing = JSON.parse(room.occupancy_price_adjustments);
        if (typeof occupancyPricing === 'string') {
          occupancyPricing = JSON.parse(occupancyPricing);
        }

        const sortedPricing = occupancyPricing.sort((a, b) => b.minGuests - a.minGuests);
        const applicablePricing = sortedPricing.find(p => numberOfAdults >= p.minGuests);

        if (applicablePricing) {
          price = Number(applicablePricing.adjustment);
        }
      } catch (error) {
        console.error('Error calculating occupancy pricing:', error);
      }
    }

    // Add child pricing
    if (numberOfChildren > 0 && room?.child_pricing) {
      try {
        let childPricing = JSON.parse(room.child_pricing);
        if (typeof childPricing === 'string') {
          childPricing = JSON.parse(childPricing);
        }

        childrenAges.forEach(age => {
          const applicablePricing = childPricing.find(p => 
            age >= p.ageFrom && age <= p.ageTo
          );

          if (applicablePricing) {
            if (applicablePricing.type === 'percentage') {
              price += (Number(room.base_price) * Number(applicablePricing.price)) / 100;
            } else {
              price += Number(applicablePricing.price);
            }
          }
        });
      } catch (error) {
        console.error('Error calculating child pricing:', error);
      }
    }

    return price;
  }, [room, numberOfAdults, numberOfChildren, childrenAges]);

  // Calculate final prices
  const basePrice = calculatePrice();
  const gstRate = basePrice <= 7500 ? 0.12 : 0.18;
  const gstAmount = Math.round(basePrice * gstRate);
  const finalPrice = Math.round(basePrice + gstAmount);

  // Add scroll handler for rules modal
  const handleRulesModalScroll = useCallback(() => {
    if (!modalContentRef.current) return;

    const sections = modalContentRef.current.querySelectorAll('[data-section]');
    const scrollTop = modalContentRef.current.scrollTop;
    const offset = 100; // Offset to trigger tab change before section is fully in view

    for (const section of sections) {
      const sectionTop = section.offsetTop - offset;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        setActiveRulesTab(section.dataset.section);
        break;
      }
    }
  }, []);

  // Add scroll event listener when modal is shown
  useEffect(() => {
    if (showRulesModal && modalContentRef.current) {
      modalContentRef.current.addEventListener('scroll', handleRulesModalScroll);
      return () => {
        modalContentRef.current?.removeEventListener('scroll', handleRulesModalScroll);
      };
    }
  }, [showRulesModal, handleRulesModalScroll]);

  useEffect(() => {
    if (property) return;

    setLoading(true);
    fetch(`${API_URL}/api/getall/property/${propertyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          console.log('Raw API response:', data);
          const propertyData = data.data;
          
          // Log the full property data structure
          console.log('Full property data:', propertyData);
          console.log('Property rooms:', propertyData.rooms);
          console.log('Property room:', propertyData.room);
          
          setProperty(propertyData);
        } else {
          setError('Property not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching property:', err);
        setError('Failed to load property details');
        setLoading(false);
      });
  }, [propertyId, property]);

  useEffect(() => {
    if (property) {
      const keys = Object.keys(getRulesSections(property.rules));
      setActiveRulesTab(keys[0] || "");
    }
  }, [property]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!property) return <div className="text-center p-4">No property found</div>;

  const rulesSections = getRulesSections(property.rules);
  const sectionKeys = Object.keys(rulesSections);

  // Image gallery component
  const renderImage = (img, idx, isMainImage = false) => {
    const imageUrl = getImageUrl(img);
    console.log(`Rendering image ${idx}:`, { original: img, processed: imageUrl, isMainImage });
    
    if (isMainImage) {
      return (
        <motion.img
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt={`${property.property_name} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Main image failed to load:', e.target.src);
            e.target.src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
      );
    }

    return (
      <motion.img
        key={idx}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        src={imageUrl}
        alt={`${property.property_name} thumbnail ${idx + 1}`}
        className={`w-24 h-20 object-cover rounded cursor-pointer transition-all duration-300 ${
          selectedImage === idx ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
        }`}
        onClick={() => {
          console.log('Selected thumbnail:', idx, imageUrl);
          setSelectedImage(idx);
        }}
        onError={(e) => {
          console.error('Thumbnail failed to load:', e.target.src);
          e.target.src = 'https://placehold.co/200x150?text=No+Image';
        }}
      />
    );
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-4"
      >
        {/* Header Section with Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </motion.button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 font-sans">{property.property_name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded"
            >
              <FaStar className="mr-1" />
              <span>4.5</span>
            </motion.div>
            <span className="text-gray-600">|</span>
            <span className="text-gray-600">{property.location?.city}</span>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-2 group">
            {images[selectedImage] ? (
              <>
                {renderImage(images[selectedImage], selectedImage, true)}
                {/* Left Arrow Button */}
                <button
                  onClick={() => {
                    setSelectedImage((prev) => {
                      const newIndex = prev === 0 ? images.length - 1 : prev - 1;
                      console.log('Previous image:', newIndex);
                      return newIndex;
                    });
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Right Arrow Button */}
                <button
                  onClick={() => {
                    setSelectedImage((prev) => {
                      const newIndex = prev === images.length - 1 ? 0 : prev + 1;
                      console.log('Next image:', newIndex);
                      return newIndex;
                    });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-10"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/10" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => renderImage(img, idx))}
          </div>
        </motion.div>

        {/* Room Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-2/3 bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-lg font-bold mb-4">Room Details</h3>
          {room ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-semibold">Room Type:</span> {room.room_type}</p>
                <p className="text-gray-600"><span className="font-semibold">Floor:</span> {room.floor}</p>
                <p className="text-gray-600"><span className="font-semibold">Capacity:</span> {room.total_capacity} persons</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-semibold">Base Price:</span> ₹{room.base_price}</p>
                <p className="text-gray-600"><span className="font-semibold">Number of Rooms:</span> {room.number_of_rooms}</p>
                {room.free_cancellation_enabled && (
                  <p className="text-green-600">Free Cancellation Available</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No room details available</p>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2"
          >
            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {property.facilities?.swimming_pool === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaSwimmingPool className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Swimming Pool</span>
                  </motion.div>
                )}
                {property.facilities?.restaurant === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaUtensils className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Restaurant</span>
                  </motion.div>
                )}
                {property.facilities?.room_service_24hr === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaConciergeBell className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">24/7 Room Service</span>
                  </motion.div>
                )}
                {property.facilities?.free_parking === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaParking className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Free Parking</span>
                  </motion.div>
                )}
                {property.facilities?.free_wifi === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaWifi className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Free WiFi</span>
                  </motion.div>
                )}
                {property.facilities?.air_conditioning === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaSnowflake className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Air Conditioning</span>
                  </motion.div>
                )}
                {property.facilities?.housekeeping === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <GiVacuumCleaner className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Housekeeping</span>
                  </motion.div>
                )}
                {property.facilities?.elevator === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaArrowUp className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Elevator</span>
                  </motion.div>
                )}
                {property.facilities?.tv === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <MdTv className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">TV</span>
                  </motion.div>
                )}
                {property.facilities?.cctv === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaVideo className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">CCTV Security</span>
                  </motion.div>
                )}
                {property.facilities?.first_aid === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaFirstAid className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">First Aid</span>
                  </motion.div>
                )}
                {property.facilities?.wake_up_call === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaBell className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Wake-up Call</span>
                  </motion.div>
                )}
                {property.facilities?.luggage_storage === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaSuitcaseRolling className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Luggage Storage</span>
                  </motion.div>
                )}
                {property.facilities?.massage === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <FaHandHoldingHeart className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Massage</span>
                  </motion.div>
                )}
                {property.facilities?.conference_room === 1 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors duration-300"
                  >
                    <MdMeetingRoom className="text-2xl text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm text-center">Conference Room</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Select your room</h2>
              
              {/* Room Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Room type</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Sleeps</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Today's price</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Your choices</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Select rooms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(property.rooms) && property.rooms.map((roomOption, index) => {
                      // Calculate room price with occupancy adjustments
                      const roomPrice = calculatePrice(roomOption);
                      const roomGstRate = roomPrice <= 7500 ? 0.12 : 0.18;
                      const roomGstAmount = Math.round(roomPrice * roomGstRate);
                      const roomFinalPrice = Math.round(roomPrice + roomGstAmount);
                      const currentSelection = roomSelections[roomOption.id] || 0;

                      return (
                        <tr key={index} className={`hover:bg-blue-50 transition-colors ${
                          selectedRoom?.id === roomOption.id ? 'bg-blue-50' : ''
                        }`}>
                          {/* Room Type Column */}
                          <td className="py-6 px-6">
                            <div className="flex flex-col gap-2">
                              <h3 className="font-semibold text-lg text-gray-900">{roomOption.room_type}</h3>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaBed className="text-gray-400" />
                                  <span>{roomOption.bed_type || 'Double Bed'}</span>
                </div>
                                <div className="flex items-center gap-2">
                                  <FaRuler className="text-gray-400" />
                                  <span>{roomOption.room_size || '26'} m²</span>
                </div>
                                {/* Room Features */}
                                <div className="space-y-1 mt-2">
                                  {roomOption.features?.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-green-600">
                                      <FaCheck className="text-sm" />
                                      <span>{feature}</span>
              </div>
                                  )) || (
                                    <>
                                      <div className="flex items-center gap-2 text-green-600">
                                        <FaCheck className="text-sm" />
                                        <span>Air conditioning</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-green-600">
                                        <FaCheck className="text-sm" />
                                        <span>Private bathroom</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Sleeps Column */}
                          <td className="py-6 px-6">
                            <div className="flex items-center gap-1">
                              {[...Array(roomOption.room_capacity_adults)].map((_, i) => (
                                <FaUser key={i} className="text-gray-400" />
                              ))}
                              {roomOption.room_capacity_children > 0 && [...Array(roomOption.room_capacity_children)].map((_, i) => (
                                <FaChild key={i} className="text-gray-400" />
                              ))}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {roomOption.room_capacity_adults} adults
                              {roomOption.room_capacity_children > 0 && ` + ${roomOption.room_capacity_children} children`}
                            </div>
                          </td>

                          {/* Price Column */}
                          <td className="py-6 px-6">
                            <div className="flex flex-col">
                              <div className="text-2xl font-bold text-gray-900">
                                ₹{roomFinalPrice.toLocaleString('en-IN')}
                              </div>
                              <div className="text-sm text-gray-500">includes taxes and fees</div>
                              {roomOption.free_cancellation_enabled && (
                                <div className="text-green-600 text-sm mt-2 flex items-center gap-1">
                                  <FaCheck />
                                  <span>Free cancellation</span>
                                </div>
                              )}
                              {roomOption.breakfast_included && (
                                <div className="text-green-600 text-sm flex items-center gap-1">
                                  <FaUtensils />
                                  <span>Breakfast included</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Benefits Column */}
                          <td className="py-6 px-6">
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2 text-gray-600">
                                <FaWifi className="text-blue-500" />
                                <span>Free WiFi</span>
                </li>
                              {property.facilities?.air_conditioning && (
                                <li className="flex items-center gap-2 text-gray-600">
                                  <FaSnowflake className="text-blue-500" />
                                  <span>Air conditioning</span>
                  </li>
                )}
                              {roomOption.free_cancellation_enabled && (
                                <li className="flex items-center gap-2 text-green-600">
                                  <FaCalendarCheck className="text-green-500" />
                                  <span>Free cancellation</span>
                                </li>
                              )}
                              {roomOption.pay_at_hotel && (
                                <li className="flex items-center gap-2 text-green-600">
                                  <FaMoneyBillWave className="text-green-500" />
                                  <span>Pay at the hotel</span>
                  </li>
                )}
              </ul>
                          </td>

                          {/* Select Room Column */}
                          <td className="py-6 px-6">
                            {roomOption.number_of_rooms > 0 ? (
                              <div className="space-y-3">
                                <select
                                  className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) => {
                                    const count = parseInt(e.target.value);
                                    setRoomSelections(prev => ({
                                      ...prev,
                                      [roomOption.id]: count
                                    }));
                                    if (count > 0) {
                                      setSelectedRoom({...roomOption, selectedCount: count});
                                    } else {
                                      setSelectedRoom(null);
                                    }
                                  }}
                                  value={currentSelection}
                                >
                                  <option value="0">0 rooms</option>
                                  {[...Array(roomOption.number_of_rooms)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                      {i + 1} {i === 0 ? 'room' : 'rooms'}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
                                    currentSelection > 0 
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  }`}
                                  disabled={currentSelection === 0}
                                  onClick={() => {
                                    navigate(`/book/${propertyId}`, {
                                      state: {
                                        room: {...roomOption, selectedCount: currentSelection},
                                        dates: {
                                          checkIn: searchParamsState.checkIn,
                                          checkOut: searchParamsState.checkOut
                                        },
                                        guests: {
                                          adults: searchParamsState.adults,
                                          children: searchParamsState.children
                                        },
                                        price: {
                                          basePrice: roomPrice,
                                          gstAmount: roomGstAmount,
                                          finalPrice: roomFinalPrice
                                        }
                                      }
                                    });
                                  }}
                                >
                                  I'll reserve
                                </button>
                                {roomOption.number_of_rooms <= 3 && (
                                  <div className="text-red-600 text-sm font-medium">
                                    Only {roomOption.number_of_rooms} rooms left!
                </div>
                                )}
                </div>
                            ) : (
                              <div className="text-red-600 text-sm font-medium">
                                Sold out
              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Property Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-2/3 mt-5 bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors duration-300 font-sans">About this property</h2>
          <div className="text-gray-600 mb-4 whitespace-pre-line font-sans">
            {property?.property_details?.description || 'No description available'}
          </div>
        </motion.div>

        {/* Most Popular Facilities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-2/3 bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-lg font-bold mb-4 hover:text-blue-600 transition-colors duration-300 font-sans">Most popular facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-green-700">
            {FACILITY_MAP.filter(fac => property.facilities?.[fac.key] === 1).map(fac => (
              <motion.div
                key={fac.key}
                whileHover={{ scale: 1.05, x: 5 }}
                className="flex items-center gap-2 hover:text-green-800 transition-colors duration-300"
              >
                {fac.icon} {fac.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Property Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-2/3 bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors duration-300 font-sans">Property Rules</h3>
          <div className="flex items-center gap-8 mb-2 text-sm">
            <motion.span whileHover={{ scale: 1.05 }}>
              <span className="font-semibold text-gray-700">Check-in:</span> {property.rules?.check_in_time ? property.rules.check_in_time : "N/A"}
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }}>
              <span className="font-semibold text-gray-700">Check-out:</span> {property.rules?.check_out_time ? property.rules.check_out_time : "N/A"}
            </motion.span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm mb-4">
            {property.rules ? (
              <>
                <ul className="list-disc list-inside space-y-1">
                  {getReadableRules(property.rules).slice(0, 3).map((rule, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      {rule}
                    </motion.li>
                  ))}
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  {getReadableRules(property.rules).slice(3, 6).map((rule, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              </>
            ) : (
              <span>No rules available</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border px-3 py-1 rounded text-sm hover:bg-blue-50 hover:border-blue-500 transition-all duration-300"
            >
              Must Read Rules
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border px-3 py-1 rounded text-sm hover:bg-blue-50 hover:border-blue-500 transition-all duration-300"
            >
              Guest Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border px-3 py-1 rounded text-sm hover:bg-blue-50 hover:border-blue-500 transition-all duration-300"
            >
              ID Proof Related
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="text-blue-600 text-sm font-semibold hover:underline ml-2"
              onClick={e => { e.preventDefault(); setShowRulesModal(true); }}
            >
              Read All Property Rules
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-2/3 mx-auto mb-8 bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 font-sans">Guest reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-700 text-white px-3 py-1 rounded-lg text-xl font-bold">{mockReviews.overall}</span>
                <div>
                  <div className="font-semibold text-gray-800">{mockReviews.label}</div>
                  <div className="text-gray-500 text-sm">{mockReviews.count} verified reviews</div>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-lg ${i < Math.floor(mockReviews.overall) ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">Based on {mockReviews.count} reviews</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Write a Review
          </motion.button>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Recent Reviews</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              onClick={() => setShowAllReviewsModal(true)}
            >
              View All Reviews
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
          <div className=" space-y-6">
            {/* Sample Review Card */}
            
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRulesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] relative flex flex-col"
            >
              {/* Fixed Header */}
              <div className="sticky top-0 bg-white z-20 border-b">
                <div className="p-6 pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-sans">House Rules & Information</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                      onClick={() => setShowRulesModal(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>
                  {/* Tab Navigation */}
                  <div className="flex border-b">
                    {Object.keys(rulesSections).map((section, idx) => (
                      <button
                        key={section}
                        className={`px-4 py-2 font-semibold text-sm focus:outline-none transition-colors relative ${activeRulesTab === section
                            ? "text-blue-600"
                            : "text-gray-700 hover:text-blue-600"
                          }`}
                        onClick={() => {
                          setActiveRulesTab(section);
                          const sectionElement = modalContentRef.current?.querySelector(`[data-section="${section}"]`);
                          if (sectionElement) {
                            sectionElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {section}
                        {activeRulesTab === section && (
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 rounded-t"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6" ref={modalContentRef}>
                <div>
                  {Object.entries(rulesSections).map(([section, rules]) =>
                    rules.length > 0 ? (
                      <div
                        key={section}
                        data-section={section}
                        className={`mb-8 transition-all duration-300 ${activeRulesTab === section
                            ? 'bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400'
                            : ''
                          }`}
                      >
                        <h3 className="font-bold mb-1 text-lg font-sans">{section}</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {rules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showAllReviewsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] relative flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-20 border-b p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-1">Guest reviews for {property.property_name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-700 text-white px-2 py-1 rounded text-lg font-bold">{mockReviews.overall}</span>
                    <span className="font-semibold text-gray-700">{mockReviews.label}</span>
                    <span className="text-gray-500">{mockReviews.count} real reviews</span>
                  </div>
                  <span className="text-green-700 text-xs font-medium">We aim for 100% real reviews <span className="ml-1">✔️</span></span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Write a review
                  </motion.button>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl mt-2"
                    onClick={() => setShowAllReviewsModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>
              </div>
              {/* Categories */}
              <div className="px-6 pt-4 pb-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {mockReviews.categories.map(cat => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat.name}</span>
                        <span className="font-semibold">{cat.score}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-blue-700 rounded"
                          style={{ width: `${(cat.score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Filters */}
              <div className="px-6 py-2 border-b flex flex-wrap gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-sm">Filters:</span>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>All ({mockReviews.count})</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>All scores</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>All languages</option>
                  </select>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>All times</option>
                  </select>
                </div>
                <div className="flex gap-2 flex-wrap ml-auto">
                  <span className="font-semibold text-sm">Select topics to read reviews:</span>
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">+ Breakfast</button>
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">+ Clean</button>
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">+ Room</button>
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">+ Location</button>
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">+ Dinner</button>
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">Show more</button>
                </div>
              </div>
              {/* Reviews List */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
                {/* Sample Review Card */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">John Doe</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span>United States</span>
                            <span>•</span>
                            <span>2 days ago</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span className="font-semibold">8.5</span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">
                        Excellent stay! The staff was very friendly and the facilities were top-notch. Would definitely recommend this property to others.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Add more review cards as needed */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
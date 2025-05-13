import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';
import {
  FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaSnowflake,
  FaConciergeBell, FaBed, FaArrowUp, FaUmbrellaBeach,
  FaVideo, FaFirstAid, FaBell, FaSuitcaseRolling,
  FaHandHoldingHeart
} from 'react-icons/fa';
import { MdMeetingRoom, MdLocalLaundryService, MdPower, MdSecurity, MdTv, MdRoom } from 'react-icons/md';
import { GiVacuumCleaner } from 'react-icons/gi';
import { BiRestaurant } from 'react-icons/bi';
import Header from './Header';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Start with base price
  totalPrice = Number(property?.room?.base_price || 0);
  console.log('Initial base price:', totalPrice);

  // Apply occupancy-based pricing adjustments
  if (property?.room?.occupancy_price_adjustments) {
    try {
      let occupancyPricing;
      try {
        occupancyPricing = JSON.parse(property.room.occupancy_price_adjustments);
        if (typeof occupancyPricing === 'string') {
          occupancyPricing = JSON.parse(occupancyPricing);
        }
        console.log('Parsed occupancy pricing rules:', occupancyPricing);
      } catch (e) {
        console.error('Error parsing occupancy pricing:', e);
        occupancyPricing = [];
      }

      // Find the applicable pricing based on number of adults
      const applicablePricing = occupancyPricing.find(p => 
        numberOfAdults >= p.minGuests && numberOfAdults <= p.maxGuests
      );
      console.log('Applicable occupancy pricing:', applicablePricing);

      if (applicablePricing) {
        totalPrice = Number(applicablePricing.adjustment);
        console.log('Price after occupancy adjustment:', totalPrice);
      }
    } catch (error) {
      console.error('Error calculating occupancy pricing:', error);
    }
  }

  // Add child pricing if there are children
  if (numberOfChildren > 0 && property?.room?.child_pricing) {
    try {
      let childPrice = 0;
      console.log('Starting child price calculation...');
      console.log('Number of children:', numberOfChildren);
      console.log('Children ages:', childrenAges);
      console.log('Base room price:', property.room.base_price);

      // Calculate price for each child based on their actual age
      childrenAges.forEach((age, index) => {
        let childPricing;
        try {
          // First try to parse the child pricing data
          childPricing = JSON.parse(property.room.child_pricing);
          // If it's still a string, parse it again
          if (typeof childPricing === 'string') {
            childPricing = JSON.parse(childPricing);
          }
          console.log(`Child pricing rules for child ${index + 1}:`, childPricing);
        } catch (e) {
          console.error('Error parsing child pricing:', e);
          childPricing = [];
        }

        const applicablePricing = childPricing.find(p => 
          age >= p.ageFrom && age <= p.ageTo
        );
        console.log(`Applicable pricing rule for child ${index + 1} (age ${age}):`, applicablePricing);

        if (applicablePricing) {
          let currentChildPrice = 0;
          // If the price type is percentage, calculate based on base price
          if (applicablePricing.type === 'percentage') {
            currentChildPrice = (Number(property.room.base_price) * Number(applicablePricing.price)) / 100;
            console.log(`Child ${index + 1} price (${applicablePricing.price}% of ${property.room.base_price}):`, currentChildPrice);
          } else {
            currentChildPrice = Number(applicablePricing.price);
            console.log(`Child ${index + 1} fixed price:`, currentChildPrice);
          }
          childPrice += currentChildPrice;
          console.log(`Running total child price after child ${index + 1}:`, childPrice);
        } else {
          console.log(`No applicable pricing rule found for child ${index + 1} (age ${age})`);
        }
      });
      
      totalPrice += childPrice;
      console.log('Final total child price:', childPrice);
      console.log('New total price after adding child price:', totalPrice);
    } catch (error) {
      console.error('Error calculating child pricing:', error);
    }
  }

  // Calculate GST based on price range
  const gstRate = totalPrice <= 7500 ? 0.12 : 0.18;
  const gstAmount = Math.round(totalPrice * gstRate);
  const finalPrice = Math.round(totalPrice + gstAmount);

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
    fetch(`http://localhost:3000/api/getall/property/${propertyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          console.log('Property data:', data.data[0]);
          setProperty(data.data[0]);
        } else {
          setError('Property not found');
        }
        setLoading(false);
      })
      .catch(err => {
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

  console.log('Property data:', property);
  console.log('Room data:', property.room);
  console.log('Image URLs:', property.room?.image_urls);

  const images = property.room?.image_urls || [];
  console.log('Images array:', images);

  const rulesSections = getRulesSections(property.rules);
  const sectionKeys = Object.keys(rulesSections);

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
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[selectedImage] ? `http://localhost:3000${images[selectedImage]}` : 'https://placehold.co/600x400?text=No+Image'}
              alt={`${property.property_name} - Image ${selectedImage + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = 'https://placehold.co/600x400?text=No+Image';
              }}
            />
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
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <motion.img
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={`http://localhost:3000${img}`}
                alt={`${property.property_name} thumbnail ${idx + 1}`}
                className={`w-24 h-20 object-cover rounded cursor-pointer transition-all duration-300 ${selectedImage === idx ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}`}
                onClick={() => {
                  console.log('Selected thumbnail:', idx);
                  setSelectedImage(idx);
                }}
                onError={(e) => {
                  console.error('Thumbnail failed to load:', e.target.src);
                  e.target.src = 'https://placehold.co/200x150?text=No+Image';
                }}
              />
            ))}
          </div>
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
            className="col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-gray-100">
              {/* Room Name & Type */}
              <div className="mb-1">
                <div className="font-bold text-lg text-gray-900">
                  {property.room?.room_type || 'Deluxe room'}
                  {property.room?.bed_type ? ` (${property.room.bed_type})` : ''}
                </div>
                <div className="text-gray-700 text-sm font-medium mb-2">
                  Fits {property.room?.total_capacity || 2} Adults
                </div>
              </div>
              {/* Perks */}
              <ul className="mb-3 space-y-1 text-sm">
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-lg">•</span> Book with ₹ 0 Payment
                </li>
                {property.facilities?.restaurant === 1 && (
                  <li className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 8h14M7 8V6a5 5 0 0110 0v2" /></svg>
                    Free Breakfast
                  </li>
                )}
                {property.room?.free_cancellation_enabled === 1 && (
                  <li className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    Free Cancellation before <span className="ml-1 font-medium">{property.rules?.free_cancellation_before || '12 May 12:59 PM'}</span>
                  </li>
                )}
              </ul>
              {/* Price Section */}
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">Per Night:</div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-extrabold text-gray-900">₹ {Number(totalPrice).toLocaleString('en-IN')}</span>
                  <span className="text-gray-500 font-medium text-sm">+ ₹ {Number(gstAmount).toLocaleString('en-IN')} GST ({gstRate * 100}%)</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Total: ₹ {Number(finalPrice).toLocaleString('en-IN')}
                </div>
                {/* Price Breakdown */}
                {/* <div className="mt-2 text-sm text-gray-600">
                  <div>Base Price: ₹ {Number(property.room?.base_price || 0).toLocaleString('en-IN')}</div>
                  {numberOfChildren > 0 && property.room?.child_pricing && (
                    <div className="mt-1">
                      <div className="font-medium">Child Pricing:</div>
                      {childrenAges.map((age, index) => {
                        let childPrice = 0;
                        try {
                          let childPricing;
                          try {
                            // First try to parse the child pricing data
                            childPricing = JSON.parse(property.room.child_pricing);
                            // If it's still a string, parse it again
                            if (typeof childPricing === 'string') {
                              childPricing = JSON.parse(childPricing);
                            }
                          } catch (e) {
                            console.error('Error parsing child pricing:', e);
                            childPricing = [];
                          }

                          // Find applicable pricing for this child's age
                          const applicablePricing = childPricing.find(p => 
                            age >= p.ageFrom && age <= p.ageTo
                          );

                          if (applicablePricing) {
                            // If the price type is percentage, calculate based on base price
                            if (applicablePricing.type === 'percentage') {
                              childPrice = (Number(property.room.base_price) * Number(applicablePricing.price)) / 100;
                            } else {
                              childPrice = Number(applicablePricing.price);
                            }
                          }
                        } catch (error) {
                          console.error('Error calculating child pricing:', error);
                        }
                        return (
                          <div key={index} className="ml-2 text-gray-500">
                            Child {index + 1} ({age} years): ₹ {childPrice.toLocaleString('en-IN')}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div> */}
              </div>
              {/* Book Button & More Options */}
              <div className="flex flex-col gap-2 mt-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-base shadow transition">BOOK THIS NOW</button>
                <button className="w-full text-blue-600 hover:underline text-sm font-medium bg-transparent">2 More Options</button>
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
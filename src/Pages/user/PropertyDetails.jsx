import { useParams, useLocation } from 'react-router-dom';
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

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const location = useLocation();
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeRulesTab, setActiveRulesTab] = useState("");
  const modalContentRef = useRef(null);

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

  const images = property.room?.image_paths ? JSON.parse(property.room.image_paths) : [];

  const rulesSections = getRulesSections(property.rules);
  const sectionKeys = Object.keys(rulesSections);

  return (
    <>
      <Header/>
      <SearchBar/>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-4"
      >
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">{property.property_name}</h1>
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
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={`http://localhost:3000/${images[selectedImage]}`} 
              alt="Property" 
              className="w-full h-full object-cover transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <motion.img 
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                src={`http://localhost:3000/${img}`} 
                alt={`Property ${idx}`} 
                className={`w-24 h-20 object-cover rounded cursor-pointer transition-all duration-300 ${
                  selectedImage === idx ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
                }`}
                onClick={() => setSelectedImage(idx)}
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
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4">Book Now</h2>
              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input type="date" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input type="date" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Check Availability
                </motion.button>
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
          <h2 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors duration-300">About this property</h2>
          <div className="text-gray-600 mb-4 whitespace-pre-line">
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
          <h3 className="text-lg font-bold mb-4 hover:text-blue-600 transition-colors duration-300">Most popular facilities</h3>
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
          <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors duration-300">Property Rules</h3>
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
              className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] relative flex flex-col"
            >
              {/* Fixed Header */}
              <div className="sticky top-0 bg-white z-20 border-b">
                <div className="p-6 pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">House Rules & Information</h2>
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
                        className={`px-4 py-2 font-semibold text-sm focus:outline-none transition-colors ${
                          activeRulesTab === section
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "border-b-2 border-transparent text-gray-700 hover:text-blue-600"
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
                      <div key={section} data-section={section} className="mb-8">
                        <h3 className="font-bold mb-1 text-lg">{section}</h3>
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
      </AnimatePresence>
    </>
  );
}
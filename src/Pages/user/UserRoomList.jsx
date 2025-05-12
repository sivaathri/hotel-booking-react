import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, Coffee, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './Header';
import PriceMapPage from '../PriceMapPage';
import PropertyList from './PropertyList';
import HomeSearchBar  from './HomeSearchBar';
import carouselImg1 from "../../assets/Images/About Images/carousel-1.jpg";
import carouselImg2 from "../../assets/Images/About Images/carousel-2.jpg";

export default function UserRoomList() {
  const [searchParams] = useSearchParams();
  const [guests, setGuests] = useState('1 adult, 1 room');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    freeCancel: false,
    breakfast: false,
    beachfront: false,
    earlyBird: false,
    priceRange: [0, 15000],
    starRating: [],
    propertyType: [],
    wifi: false,
    pool: false,
    parking: false,
    ac: false,
    spa: false,
    gym: false
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Get search parameters from URL
        const destination = searchParams.get('destination');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const adults = searchParams.get('adults');
        const children = searchParams.get('children');

        // Construct API URL with search parameters
        const apiUrl = new URL('http://localhost:3000/api/getall/all');
        if (destination) apiUrl.searchParams.append('destination', destination);
        if (checkIn) apiUrl.searchParams.append('checkIn', checkIn);
        if (checkOut) apiUrl.searchParams.append('checkOut', checkOut);
        if (adults) apiUrl.searchParams.append('adults', adults);
        if (children) apiUrl.searchParams.append('children', children);

        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.success) {
          setProperties(result.data);
        } else {
          setError('Failed to fetch properties');
        }
      } catch (err) {
        setError('Error fetching properties: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]); // Re-fetch when search parameters change

  
  const priceRanges = [
    { id: 'price1', label: '₹0 - ₹2,000', count: 134 },
    { id: 'price2', label: '₹2,000 - ₹4,500', count: 171 },
    { id: 'price3', label: '₹4,500 - ₹8,000', count: 57 },
    { id: 'price4', label: '₹8,000 - ₹11,500', count: 13 },
    { id: 'price5', label: '₹11,500 - ₹15,000', count: 3 },
    { id: 'price6', label: '₹15,000 - ₹30,000', count: 7 }
  ];

  const filterOptions = [
    { id: 'early-bird', label: 'Early Bird Deals', count: null },
    { id: 'free-cancel', label: 'Free Cancellation', count: 555 },
    { id: 'breakfast', label: 'Breakfast Included', count: 342 },
    { id: 'meal-plan', label: 'Breakfast + Lunch/Dinner Included', count: 10 },
    { id: 'beachfront', label: 'Beachfront', count: 8 },
    { id: 'couples', label: 'Allows Unmarried Couples', count: 344 },
    { id: 'wifi', label: 'Free WiFi', count: 412 },
    { id: 'pool', label: 'Swimming Pool', count: 156 },
    { id: 'parking', label: 'Free Parking', count: 289 },
    { id: 'ac', label: 'Air Conditioning', count: 478 },
    { id: 'spa', label: 'Spa & Wellness', count: 89 },
    { id: 'gym', label: 'Fitness Center', count: 123 }
  ];

  const starRatingOptions = [
    { id: '5-star', label: '5 Star', count: 12 },
    { id: '4-star', label: '4 Star', count: 45 },
    { id: '3-star', label: '3 Star', count: 78 },
    { id: '2-star', label: '2 Star', count: 92 },
    { id: '1-star', label: '1 Star', count: 34 }
  ];

  const propertyTypeOptions = [
    { id: 'hotel', label: 'Hotels', count: 234 },
    { id: 'resort', label: 'Resorts', count: 56 },
    { id: 'guesthouse', label: 'Guest Houses', count: 89 },
    { id: 'apartment', label: 'Apartments', count: 45 },
    { id: 'villa', label: 'Villas', count: 23 }
  ];

  const handleGuestChange = (type, value) => {
    if (type === 'adults') {
      setAdults(Math.max(1, adults + value));
    } else {
      setRooms(Math.max(1, rooms + value));
    }
  };

  const applyGuestSelection = () => {
    setGuests(`${adults} adult${adults > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}`);
    setShowGuestDropdown(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header  */}
      <Header />
      {/* Header End */}
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active relative" style={{ height: "500px" }}>
              <img
                className="w-100 h-100 object-cover"
                src={carouselImg1}
                alt="Luxury Hotel 1"
              />

              {/* Overlay Content */}
              <div className="absolute top-0 left-0 w-full h-full flex items-start">
                <div className="container mt-12 sm:mt-16 md:mt-20">
                  <div className="p-3 pt-8 sm:pt-12" style={{ maxWidth: "900px" }}>
                    <h1
                      className="text-white mb-4 mt-0 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                    >
                      Find The Right Hotel Today
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-item active relative" style={{ height: "500px" }}>
              <img
                className="w-100 h-100 object-cover"
                src={carouselImg2}
                alt="Luxury Hotel 1"
              />

              {/* Overlay Content */}
              <div className="absolute top-0 left-0 w-full h-full flex items-start">
                <div className="container mt-12 sm:mt-16 md:mt-20">
                  <div className="p-3 pt-8 sm:pt-12" style={{ maxWidth: "900px" }}>
                    <h1
                      className="text-white mb-4 mt-0 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                    >
                      Find The Right Hotel Today
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span
              className="mr-20 carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span
              className="ml-20 carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}
      <HomeSearchBar />
      {/* Breadcrumb */}
      <div className="container mx-auto  px-4 py-6">
        <div className="flex items-center text-sm">
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Home</a>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">Hotels and more in Pondicherry</span>
        </div>
        <h2 className="text-2xl font-bold mt-4 text-gray-800">{properties.length} Properties in Pondicherry</h2>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Column - Left */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            {/* Local Search */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for locality / hotel name"
                  className="w-full p-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Popular Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Popular Filters</h3>
              {filterOptions.map((option) => (
                <div key={option.id} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters[option.id]}
                    onChange={() => setFilters({ ...filters, [option.id]: !filters[option.id] })}
                  />
                  <label htmlFor={option.id} className="ml-3 flex-grow text-gray-700">{option.label}</label>
                  {option.count && <span className="text-gray-500 text-sm">({option.count})</span>}
                </div>
              ))}
            </div>

            {/* Star Rating */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Star Rating</h3>
              {starRatingOptions.map((option) => (
                <div key={option.id} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.starRating.includes(option.id)}
                    onChange={() => {
                      const newStarRating = filters.starRating.includes(option.id)
                        ? filters.starRating.filter(id => id !== option.id)
                        : [...filters.starRating, option.id];
                      setFilters({ ...filters, starRating: newStarRating });
                    }}
                  />
                  <label htmlFor={option.id} className="ml-3 flex-grow text-gray-700">{option.label}</label>
                  <span className="text-gray-500 text-sm">({option.count})</span>
                </div>
              ))}
            </div>

            {/* Property Type */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Property Type</h3>
              {propertyTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.propertyType.includes(option.id)}
                    onChange={() => {
                      const newPropertyType = filters.propertyType.includes(option.id)
                        ? filters.propertyType.filter(id => id !== option.id)
                        : [...filters.propertyType, option.id];
                      setFilters({ ...filters, propertyType: newPropertyType });
                    }}
                  />
                  <label htmlFor={option.id} className="ml-3 flex-grow text-gray-700">{option.label}</label>
                  <span className="text-gray-500 text-sm">({option.count})</span>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Price per night</h3>
              {priceRanges.map((range) => (
                <div key={range.id} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={range.id}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={range.id} className="ml-3 flex-grow text-gray-700">{range.label}</label>
                  <span className="text-gray-500 text-sm">({range.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Listings - Middle */}
          <PropertyList properties={properties} loading={loading} error={error} />

          {/* Map Column - Right */}
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg overflow-hidden">
            <PriceMapPage properties={properties}/>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, Coffee, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './Header';
import PriceMapPage from '../PriceMapPage';
import PropertyList from './PropertyList';
import HomeSearchBar from './HomeSearchBar';
import carouselImg1 from "../../assets/Images/About Images/carousel-1.jpg";
import carouselImg2 from "../../assets/Images/About Images/carousel-2.jpg";

export default function UserRoomList() {
  const [searchParams] = useSearchParams();
  const [guests, setGuests] = useState('1 adult, 1 room');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    earlyBird: false,
    freeCancel: false,
    breakfast: false,
    mealPlan: false,
    beachfront: false,
    unmarriedCouples: false,
    wifi: false,
    pool: false,
    parking: false,
    ac: false,
    spa: false,
    gym: false,
    starRating: [],
    propertyType: [],
    priceRange: [0, 30000]
  });
  const [filterCounts, setFilterCounts] = useState({
    freeCancel: 0,
    breakfast: 0,
    mealPlan: 0,
    beachfront: 0,
    couples: 0,
    wifi: 0,
    pool: 0,
    parking: 0,
    ac: 0,
    spa: 0,
    gym: 0
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
          setFilteredProperties(result.data);
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

  // Filter properties based on search criteria
  useEffect(() => {
    const destination = searchParams.get('destination')?.toLowerCase();
    const totalGuests = parseInt(searchParams.get('adults') || '1') + parseInt(searchParams.get('children') || '0');
    const requestedRooms = parseInt(searchParams.get('rooms') || '1');

    const filtered = properties.filter(property => {
      // Filter by destination (city)
      const matchesDestination = !destination ||
        property.location.city.toLowerCase().includes(destination) ||
        property.location.state_province.toLowerCase().includes(destination);

      // Filter by room capacity and number of rooms
      const hasEnoughCapacity = property.rooms?.some(room => room.total_capacity >= totalGuests);

      // Filter by property type if specified
      const matchesPropertyType = filters.propertyType.length === 0 ||
        filters.propertyType.includes(property.property_type.toLowerCase());

      // Filter by star rating
      const matchesStarRating = filters.starRating.length === 0 ||
        filters.starRating.includes(`${property.star_rating}-star`);

      // Filter by facilities
      const matchesFacilities = (
        (!filters.wifi || property.facilities.free_wifi === 1) &&
        (!filters.pool || property.facilities.swimming_pool === 1) &&
        (!filters.parking || property.facilities.free_parking === 1) &&
        (!filters.ac || property.facilities.air_conditioning === 1) &&
        (!filters.spa || property.facilities.spa === 1) &&
        (!filters.gym || property.facilities.gym === 1)
      );

      // Get the first room for price filtering
      const firstRoom = property.rooms?.[0];

      // Filter by price range
      const basePrice = parseFloat(firstRoom?.base_price) || 0;
      const matchesPriceRange = basePrice >= filters.priceRange[0] && basePrice <= filters.priceRange[1];

      // Filter by free cancellation if selected
      const matchesFreeCancellation = !filters.freeCancel || firstRoom?.free_cancellation_enabled === 1;

      // Filter by breakfast if selected
      const matchesBreakfast = !filters.breakfast || property.facilities.restaurant === 1;

      // Filter by meal plan if selected
      const matchesMealPlan = !filters.mealPlan || property.facilities.restaurant === 1;

      // Filter by beachfront if selected
      const matchesBeachfront = !filters.beachfront ||
        parseFloat(property.property_details.nearest_beach_distance) <= 0.5;

      // Filter by unmarried couples if selected
      const matchesUnmarriedCouples = !filters.unmarriedCouples ||
        property.rules.unmarried_couples_allowed === 1;

      return (
        matchesDestination &&
        hasEnoughCapacity &&
        matchesPropertyType &&
        matchesStarRating &&
        matchesFacilities &&
        matchesPriceRange &&
        matchesFreeCancellation &&
        matchesBreakfast &&
        matchesMealPlan &&
        matchesBeachfront &&
        matchesUnmarriedCouples
      );
    });

    setFilteredProperties(filtered);
  }, [properties, filters, searchParams]);

  useEffect(() => {
    // Calculate filter counts whenever properties change
    const calculateFilterCounts = () => {
      const counts = {
        freeCancel: 0,
        breakfast: 0,
        mealPlan: 0,
        beachfront: 0,
        couples: 0,
        wifi: 0,
        pool: 0,
        parking: 0,
        ac: 0,
        spa: 0,
        gym: 0
      };

      properties.forEach(property => {
        // Count free cancellation
        if (property.rooms?.[0]?.free_cancellation_enabled === 1) counts.freeCancel++;

        // Count breakfast and meal plan
        if (property.facilities?.restaurant === 1) {
          counts.breakfast++;
          counts.mealPlan++;
        }

        // Count beachfront
        if (parseFloat(property.property_details?.nearest_beach_distance) <= 0.5) counts.beachfront++;

        // Count unmarried couples
        if (property.rules?.unmarried_couples_allowed === 1) counts.couples++;

        // Count facilities
        if (property.facilities?.free_wifi === 1) counts.wifi++;
        if (property.facilities?.swimming_pool === 1) counts.pool++;
        if (property.facilities?.free_parking === 1) counts.parking++;
        if (property.facilities?.air_conditioning === 1) counts.ac++;
        if (property.facilities?.spa === 1) counts.spa++;
        if (property.facilities?.gym === 1) counts.gym++;
      });

      setFilterCounts(counts);
    };

    calculateFilterCounts();
  }, [properties]);

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
    { id: 'free-cancel', label: 'Free Cancellation', count: filterCounts.freeCancel },
    { id: 'breakfast', label: 'Breakfast Included', count: filterCounts.breakfast },
    { id: 'meal-plan', label: 'Breakfast + Lunch/Dinner Included', count: filterCounts.mealPlan },
    { id: 'beachfront', label: 'Beachfront', count: filterCounts.beachfront },
    { id: 'couples', label: 'Allows Unmarried Couples', count: filterCounts.couples },
    { id: 'wifi', label: 'Free WiFi', count: filterCounts.wifi },
    { id: 'pool', label: 'Swimming Pool', count: filterCounts.pool },
    { id: 'parking', label: 'Free Parking', count: filterCounts.parking },
    { id: 'ac', label: 'Air Conditioning', count: filterCounts.ac },
    { id: 'spa', label: 'Spa & Wellness', count: filterCounts.spa },
    { id: 'gym', label: 'Fitness Center', count: filterCounts.gym }
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

  const handlePriceRangeChange = (rangeId) => {
    const priceRanges = {
      'price1': [0, 2000],
      'price2': [2000, 4500],
      'price3': [4500, 8000],
      'price4': [8000, 11500],
      'price5': [11500, 15000],
      'price6': [15000, 30000]
    };

    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange[0] === priceRanges[rangeId][0] &&
        prev.priceRange[1] === priceRanges[rangeId][1]
        ? [0, 30000] // Reset to default if same range is clicked again
        : priceRanges[rangeId]
    }));
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Header  */}
      <Header />
      {/* Header End */}
      {/* Carousel Start */}
      <div className="container-fluid p-0 ">

      </div>
      {/* Carousel End */}
      <div className='mt-2 relative z-[999]'>
        <HomeSearchBar />
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto">
        <div className="flex items-center text-sm">
          <a href="#" className="text-orange-600  font-medium">Home</a>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">Hotels and more in {searchParams.get('destination') || 'Pondicherry'}</span>
        </div>
        <h2 className="text-2xl font-bold mt-4 text-gray-800">{filteredProperties.length || 0} properties in {searchParams.get('destination') || 'Pondicherry'}</h2>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Column - Left */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            {/* Local Search */}
            {/* <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for locality / hotel name"
                  className="w-full p-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div> */}

            {/* Filter Section Wrapper */}
            <div className="space-y-5">

              {/* Combined Filter Card */}
              <div className="bg-white p-4 rounded-xl  border border-gray-200">
                {/* Popular Filters */}
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Popular Filters</h3>
                {filterOptions.map((option) => (
                  <div key={option.id} className="flex items-center mb-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      id={option.id}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={filters[option.id]}
                      onChange={() => setFilters({ ...filters, [option.id]: !filters[option.id] })}
                    />
                    <label htmlFor={option.id} className="ml-3 flex-grow">{option.label}</label>
                    {option.count !== undefined && (
                      <span className="text-gray-400 text-xs">({option.count})</span>
                    )}
                  </div>
                ))}

                {/* Divider */}
                <hr className="my-4 border-t border-gray-200" />

                {/* Star Rating */}
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Star Rating</h3>
                {starRatingOptions.map((option) => (
                  <div key={option.id} className="flex items-center mb-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      id={option.id}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={filters.starRating.includes(option.id)}
                      onChange={() => {
                        const updated = filters.starRating.includes(option.id)
                          ? filters.starRating.filter(id => id !== option.id)
                          : [...filters.starRating, option.id];
                        setFilters({ ...filters, starRating: updated });
                      }}
                    />
                    <label htmlFor={option.id} className="ml-3 flex-grow">{option.label}</label>
                    <span className="text-gray-400 text-xs">({option.count})</span>
                  </div>
                ))}

                {/* Divider */}
                <hr className="my-4 border-t border-gray-200" />

                {/* Property Type */}
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Property Type</h3>
                {propertyTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center mb-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      id={option.id}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={filters.propertyType.includes(option.id)}
                      onChange={() => {
                        const updated = filters.propertyType.includes(option.id)
                          ? filters.propertyType.filter(id => id !== option.id)
                          : [...filters.propertyType, option.id];
                        setFilters({ ...filters, propertyType: updated });
                      }}
                    />
                    <label htmlFor={option.id} className="ml-3 flex-grow">{option.label}</label>
                    <span className="text-gray-400 text-xs">({option.count})</span>
                  </div>
                ))}

                {/* Divider */}
                <hr className="my-4 border-t border-gray-200" />

                {/* Price per night */}
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Price per night</h3>
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center mb-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      id={range.id}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={() => handlePriceRangeChange(range.id)}
                    />
                    <label htmlFor={range.id} className="ml-3 flex-grow">{range.label}</label>
                    <span className="text-gray-400 text-xs">({range.count})</span>
                  </div>
                ))}
              </div>
            </div>


          </div>

          {/* Property Listings - Middle */}
          <PropertyList properties={filteredProperties} loading={loading} error={error} />

          {/* Map Column - Right */}
          <div className="w-full lg:w-1/3 h-[600px] rounded-2xl">
            <PriceMapPage properties={filteredProperties} />
          </div>

        </div>
      </div>
    </div>
  );
}
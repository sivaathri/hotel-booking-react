import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Star, Coffee, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './Header';
import PriceMapPage from '../PriceMapPage';
import PropertyList from './PropertyList';

export default function UserRoomList() {
  const [destination, setDestination] = useState('Pondicherry');
  const [checkInDate, setCheckInDate] = useState('2025-05-21');
  const [checkOutDate, setCheckOutDate] = useState('2025-05-28');
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
        const response = await fetch('http://localhost:3000/api/getall/all');
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
  }, []);

  const hotels = [
    {
      id: 1,
      name: 'Le Royal Park',
      rating: 4,
      location: 'Kamaraj Salai | 2.6 km drive to Promenade Beach',
      price: 5499,
      taxes: 660,
      amenities: ['Free Cancellation', 'Book with ₹0 Payment', 'Breakfast Included'],
      description: 'Located in central Pondicherry with a spa, gym, and swimming pool',
      reviewScore: 3.9,
      reviewCount: 5618,
      reviewText: 'Very Good'
    },
    {
      id: 2,
      name: 'Radisson Resort Pondicherry Bay',
      rating: 5,
      location: 'Central Pondicherry',
      price: 11585,
      originalPrice: 15750,
      taxes: 3453,
      amenities: ['Free Cancellation', 'Book with ₹0 Payment', 'Breakfast Included'],
      tags: ['Couple Friendly', 'No Cost EMI'],
      extraInfo: 'Complimentary Hi tea once during the stay',
      reviewScore: 4.5,
      reviewCount: 886,
      reviewText: 'Excellent',
      sponsored: true
    },
    {
      id: 3,
      name: 'Ocean Bay Resort',
      rating: 4,
      location: 'Beach Road | 1.2 km from Paradise Beach',
      price: 7299,
      taxes: 870,
      amenities: ['Free Cancellation', 'Book with ₹0 Payment', 'Breakfast Included', 'Swimming Pool'],
      reviewScore: 4.2,
      reviewCount: 2341,
      reviewText: 'Excellent'
    }
  ];

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
      {/* Header */}

      <Header />
      {/* Search Box */}
      <div className="bg-gradient-to-r from-gray-900  mt-1 to-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Destination */}
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-200">Where do you want to stay?</label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter Destination or Hotel Name"
                    className="w-full p-3 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <MapPin className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Check-in */}
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-200">Check-in</label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full p-3 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <Calendar className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Check-out */}
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-200">Check-out</label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full p-3 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <Calendar className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Guests */}
              <div className="relative group">
                <label className="block mb-2 text-sm font-medium text-gray-200">Guests and rooms</label>
                <div
                  className="relative w-full p-3 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all duration-300"
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  <span className="font-medium">{guests}</span>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>

                {/* Guest dropdown */}
                {showGuestDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-medium">Adults</span>
                        <div className="flex items-center space-x-4">
                          <button
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                            onClick={() => handleGuestChange('adults', -1)}
                          >
                            <span className="text-lg">-</span>
                          </button>
                          <span className="text-lg font-medium">{adults}</span>
                          <button
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                            onClick={() => handleGuestChange('adults', 1)}
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-medium">Rooms</span>
                        <div className="flex items-center space-x-4">
                          <button
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                            onClick={() => handleGuestChange('rooms', -1)}
                          >
                            <span className="text-lg">-</span>
                          </button>
                          <span className="text-lg font-medium">{rooms}</span>
                          <button
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                            onClick={() => handleGuestChange('rooms', 1)}
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                      </div>
                      <button
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-300"
                        onClick={applyGuestSelection}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                <Search className="h-5 w-5 mr-2" />
                Search Hotels
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center text-sm">
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Home</a>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-600">Hotels and more in Pondicherry</span>
        </div>
        <h2 className="text-2xl font-bold mt-4 text-gray-800">414 Properties in Pondicherry</h2>
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
            <PriceMapPage />
          </div>
        </div>
      </div>
    </div>
  );
}
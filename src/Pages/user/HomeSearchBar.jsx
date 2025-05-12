import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function HomeSearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0
  });
  const dropdownRef = useRef(null);

  // Update state when URL parameters change
  useEffect(() => {
    const urlDestination = searchParams.get('destination');
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlAdults = searchParams.get('adults');
    const urlChildren = searchParams.get('children');

    if (urlDestination) setDestination(urlDestination);
    if (urlCheckIn) setCheckIn(urlCheckIn);
    if (urlCheckOut) setCheckOut(urlCheckOut);
    if (urlAdults || urlChildren) {
      setGuests({
        adults: parseInt(urlAdults) || 1,
        children: parseInt(urlChildren) || 0
      });
    }
  }, [searchParams]);

  const handleChange = (type, value) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value)
    }));
  };

  const getSummary = () => {
    const totalGuests = guests.adults + guests.children;
    return `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
  };

  const handleSearch = () => {
    // Basic validation
    if (!destination || !checkIn || !checkOut) {
      alert("Please fill in all fields.");
      return;
    }

    // Create query params or search data object
    const searchData = {
      destination,
      checkIn,
      checkOut,
      adults: guests.adults || 1, // Ensure adults is at least 1
      children: guests.children || 0
    };

    console.log("Search Data:", searchData);

    // Navigate to rooms page with query parameters
    navigate(`/rooms?destination=${encodeURIComponent(destination)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${searchData.adults}&children=${searchData.children}`);
  };

  return (
    <div className="w-full flex justify-center items-center absolute top-[37%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 px-4 sm:px-0">
      <div className="container mx-auto bg-[#101828] bg-opacity-95 shadow-3xl p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-full">
        {/* Destination */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="block text-white text-sm font-medium mb-1">Enter Destination</label>
          <input
            type="text"
            placeholder="Location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-white rounded-lg bg-white px-3 sm:px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        {/* Check-in */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="block text-white text-sm font-medium mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-white rounded-lg bg-white px-3 sm:px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 text-sm sm:text-base"
          />
        </div>
        {/* Check-out */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="block text-white text-sm font-medium mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-white rounded-lg px-3 sm:px-4 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        {/* Guests */}
        <div className="flex flex-col w-full md:w-1/4 relative" ref={dropdownRef}>
          <label className="block text-white text-sm font-medium mb-1">Rooms & Guests</label>
          <input
            readOnly
            onClick={() => setIsOpen(!isOpen)}
            value={getSummary()}
            className="w-full border border-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 text-gray-700 focus:outline-none cursor-pointer text-sm sm:text-base"
          />
          {isOpen && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white p-4 rounded-lg shadow-md z-10">
              {['adults', 'children'].map(type => (
                <div key={type} className="flex justify-between items-center mb-2">
                  <span className="capitalize text-gray-700 text-sm sm:text-base">{type}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded text-gray-700 text-sm sm:text-base"
                      onClick={() => handleChange(type, -1)}
                    >
                      -
                    </button>
                    <span className="text-sm sm:text-base">{guests[type]}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded text-gray-700 text-sm sm:text-base"
                      onClick={() => handleChange(type, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Search Button */}
        <div className="flex items-end w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2.5 px-6 sm:px-8 shadow-md transition duration-200 text-sm sm:text-base"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
} 
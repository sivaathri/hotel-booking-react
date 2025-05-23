import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function SearchBar({ initialSearchParams }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState(initialSearchParams?.destination || '');
  const [checkIn, setCheckIn] = useState(initialSearchParams?.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialSearchParams?.checkOut || '');
  const [guests, setGuests] = useState({
    adults: parseInt(initialSearchParams?.adults) || 1,
    children: parseInt(initialSearchParams?.children) || 0
  });
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) {
      alert("Please fill in all fields.");
      return;
    }

    navigate(`/rooms?destination=${encodeURIComponent(destination)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${guests.adults}&children=${guests.children}`);
  };

  const handleGuestChange = (type, value) => {
    if (type === 'adults') {
      setGuests({ ...guests, adults: Math.max(1, guests.adults + value) });
    } else {
      setGuests({ ...guests, children: Math.max(0, guests.children + value) });
    }
  };

  const applyGuestSelection = () => {
    setShowGuestDropdown(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 mt-1 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Destination */}
            <div className="group md:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-200">Where do you want to stay?</label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter Destination or Hotel Name"
                  className="w-full p-2 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <MapPin className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Check-in */}
            <div className="group md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-200">Check-in</label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-2 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <Calendar className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Check-out */}
            <div className="group md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-200">Check-out</label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-2 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <Calendar className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Guests */}
            <div className="relative group md:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-200">Guests and rooms</label>
              <div
                className="relative w-full p-2 text-gray-900 bg-white/90 border-2 border-transparent rounded-xl flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all duration-300"
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              >
                <span className="font-medium">{guests.adults + guests.children} Guests</span>
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
                        <span className="text-lg font-medium">{guests.adults}</span>
                        <button
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                          onClick={() => handleGuestChange('adults', 1)}
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-medium">Children</span>
                      <div className="flex items-center space-x-4">
                        <button
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                          onClick={() => handleGuestChange('children', -1)}
                        >
                          <span className="text-lg">-</span>
                        </button>
                        <span className="text-lg font-medium">{guests.children}</span>
                        <button
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                          onClick={() => handleGuestChange('children', 1)}
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

            {/* Search Button */}
            <div className="flex items-end md:col-span-2">
              <button
                onClick={handleSearch}
                className="w-full h-[46px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
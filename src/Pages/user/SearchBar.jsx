import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function SearchBar() {
  const [destination, setDestination] = useState('Pondicherry');
  const [checkInDate, setCheckInDate] = useState('2025-05-21');
  const [checkOutDate, setCheckOutDate] = useState('2025-05-28');
  const [guests, setGuests] = useState('1 adult, 1 room');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);

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
    <div className="bg-gradient-to-r from-gray-900 mt-1 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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

            {/* Search Button */}
            <div className="flex items-end">
              <button className="w-full mb-2 h-[46px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
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
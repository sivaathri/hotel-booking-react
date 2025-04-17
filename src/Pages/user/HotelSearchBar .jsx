import React, { useState } from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';

const HotelSearchBar = () => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('23/04/2025');
  const [checkOut, setCheckOut] = useState('24/04/2025');
  const [guestInfo, setGuestInfo] = useState('2 adults, 1 room');
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    freeCancellation: true,
    fourStars: true,
    threeStars: false
  });

  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main search bar */}
        <div className="flex flex-col md:flex-row">
          {/* Destination label */}
          <div className="mb-2 md:mb-0">
            <p className="text-sm font-medium mb-2">Where do you want to stay?</p>
          </div>
          
          {/* Search form */}
          <div className="flex flex-col md:flex-row w-full rounded-lg overflow-hidden">
            {/* Destination input */}
            <div className="flex-grow bg-white rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
              <input
                type="text"
                placeholder="Enter destination or hotel name"
                className="w-full h-full px-4 py-3 text-gray-900 focus:outline-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            
            {/* Check-in */}
            <div className="border-t border-gray-200 md:border-t-0 md:border-l">
              <div className="bg-white px-3 py-1">
                <label className="block text-xs text-gray-500 mb-1">Check-in</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="w-full py-1 text-gray-900 focus:outline-none"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Check-out */}
            <div className="border-t border-gray-200 md:border-t-0 md:border-l">
              <div className="bg-white px-3 py-1">
                <label className="block text-xs text-gray-500 mb-1">Check-out</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    className="w-full py-1 text-gray-900 focus:outline-none"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Guests and rooms */}
            <div className="border-t border-gray-200 md:border-t-0 md:border-l relative">
              <div 
                className="bg-white px-3 py-1 cursor-pointer"
                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
              >
                <label className="block text-xs text-gray-500 mb-1">Guests and rooms</label>
                <div className="flex items-center">
                  <span className="text-gray-900">{guestInfo}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
                </div>
              </div>
              
              {/* Dropdown for guests and rooms */}
              {isGuestDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-lg z-10 p-4 rounded text-gray-900">
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Adults</label>
                    <select className="w-full p-2 border rounded">
                      <option>1</option>
                      <option selected>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Rooms</label>
                    <select className="w-full p-2 border rounded">
                      <option selected>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                  <button 
                    className="w-full bg-blue-600 text-white py-2 rounded"
                    onClick={() => setIsGuestDropdownOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Filters and search button */}
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm font-medium mr-4 inline-block">Popular filters:</p>
            <label className="inline-flex items-center mr-4 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={filters.freeCancellation}
                onChange={() => handleFilterChange('freeCancellation')}
              />
              <span className="ml-2 text-sm">Free cancellation</span>
            </label>
            <label className="inline-flex items-center mr-4 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={filters.fourStars}
                onChange={() => handleFilterChange('fourStars')}
              />
              <span className="ml-2 text-sm">4 stars</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={filters.threeStars}
                onChange={() => handleFilterChange('threeStars')}
              />
              <span className="ml-2 text-sm">3 stars</span>
            </label>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors">
            Search hotels
            <Search className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchBar;
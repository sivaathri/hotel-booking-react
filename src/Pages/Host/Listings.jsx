import React from 'react';
import { FiSearch, FiGrid, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HostHeader from './HostHeader';

const Listings = () => {
  const navigate = useNavigate();

  return (
    <>
      <HostHeader />
      <div className="p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Your listings</h1>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-3xl relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings by name or location"
              className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FiGrid className="text-xl" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => navigate('/create-listing')}
            >
              <FiPlus className="text-xl" />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 mb-4 px-4 py-2 font-medium text-gray-500">
          <div>Listing</div>
          <div>Location</div>
          <div>Status</div>
        </div>

        {/* Listing Items */}
        <div className="space-y-4">
          {/* Sample Listing */}
          <div className="grid grid-cols-3 gap-4 items-center p-4 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/path-to-image.jpg"
                  alt="AAHA Serenity Stays"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">AAHA Serenity Stays</h3>
              </div>
            </div>
            <div className="text-gray-600">Puducherry, Puducherry</div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Unlisted
              </span>
            </div>
          </div>

          {/* Sample In Progress Listing */}
          
        </div>
      </div>
    </>
  );
};

export default Listings; 
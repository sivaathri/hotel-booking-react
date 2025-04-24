import React, { useEffect, useState } from 'react';
import { FiSearch, FiGrid, FiPlus, FiMapPin, FiStar, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HostHeader from './HostHeader';
import { API_URL } from '../../config/api.config';
import { getAuthToken } from '../../utils/getAuthToken';
import axios from 'axios';

const Listings = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const [propertydetails, setpropertydetails] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getPropertyDetails = async () => {
    if (!token) {
      alert('Please log in to continue');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/basicInfo/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        setpropertydetails(response.data.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  useEffect(() => {
    getPropertyDetails();
  }, []);

  return (
    <>
      <HostHeader />
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Listings</h1>
          <button
            onClick={() => navigate('/create-listing')}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition duration-200"
          >
            <FiPlus className="text-xl" />
            <span>Add New Listing</span>
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex-1 max-w-xl relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings by name or location"
              className="w-full pl-12 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg border transition ${
                viewMode === 'grid'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiGrid className="text-xl" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg border transition ${
                viewMode === 'list'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Listings Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {propertydetails.length > 0 ? (
              propertydetails.map((property, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="relative pb-[60%]">
                    <img
                      src={property.images?.[0] || 'https://placehold.co/600x400'}
                      alt={property.property_name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/host/edit-listing/${property.id}`);
                        }}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition"
                      >
                        <FiEdit2 className="text-gray-600" />
                      </button>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === 'Listed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {property.status || 'Unlisted'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {property.property_name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <FiMapPin className="text-sm" />
                      <span className="text-sm truncate">
                        {property.location || `${property.city || ''}, ${property.state || ''}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{property.property_type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No listings found.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {propertydetails.length > 0 ? (
              propertydetails.map((property, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={property.images?.[0] || 'https://placehold.co/600x400'}
                      alt={property.property_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {property.property_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/host/edit-listing/${property.id}`)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                          <FiEdit2 className="text-gray-600" />
                        </button>
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-400" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <FiMapPin className="text-sm" />
                      <span>
                        {property.location || `${property.city || ''}, ${property.state || ''}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{property.property_type}</p>
                    <div className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === 'Listed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {property.status || 'Unlisted'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No listings found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Listings;

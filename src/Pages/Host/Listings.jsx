import React, { useEffect, useState } from 'react';
import { FiSearch, FiGrid, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HostHeader from './HostHeader';
import { API_URL } from '../../config/api.config';
import { getAuthToken } from '../../utils/getAuthToken';
import axios from 'axios';

const Listings = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const [propertydetails, setpropertydetails] = useState([]);

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
        </div>

        {/* Search and Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex-1 max-w-xl relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings by name or location"
              className="w-full pl-12 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              <FiGrid className="text-xl text-gray-600" />
            </button>
            <button
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate('/create-listing')}
            >
              <FiPlus className="text-xl" />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 mb-4 px-6 py-3 bg-white rounded-lg shadow text-gray-600 font-semibold">
          <div>#</div>
          <div>Listing</div>
          <div>Location</div>
          <div>Status</div>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {propertydetails.length > 0 ? (
            propertydetails.map((property, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center p-4 bg-white rounded-xl shadow hover:shadow-md transition duration-200"
              >
                <div className="text-gray-500 font-semibold">{index + 1}</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{property.property_name}</h3>
                  <p className="text-sm text-gray-500">{property.property_type}</p>
                </div>
                <div className="text-gray-600">
                  {property.location || `${property.city || ''}, ${property.state || ''}`}
                </div>
                <div>
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
            ))
          ) : (
            <p className="text-center text-gray-500 mt-12">No listings found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Listings;

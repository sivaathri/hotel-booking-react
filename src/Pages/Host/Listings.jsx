import React, { useEffect, useState } from 'react';
import { FiSearch, FiGrid, FiPlus, FiMapPin, FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HostHeader from './HostHeader';
import { API_URL } from '../../config/api.config';
import { getAuthToken } from '../../utils/getAuthToken';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const Listings = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const token = getAuthToken();
  const [propertydetails, setpropertydetails] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!user?.id) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/api/getall/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Handle the nested data structure
        if (response.data.success && response.data.data) {
          // Convert the single property object to an array if it's not already
          const propertyData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
            
          // Parse the image_paths string to array if it exists
          const propertiesWithParsedImages = propertyData.map(property => ({
            ...property,
            images: property.image_paths ? JSON.parse(property.image_paths) : []
          }));
          
          setpropertydetails(propertiesWithParsedImages);
          console.log('Property Details:', propertiesWithParsedImages);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [token, user?.id]);

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/basicInfo/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the listings after deletion
      getPropertyDetails();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

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
            <span>Add New Property</span>
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
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="relative pb-[60%] overflow-hidden">
                    <img
                      src={property.images?.[0] || 'https://placehold.co/600x400'}
                      alt={property.property_name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/host/edit-listing/${property.property_id}`, {
                            state: {
                              propertyData: {
                                ...property,
                                // Parse any JSON strings to objects
                                occupancy_price_adjustments: property.occupancy_price_adjustments 
                                  ? JSON.parse(property.occupancy_price_adjustments) 
                                  : [],
                                images: property.image_paths 
                                  ? JSON.parse(property.image_paths) 
                                  : [],
                                // Convert numeric strings to numbers
                                base_price: parseFloat(property.base_price),
                                min_guest_age: parseInt(property.min_guest_age),
                                total_capacity: parseInt(property.total_capacity),
                                number_of_rooms: parseInt(property.number_of_rooms),
                                // Convert boolean strings to actual booleans
                                instant_booking: Boolean(property.instant_booking),
                                manual_approval: Boolean(property.manual_approval),
                                instant_payment_enabled: Boolean(property.instant_payment_enabled),
                                free_cancellation_enabled: Boolean(property.free_cancellation_enabled),
                                // Convert refund policy
                                refund_policy: {
                                  policy1: {
                                    refundable: Boolean(property.refundable1),
                                    days_before: parseInt(property.days_before1),
                                    refund_percent: property.refund_percent1 ? parseInt(property.refund_percent1) : null
                                  },
                                  policy2: {
                                    refundable: Boolean(property.refundable2),
                                    days_before: parseInt(property.days_before2),
                                    refund_percent: property.refund_percent2 ? parseInt(property.refund_percent2) : null
                                  },
                                  policy3: {
                                    refundable: Boolean(property.refundable3),
                                    days_before: parseInt(property.days_before3),
                                    refund_percent: property.refund_percent3 ? parseInt(property.refund_percent3) : null
                                  }
                                }
                              }
                            }
                          });
                        }}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition"
                      >
                        <FiEdit2 className="text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProperty(property.id);
                        }}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition hover:text-red-500"
                      >
                        <FiTrash2 className="text-gray-600" />
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
                        {property.location ? 
                          `${property.location.address_line1}, ${property.location.city}, ${property.location.state_province}` :
                          `${property.city || ''}, ${property.state || ''}`
                        }
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
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/host/edit-listing/${property.property_id}`, {
                              state: {
                                propertyData: {
                                  ...property,
                                  // Parse any JSON strings to objects
                                  occupancy_price_adjustments: property.occupancy_price_adjustments 
                                    ? JSON.parse(property.occupancy_price_adjustments) 
                                    : [],
                                  images: property.image_paths 
                                    ? JSON.parse(property.image_paths) 
                                    : [],
                                  // Convert numeric strings to numbers
                                  base_price: parseFloat(property.base_price),
                                  min_guest_age: parseInt(property.min_guest_age),
                                  total_capacity: parseInt(property.total_capacity),
                                  number_of_rooms: parseInt(property.number_of_rooms),
                                  // Convert boolean strings to actual booleans
                                  instant_booking: Boolean(property.instant_booking),
                                  manual_approval: Boolean(property.manual_approval),
                                  instant_payment_enabled: Boolean(property.instant_payment_enabled),
                                  free_cancellation_enabled: Boolean(property.free_cancellation_enabled),
                                  // Convert refund policy
                                  refund_policy: {
                                    policy1: {
                                      refundable: Boolean(property.refundable1),
                                      days_before: parseInt(property.days_before1),
                                      refund_percent: property.refund_percent1 ? parseInt(property.refund_percent1) : null
                                    },
                                    policy2: {
                                      refundable: Boolean(property.refundable2),
                                      days_before: parseInt(property.days_before2),
                                      refund_percent: property.refund_percent2 ? parseInt(property.refund_percent2) : null
                                    },
                                    policy3: {
                                      refundable: Boolean(property.refundable3),
                                      days_before: parseInt(property.days_before3),
                                      refund_percent: property.refund_percent3 ? parseInt(property.refund_percent3) : null
                                    }
                                  }
                                }
                              }
                            });
                          }}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                          <FiEdit2 className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition hover:text-red-500"
                        >
                          <FiTrash2 className="text-gray-600" />
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
                        {property.location ? 
                          `${property.location.address_line1}, ${property.location.city}, ${property.location.state_province}` :
                          `${property.city || ''}, ${property.state || ''}`
                        }
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

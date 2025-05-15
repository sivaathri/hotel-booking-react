import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add API URL constant
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PropertyList({ properties, loading, error }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Get number of adults from search params
  const numberOfAdults = parseInt(searchParams.get('adults')) || 0;

  // Debug log to check properties data
  console.log('Properties data:', properties);

  // Helper function to construct image URL
  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/400x320?text=No+Image';
    return `${API_URL}/assets/${path}`;
  };

  // Helper function to calculate price based on occupancy
  const calculatePrice = (property, room) => {
    const basePrice = Number(room?.base_price) || 0;
    const numberOfAdults = parseInt(searchParams.get('adults')) || 0;
    const numberOfChildren = parseInt(searchParams.get('children')) || 0;
    const childrenAges = JSON.parse(searchParams.get('childrenAges') || '[]');
    const totalGuests = numberOfAdults + numberOfChildren;

    // Start with base price
    let totalPrice = basePrice;

    // Apply occupancy-based pricing adjustments
    if (room?.occupancy_price_adjustments) {
      try {
        let occupancyPricing;
        try {
          // Handle double-stringified JSON
          occupancyPricing = JSON.parse(room.occupancy_price_adjustments);
          if (typeof occupancyPricing === 'string') {
            occupancyPricing = JSON.parse(occupancyPricing);
          }
        } catch (e) {
          console.error('Error parsing occupancy pricing:', e);
          occupancyPricing = [];
        }

        // Find the applicable pricing based on number of adults
        // Sort by minGuests in descending order to get the highest applicable tier
        const sortedPricing = occupancyPricing.sort((a, b) => b.minGuests - a.minGuests);
        const applicablePricing = sortedPricing.find(p => numberOfAdults >= p.minGuests);

        if (applicablePricing) {
          totalPrice = Number(applicablePricing.adjustment);
          console.log('Applied price adjustment:', totalPrice, 'for', numberOfAdults, 'adults');
        }
      } catch (error) {
        console.error('Error calculating occupancy pricing:', error);
      }
    }

    // Add child pricing if there are children
    if (numberOfChildren > 0 && room?.child_pricing) {
      try {
        // Parse the child pricing data
        let childPricing;
        try {
          childPricing = JSON.parse(room.child_pricing);
          if (typeof childPricing === 'string') {
            childPricing = JSON.parse(childPricing);
          }
        } catch (e) {
          console.error('Error parsing child pricing:', e);
          childPricing = [];
        }

        let childPrice = 0;

        // Calculate price for each child based on their actual age
        childrenAges.forEach(age => {
          const applicablePricing = childPricing.find(p => 
            age >= p.ageFrom && age <= p.ageTo
          );
          if (applicablePricing) {
            childPrice += Number(applicablePricing.price);
          }
        });

        // Add child price to total
        totalPrice += childPrice;
        console.log('Child price:', childPrice);
      } catch (error) {
        console.error('Error calculating child pricing:', error);
      }
    }

    return totalPrice;
  };

  // Helper function to calculate GST
  const calculateGST = (price) => {
    const numericPrice = Number(price) || 0;
    const gstRate = numericPrice <= 7500 ? 0.12 : 0.18;
    const gstAmount = numericPrice * gstRate;
    return {
      rate: gstRate * 100,
      amount: Math.round(gstAmount),
      total: Math.round(numericPrice + gstAmount)
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl text-red-600">
        {error}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center w-[800px] h-[400px] p-10 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="w-52 h-36 mb-4">
          <svg className="w-full h-full text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md text-sm">
          We couldn't find any properties matching your search criteria. Try adjusting your filters or search parameters.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Modify Search
          </button>
          <button 
            onClick={() => navigate('/rooms')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            View All Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-40px lg:w-4/5">
      {properties.map((property) => {
        // Get the first room's details for display
        const firstRoom = property.rooms?.[0] || {};
        const price = calculatePrice(property, firstRoom);
        const gst = calculateGST(price);

        return (
          <div
            key={property.property_id}
            className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row gap-6 cursor-pointer"
            onClick={() => {
              const searchParamsObj = {
                destination: searchParams.get('destination') || '',
                checkIn: searchParams.get('checkIn') || '',
                checkOut: searchParams.get('checkOut') || '',
                adults: searchParams.get('adults') || '1',
                children: searchParams.get('children') || '0'
              };

              // Create URL with search parameters
              const searchParamsString = new URLSearchParams(searchParamsObj).toString();
              window.open(`/property/${property.property_id}?${searchParamsString}`, '_blank');
            }}
          >
            {/* Image Gallery */}
            <div className="relative w-full md:w-1/3">
              <img
                src={firstRoom.image_urls?.[0] ? getImageUrl(firstRoom.image_urls[0]) : 'https://placehold.co/400x320?text=No+Image'}
                alt={property.property_name}
                className="w-full h-40 object-cover rounded-xl"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = 'https://placehold.co/400x320?text=No+Image';
                }}
              />
              <div className="absolute mt-2 border-white rounded-lg left-2 flex gap-1">
                {firstRoom.image_urls?.slice(1, 4).map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    className="w-12 h-8 object-cover rounded"
                    onError={(e) => {
                      console.error('Thumbnail failed to load:', e.target.src);
                      e.target.src = 'https://placehold.co/400x320?text=No+Image';
                    }}
                  />
                ))}
                <div
                  className="w-12 h-8 bg-black/60 text-white flex items-center justify-center rounded text-xs font-bold cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImages(firstRoom.image_urls || []);
                    setCurrentImageIdx(0);
                    setModalOpen(true);
                  }}
                >
                  View All
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-800">{property.property_name}</h3>
                  <span className="text-orange-500 mb-2 text-lg">★★★★★</span>
                </div>
                <p className="text-orange-500 text-sm mb-2">
                  <span className="font-bold">{property.location.city}</span>
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  {(() => {
                    const distances = [
                      {
                        type: 'beach',
                        distance: Number(property.property_details.nearest_beach_distance),
                        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16.5L7 21l-2.5-1.5L2 21l-1-4.5M16 4c0-1.1.9-2 2-2s2 .9 2 2M3 11c3 0 6 1.8 6 1.8s3-1.8 6-1.8 6 1.8 6 1.8M3 15c3 0 6 1.8 6 1.8s3-1.8 6-1.8 6 1.8 6 1.8" />,
                        text: 'Beach'
                      },
                      {
                        type: 'airport',
                        distance: Number(property.property_details.nearest_airport_distance),
                        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
                        text: 'Airport'
                      },
                      {
                        type: 'railway',
                        distance: Number(property.property_details.nearest_railway_station_distance),
                        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                        text: 'Railway'
                      },
                      {
                        type: 'bus',
                        distance: Number(property.property_details.nearest_bus_stand_distance),
                        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
                        text: 'Bus Stand'
                      }
                    ];

                    // Filter out invalid distances and find the nearest
                    const validDistances = distances.filter(d => !isNaN(d.distance) && d.distance > 0);
                    if (validDistances.length === 0) return null;

                    const nearest = validDistances.reduce((prev, curr) => 
                      prev.distance < curr.distance ? prev : curr
                    );

                    return (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {nearest.icon}
                        </svg>
                        {nearest.distance.toString()} km to {nearest.text}
                      </span>
                    );
                  })()}
                </div>

                <div className="mt-3 grid gap-2">
                  {[
                    firstRoom.free_cancellation_enabled && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Free Cancellation" },
                    property.facilities.free_wifi && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Free WiFi" },
                    property.facilities.air_conditioning && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Air Conditioning" },
                    property.facilities.free_parking && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Free Parking" },
                    property.facilities.gym && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Gym" },
                    property.facilities.restaurant && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Restaurant" },
                    property.facilities.bar && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Bar" },
                    property.facilities.spa && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Spa" },
                    property.facilities.laundry && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Laundry" },
                    property.facilities.room_service && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Room Service" },
                    property.facilities.business_centre && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Business Centre" },
                    property.facilities.conference_hall && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Conference Hall" },
                    property.facilities.kids_play_area && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Kids Play Area" },
                    property.facilities.coffee_shop && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Coffee Shop" },
                    property.facilities.cafe && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Cafe" },
                    property.facilities.lounge && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Lounge" }
                  ]
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((facility, index) => (
                      <div key={index} className="flex items-center text-green-600 text-sm">
                        {facility.icon} {facility.text}
                      </div>
                    ))}
                </div>
              </div>
              <p
                className='text-gray-500 mt-3 mb-0 text-sm cursor-pointer hover:text-blue-500 flex items-center gap-1'
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLocation({
                    lat: property.location.latitude,
                    lng: property.location.longitude,
                    name: property.property_name,
                    address: `${property.location.address_line1}${property.location.address_line2 ? ', ' + property.location.address_line2 : ''}, ${property.location.city}, ${property.location.state_province}, ${property.location.country}`
                  });
                  setMapModalOpen(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Map
              </p>
            </div>

            {/* Price Section */}
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="w-px bg-gray-200 mx-10 hidden md:block" />
              <div className="flex flex-col min-w-[160px]">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-yellow-400 text-lg"></span>
                    <span className="text-sm font-medium bg-orange-500 px-2 py-1 rounded-full text-white">4.8</span>
                  </div>
                  <span className="text-sm text-gray-400">(2,345 ratings)</span>
                  <p className="text-2xl mt-5 mb-0 font-extrabold text-gray-900">
                    ₹ {price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm mb-0 text-gray-500">
                    + ₹ {gst.amount.toLocaleString('en-IN')} <span className="lowercase">taxes & fees</span>
                  </p>
                  <p className="text-sm text-gray-400">Per Night</p>
                  {numberOfAdults > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Price for {numberOfAdults} {numberOfAdults === 1 ? 'adult' : 'adults'}
                      {parseInt(searchParams.get('children')) > 0 && (
                        <> and {searchParams.get('children')} {parseInt(searchParams.get('children')) === 1 ? 'child' : 'children'}</>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-screen-xl w-[90%] p-0 flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center text-2xl z-10"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>

            <div className="relative w-full flex items-center justify-center" style={{ minHeight: 320 }}>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                onClick={() =>
                  setCurrentImageIdx((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1))
                }
              >
                &#8592;
              </button>

              <img
                src={getImageUrl(modalImages[currentImageIdx])}
                alt={`Property Image ${currentImageIdx + 1}`}
                className="rounded-lg object-contain max-h-[500px] max-w-[90%]"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=No+Image';
                }}
              />

              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                onClick={() =>
                  setCurrentImageIdx((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1))
                }
              >
                &#8594;
              </button>
            </div>

            <div className="flex gap-2 mt-4 mb-4 overflow-x-auto px-4">
              {modalImages.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-16 h-12 object-cover rounded cursor-pointer border-2 ${idx === currentImageIdx ? 'border-blue-500' : 'border-transparent'
                    }`}
                  onClick={() => setCurrentImageIdx(idx)}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/100x75?text=No+Image';
                  }}
                />
              ))}
            </div>

            <div className="text-gray-600 text-sm mb-4">
              {currentImageIdx + 1} / {modalImages.length}
            </div>
          </div>
        </div>
      )}

      {mapModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-screen-xl w-[90%] h-[80vh] p-4">
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center text-2xl z-10"
              onClick={() => setMapModalOpen(false)}
            >
              &times;
            </button>

            <div className="w-full h-full rounded-lg overflow-hidden">
              <MapContainer
                center={[selectedLocation.lat, selectedLocation.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-semibold mb-1">{selectedLocation.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedLocation.address}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
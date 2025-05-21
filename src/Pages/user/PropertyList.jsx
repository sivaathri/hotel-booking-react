import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaHotel, FaBuilding, FaHome, FaUmbrellaBeach, FaWater, FaPaw } from 'react-icons/fa';

// Property type icons mapping
const propertyTypeIcons = {
  'Hotel': FaHotel,
  'Apartment': FaBuilding,
  'Hut House': FaHome,
  'Resort': FaUmbrellaBeach,
  'Beach House': FaWater,
  'Villa': FaHome
};

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
  const numberOfAdults = parseInt(searchParams.get('adults')) || 1;

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
    const numberOfChildren = parseInt(searchParams.get('children')) || 0;
    const childrenAges = JSON.parse(searchParams.get('childrenAges') || '[]');
    const totalGuests = numberOfAdults + numberOfChildren;

    // Start with base price
    let totalPrice = 0;

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
        } else {
          // If no specific pricing found, multiply base price by number of adults
          totalPrice = basePrice * numberOfAdults;
        }
      } catch (error) {
        console.error('Error calculating occupancy pricing:', error);
        // Fallback to base price multiplication if there's an error
        totalPrice = basePrice * numberOfAdults;
      }
    } else {
      // If no occupancy pricing specified, multiply base price by number of adults
      totalPrice = basePrice * numberOfAdults;
    }

    // Add child pricing if there are children
    if (numberOfChildren > 0) {
      if (room?.child_pricing) {
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
            } else {
              // If no specific pricing found for age, use base price
              childPrice += basePrice;
            }
          });

          // Add child price to total
          totalPrice += childPrice;
          console.log('Child price:', childPrice);
        } catch (error) {
          console.error('Error calculating child pricing:', error);
          // Fallback to base price multiplication if there's an error
          totalPrice += basePrice * numberOfChildren;
        }
      } else {
        // If no child pricing specified, multiply base price by number of children
        totalPrice += basePrice * numberOfChildren;
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

  // Helper function to clean room type string
  const cleanRoomType = (type) => {
    if (!type) return 'Double Room';
    // Remove any numbers and underscores after the room type name
    return type.split('_')[0] || 'Double Room';
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
    <div className="w-full lg:w-4/5">
      {properties.map((property) => {
        // Get all unique room types
        const roomTypes = property.rooms?.map(room => cleanRoomType(room.room_type)) || [];
        const uniqueRoomTypes = [...new Set(roomTypes)];
        
        // Get the first room for initial pricing calculation
        const firstRoom = property.rooms?.[0] || {};
        const price = calculatePrice(property, firstRoom);
        const gst = calculateGST(price);
        
        // Get data from API response
        const reviews = property.reviews_count || 0;
        const rating = property.rating || 8.0;
        const ratingText = rating >= 8 ? 'Very Good' : rating >= 7 ? 'Good' : 'Average';
        const breakfastIncluded = firstRoom.breakfast_included ?? false;
        const freeCancellation = firstRoom.free_cancellation_enabled === 1;
        const instantPayment = firstRoom.instant_payment_enabled === 1;
        const urgencyMsg = 'Only 3 rooms left at this price on our site';
        const tag = property.property_type || '';
        const bedType = firstRoom.bed_type || '1 single bed';
        const city = property.location?.city || '';
        const distance = property.location?.distance_from_center || '0';
        const imageUrl = firstRoom.image_urls?.[0] ? getImageUrl(firstRoom.image_urls[0]) : 'https://placehold.co/400x320?text=No+Image';
        const adults = searchParams.get('adults') || '1';
        const nights = 1;
        return (
          <div
            key={property.property_id}
            className="flex bg-white rounded-2xl shadow-lg mb-3 border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
          >
            {/* Image with heart icon */}
            <div className="relative min-w-[220px] max-w-[220px] flex-shrink-0">
              <img
                src={imageUrl}
                alt={property.property_name}
                className="w-full h-full object-cover"
              />
             
            </div>
            {/* Info section */}
            <div className="flex-1 flex flex-col justify-between p-4">
              <div>
                {/* Name, location, tag */}
                <div className="flex items-center gap-2 mb-1">
                  <a href={`/property/${property.property_id}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-blue-700 hover:underline">
                    {property.property_name}
                  </a>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({rating})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <span>{city}</span>
                  {(() => {
                    const locations = [
                      { type: 'Beach', distance: property.property_details?.nearest_beach_distance, icon: <FaUmbrellaBeach className="w-4 h-4 mr-1 text-blue-400" /> },
                      { type: 'Railway', distance: property.property_details?.nearest_railway_station_distance, icon: <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> },
                      { type: 'Airport', distance: property.property_details?.nearest_airport_distance, icon: <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
                      { type: 'Bus Stand', distance: property.property_details?.nearest_bus_stand_distance, icon: <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> }
                    ];

                    // Filter out locations with no distance data and sort by distance
                    const availableLocations = locations
                      .filter(loc => loc.distance && parseFloat(loc.distance) > 0)
                      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                    // Return the nearest location if available
                    if (availableLocations.length > 0) {
                      const nearest = availableLocations[0];
                      return (
                        <>
                         
                        
                          {property.location?.latitude && property.location?.longitude && (
                            <>
                              <span className="text-gray-400">|</span>
                              <button 
                                onClick={() => {
                                  setSelectedLocation({
                                    lat: property.location.latitude,
                                    lng: property.location.longitude,
                                    name: property.property_name,
                                    address: `${property.location?.address || ''}, ${city}`
                                  });
                                  setMapModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 flex items-center underline"
                              >
                                
                                Show on map
                              </button>
                            </>
                          )}
                           <span className="text-gray-400">|</span>
                            <span className="flex items-center text-gray-600">
                            {nearest.icon}
                            {nearest.distance} km
                          </span>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
                {tag && (
                  <div className="flex items-center mt-3 text-xs text-gray-700 mb-2">
                    {React.createElement(propertyTypeIcons[tag] || FaHome, {
                      className: "w-4 h-4 mr-1 text-gray-400"
                    })}
                    {tag}
                  </div>
                )}
               
          
                {/* Breakfast, cancellation, payment */}
                {breakfastIncluded && <div className="text-green-700 font-semibold text-sm">Breakfast included</div>}
                <ul className="text-green-700 text-sm mb-1">
                  {freeCancellation && <li className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Free cancellation</li>}
                  {!instantPayment && <li className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>No prepayment needed <span className="text-gray-500 ml-1">– pay at the property</span></li>}
                  {property.rules?.pets_allowed === 1 && <li className="flex items-center"><FaPaw className="w-4 h-4 mr-1" />Pets allowed</li>}
                </ul>
              </div>
            </div>
            {/* Price and rating section */}
            <div className="flex flex-col justify-between items-end p-4 min-w-[200px]">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-700">{ratingText}</span>
                  <span className="bg-orange-400 text-white font-bold px-3 py-1 rounded-2xl text-lg border border-white">
  {rating}
</span>

                </div>
                <span className="text-xs text-gray-500 mb-2">{reviews} reviews</span>
               
                <span className="text-2xl  font-bold text-gray-900 mb-1">₹ {price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-gray-500 mb-2">{nights} night, {adults} adults</span>
                <span className="text-sm text-gray-500 mb-1">+ ₹ {gst.amount.toLocaleString('en-IN')} taxes and charges</span>
                <button
                  className="mt-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const searchParamsObj = {
                      destination: searchParams.get('destination') || '',
                      checkIn: searchParams.get('checkIn') || '',
                      checkOut: searchParams.get('checkOut') || '',
                      adults: searchParams.get('adults') || '1',
                      children: searchParams.get('children') || '0'
                    };
                    const searchParamsString = new URLSearchParams(searchParamsObj).toString();
                    window.open(`/property/${property.property_id}?${searchParamsString}`, '_blank');
                  }}
                >
                  Book Now
                </button>
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
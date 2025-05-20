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
        const firstRoom = property.rooms?.[0] || {};
        const price = calculatePrice(property, firstRoom);
        const gst = calculateGST(price);
        // Mock data for missing fields
        const reviews = property.reviews_count || 164;
        const rating = property.rating || 7.9;
        const ratingText = rating >= 8 ? 'Very Good' : rating >= 7 ? 'Good' : 'Average';
        const breakfastIncluded = firstRoom.breakfast_included ?? true;
        const freeCancellation = firstRoom.free_cancellation_enabled ?? true;
        const noPrepayment = true;
        const urgencyMsg = 'Only 3 rooms left at this price on our site';
        const tag = property.property_details?.beachfront ? 'Beachfront' : '';
        const roomType = firstRoom.room_type || 'Double Room';
        const bedType = firstRoom.bed_type || '1 single bed';
        const city = property.location?.city || 'Puducherry';
        const distance = property.property_details?.distance_from_center || '3.9';
        const imageUrl = firstRoom.image_urls?.[0] ? getImageUrl(firstRoom.image_urls[0]) : 'https://placehold.co/400x320?text=No+Image';
        const adults = searchParams.get('adults') || '2';
        const nights = 1;
        return (
          <div
            key={property.property_id}
            className="flex bg-white rounded-2xl shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
          >
            {/* Image with heart icon */}
            <div className="relative min-w-[220px] max-w-[220px] h-[244px] flex-shrink-0">
              <img
                src={imageUrl}
                alt={property.property_name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow text-gray-500 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
              </button>
            </div>
            {/* Info section */}
            <div className="flex-1 flex flex-col justify-between p-4">
              <div>
                {/* Name, location, tag */}
                <div className="flex items-center gap-2 mb-1">
                  <a href={`/property/${property.property_id}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-blue-700 hover:underline">
                    {property.property_name}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                  <span>{city}</span>
                  <span className="text-gray-400">·</span>
                  <a href="#" className="underline hover:text-blue-900">Show on map</a>
                  <span className="text-gray-400">·</span>
                  <span>{distance} km from centre</span>
                </div>
                {tag && (
                  <div className="flex items-center text-xs text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11c3 0 6 1.8 6 1.8s3-1.8 6-1.8 6 1.8 6 1.8" /></svg>
                    {tag}
                  </div>
                )}
                {/* Room info */}
                <div className="text-sm font-bold text-gray-800 mb-1">{roomType}</div>
                <div className="text-sm text-gray-700 mb-2">{bedType}</div>
                {/* Breakfast, cancellation, payment */}
                {breakfastIncluded && <div className="text-green-700 font-semibold text-sm">Breakfast included</div>}
                <ul className="text-green-700 text-sm mb-1">
                  {freeCancellation && <li className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Free cancellation</li>}
                  {noPrepayment && <li className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>No prepayment needed <span className="text-gray-500 ml-1">– pay at the property</span></li>}
                </ul>
                <div className="text-red-600 text-sm font-semibold mb-1">{urgencyMsg}</div>
              </div>
            </div>
            {/* Price and rating section */}
            <div className="flex flex-col justify-between items-end p-4 min-w-[200px]">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-700">{ratingText}</span>
                  <span className="bg-blue-700 text-white font-bold px-2 py-1 rounded text-lg">{rating}</span>
                </div>
                <span className="text-xs text-gray-500 mb-2">{reviews} reviews</span>
                <span className="text-xs text-gray-500 mb-2">{nights} night, {adults} adults</span>
                <span className="text-2xl font-bold text-gray-900 mb-1">₹ {price.toLocaleString('en-IN')}</span>
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
                  See availability
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
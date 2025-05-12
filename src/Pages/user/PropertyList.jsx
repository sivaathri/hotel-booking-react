import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';

export default function PropertyList({ properties, loading, error }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Debug log to check properties data
  console.log('Properties data:', properties);

  // Helper function to calculate GST
  const calculateGST = (price) => {
    // Convert price to number and handle invalid values
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
      <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 text-center">
        No properties found
      </div>
    );
  }

  return (
    <div className="w-full h-40px lg:w-4/5">
      {properties.map((property) => {
        const basePrice = Number(property.room.base_price) || 0;
        const gst = calculateGST(basePrice);

        return (
          <div
            key={property.property_id}
            className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row gap-6 cursor-pointer"
            onClick={() => {
              const searchParamsObj = {
                destination: searchParams.get('destination'),
                checkIn: searchParams.get('checkIn'),
                checkOut: searchParams.get('checkOut'),
                adults: searchParams.get('adults'),
                children: searchParams.get('children')
              };

              // Create URL with search parameters
              const searchParamsString = new URLSearchParams(searchParamsObj).toString();
              navigate(`/property/${property.property_id}?${searchParamsString}`, {
                state: {
                  property,
                  searchParams: searchParamsObj
                }
              });
            }}
          >
            {/* Image Gallery */}
            <div className="relative w-full md:w-1/3">
              {console.log('Room data:', property.room)}
              <img
                src={property.room?.image_urls?.[0] ? `http://localhost:3000${property.room.image_urls[0]}` : 'https://placehold.co/400x320?text=No+Image'}
                alt={property.property_name}
                className="w-full h-40 object-cover rounded-xl"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = 'https://placehold.co/400x320?text=No+Image';
                }}
              />
              <div className="absolute bottom-2 left-2 flex gap-2">
                {property.room?.image_urls?.slice(1, 4).map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000${img}`}
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
                    setModalImages(property.room?.image_urls || []);
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
                <p className="text-orange-500 text-sm">
                  <span className="font-bold">{property.location.city}</span> <span className=''>|</span> <span className='text-gray-800'>{property.property_details.nearest_beach_distance} Km drive to Beach</span>
                </p>

                {/* <div className="flex gap-2 mt-2">
                  {property.rules.unmarried_couples_allowed && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">Couple Friendly</span>
                  )}
                  {property.facilities.swimming_pool && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">Swimming Pool</span>
                  )}
                </div> */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    property.room.free_cancellation_enabled && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Free Cancellation" },
                    property.facilities.free_wifi && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Free WiFi" },
                    property.facilities.air_conditioning && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Air Conditioning" },
                    property.facilities.parking && { icon: <CheckCircle className="h-4 w-4 mr-1" />, text: "Free Parking" },
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
            </div>

            {/* Price Section */}
            {/* Divider and Price Section */}
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="w-px bg-gray-200 mx-6 hidden md:block" />
              <div className="flex flex-col min-w-[160px]">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-yellow-400 text-lg"></span>
                    <span className="text-sm font-medium bg-orange-500 px-2 py-1 rounded-full text-white">4.8</span>
                  </div>
                  <span className="text-sm text-gray-400">(2,345 ratings)</span>
                  <p className="text-2xl mt-5 mb-0 font-extrabold text-gray-900">
                    ₹ {basePrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm mb-0 text-gray-500 ">
                    + ₹ {gst.amount.toLocaleString('en-IN')} <span className="lowercase">taxes & fees</span>
                  </p>
                  <p className="text-sm text-gray-400">Per Night</p>
                </div>
              </div>
            </div>

          </div>
        );
      })}

      {modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80">
    <div className="relative bg-white rounded-lg shadow-lg max-w-screen-xl w-full p-0 flex flex-col items-center">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-white bg-black bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center text-2xl z-10"
        onClick={() => setModalOpen(false)}
      >
        &times;
      </button>

      {/* Main Image */}
      <div className="relative w-full flex items-center justify-center" style={{ minHeight: 320 }}>
        {/* Left Arrow */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
          onClick={() =>
            setCurrentImageIdx((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1))
          }
        >
          &#8592;
        </button>

        {/* Image */}
        <img
          src={`http://localhost:3000${modalImages[currentImageIdx]}`}
          alt={`Property Image ${currentImageIdx + 1}`}
          className="rounded-lg object-contain max-h-[500px] max-w-[90%]"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />

        {/* Right Arrow */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
          onClick={() =>
            setCurrentImageIdx((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1))
          }
        >
          &#8594;
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 mb-4 overflow-x-auto px-4">
        {modalImages.map((img, idx) => (
          <img
            key={idx}
            src={`http://localhost:3000${img}`}
            alt={`Thumbnail ${idx + 1}`}
            className={`w-16 h-12 object-cover rounded cursor-pointer border-2 ${
              idx === currentImageIdx ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setCurrentImageIdx(idx)}
            onError={(e) => {
              e.target.src = 'https://placehold.co/100x75?text=No+Image';
            }}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="text-gray-600 text-sm mb-4">
        {currentImageIdx + 1} / {modalImages.length}
      </div>
    </div>
  </div>
)}

    </div>
  );
} 
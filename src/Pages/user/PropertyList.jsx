import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PropertyList({ properties, loading, error }) {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/property/${property.property_id}`)}
          >
            {/* Image Gallery */}
            <div className="relative w-full md:w-1/3">
              <img 
                src={property.room.image_paths ? JSON.parse(property.room.image_paths)[0] : '/api/placeholder/400/320'} 
                alt={property.property_name} 
                className="w-full h-40 object-cover rounded-xl" 
              />
              <div className="absolute bottom-2 left-2 flex gap-2">
                {property.room.image_paths && JSON.parse(property.room.image_paths).slice(1, 4).map((img, index) => (
                  <img key={index} src={img} className="w-12 h-8 object-cover rounded" />
                ))}
                <div className="w-12 h-8 bg-black/60 text-white flex items-center justify-center rounded text-xs font-bold cursor-pointer">View All</div>
              </div>
            </div>

            {/* Property Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-800">{property.property_name}</h3>
                  <span className="text-yellow-400 text-lg">★★★★★</span>
                </div>
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  {property.location.address_line1}, {property.location.city}
                </a>
                <div className="flex gap-2 mt-2">
                  {property.rules.unmarried_couples_allowed && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">Couple Friendly</span>
                  )}
                  {property.facilities.swimming_pool && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium">Swimming Pool</span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {property.room.free_cancellation_enabled && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" /> Free Cancellation
                    </div>
                  )}
                  {property.facilities.free_wifi && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" /> Free WiFi
                    </div>
                  )}
                  {property.facilities.air_conditioning && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" /> Air Conditioning
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col items-end justify-between min-w-[160px]">
              <div className="text-right">
                <p className="text-3xl font-extrabold text-gray-900">
                  ₹ {basePrice.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  + ₹ {gst.amount.toLocaleString('en-IN')} <span className="lowercase">taxes & fees</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">Per Night</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 
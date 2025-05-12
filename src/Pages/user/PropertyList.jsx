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
            <div className="flex  flex-col min-w-[160px]">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 ">
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
        );
      })}
    </div>
  );
} 
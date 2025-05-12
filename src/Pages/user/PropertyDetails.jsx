import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { 
  FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaSnowflake, 
  FaConciergeBell, FaBed, FaArrowUp, FaUmbrellaBeach, 
   FaVideo, FaFirstAid, FaBell, FaSuitcaseRolling,
  FaHandHoldingHeart
} from 'react-icons/fa';
import { MdMeetingRoom, MdLocalLaundryService, MdPower, MdSecurity, MdTv, MdRoom } from 'react-icons/md';
import { GiVacuumCleaner } from 'react-icons/gi';
import { BiRestaurant } from 'react-icons/bi';
import Header from './Header';
import SearchBar from './SearchBar';

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const location = useLocation();
  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (property) return;

    setLoading(true);
    fetch(`http://localhost:3000/api/getall/property/${propertyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setProperty(data.data[0]);
        } else {
          setError('Property not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load property details');
        setLoading(false);
      });
  }, [propertyId, property]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!property) return <div className="text-center p-4">No property found</div>;

  const images = property.room?.image_paths ? JSON.parse(property.room.image_paths) : [];

  return (
    <>
      {/* Header Section */}
      <Header/>
        {/* Search Bar Section */}
        <SearchBar/>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{property.property_name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
              <FaStar className="mr-1" />
              <span>4.5</span>
            </div>
            <span className="text-gray-600">|</span>
            <span className="text-gray-600">{property.location?.city}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-2">
            <img 
              src={`http://localhost:3000/${images[selectedImage]}`} 
              alt="Property" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <img 
                key={idx} 
                src={`http://localhost:3000/${img}`} 
                alt={`Property ${idx}`} 
                className={`w-24 h-20 object-cover rounded cursor-pointer ${selectedImage === idx ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="col-span-2">
           

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {property.facilities?.swimming_pool === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaSwimmingPool className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Swimming Pool</span>
                  </div>
                )}
                {property.facilities?.restaurant === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaUtensils className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Restaurant</span>
                  </div>
                )}
                {property.facilities?.room_service_24hr === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaConciergeBell className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">24/7 Room Service</span>
                  </div>
                )}
                {property.facilities?.free_parking === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaParking className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Free Parking</span>
                  </div>
                )}
                {property.facilities?.free_wifi === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaWifi className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Free WiFi</span>
                  </div>
                )}
                {property.facilities?.air_conditioning === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaSnowflake className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Air Conditioning</span>
                  </div>
                )}
                {property.facilities?.housekeeping === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <GiVacuumCleaner className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Housekeeping</span>
                  </div>
                )}
                {property.facilities?.elevator === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaArrowUp className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Elevator</span>
                  </div>
                )}
                {property.facilities?.tv === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <MdTv className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">TV</span>
                  </div>
                )}
                {property.facilities?.cctv === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaVideo className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">CCTV Security</span>
                  </div>
                )}
                {property.facilities?.first_aid === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaFirstAid className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">First Aid</span>
                  </div>
                )}
                {property.facilities?.wake_up_call === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaBell className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Wake-up Call</span>
                  </div>
                )}
                {property.facilities?.luggage_storage === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaSuitcaseRolling className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Luggage Storage</span>
                  </div>
                )}
                {property.facilities?.massage === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <FaHandHoldingHeart className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Massage</span>
                  </div>
                )}
                {property.facilities?.conference_room === 1 && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <MdMeetingRoom className="text-2xl text-gray-600" />
                    <span className="text-sm text-center">Conference Room</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Book Now</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select className="w-full p-2 border rounded">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Check Availability
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About this property</h2>
              <p className="text-gray-600 mb-4">{property.description}</p>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-600">
                  {property.location?.address_line1}, {property.location?.city}
                </p>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
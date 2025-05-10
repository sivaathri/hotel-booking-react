import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaSnowflake } from 'react-icons/fa';
import Header from './Header';
import SearchBar from './SearchBar';

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
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
  }, [propertyId]);

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

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaWifi className="text-blue-500" />
                  <span>Free WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaParking className="text-blue-500" />
                  <span>Free Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaSwimmingPool className="text-blue-500" />
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUtensils className="text-blue-500" />
                  <span>Restaurant</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaSnowflake className="text-blue-500" />
                  <span>Air Conditioning</span>
                </div>
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
        </div>
      </div>
    </>
  );
}
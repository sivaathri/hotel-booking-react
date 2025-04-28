import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationMarker from './LocationMarker';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Step2 = ({ formData, setFormData, showMap, setShowMap, selectedLocation, setSelectedLocation, isEditing }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Location Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Street address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Apartment, suite, unit, etc."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">State/Province</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Zip/Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter zip/postal code"
            />
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setShowMap(!showMap)}
              disabled={!isEditing}
              className={`flex-1 p-2 border border-gray-300 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                !isEditing ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-400'
              }`}
            >
              <FiMapPin className="text-lg" />
              {showMap ? 'Hide Map' : 'Select Location on Map'}
            </button>
          </div>

          {showMap && (
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={selectedLocation || [11.9139, 79.8145]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxZoom={19}
                  minZoom={1}
                />
                {selectedLocation && (
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                    <Popup>
                      {formData.addressLine1} {formData.addressLine2}<br />
                      {formData.city}, {formData.state}<br />
                      {formData.country} {formData.postalCode}
                    </Popup>
                  </Marker>
                )}
                <LocationMarker
                  position={selectedLocation}
                  setPosition={(pos) => {
                    if (isEditing) {
                      setSelectedLocation(pos);
                      setFormData(prev => ({
                        ...prev,
                        mapLocation: pos
                      }));
                    }
                  }}
                />
              </MapContainer>
            </div>
          )}

          {formData.mapLocation && (
            <div className="text-sm text-gray-600">
              <p>Selected Location: {formData.city}, {formData.state}, {formData.country}</p>
              <p>Coordinates: {formData.mapLocation.lat.toFixed(6)}, {formData.mapLocation.lng.toFixed(6)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2; 
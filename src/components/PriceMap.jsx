import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PriceMap = ({ properties }) => {
  const createCustomIcon = (price) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="bg-white border border-gray-300 px-2 py-1 rounded-full inline-flex items-center shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
        <span class="text-black text-[15px] font-bold leading-none">${price}</span>
      </div>`,
      iconSize: [60, 20],
      iconAnchor: [30, 10],
    });
  };

  return (
    <div className="w-full h-[600px] rounded-lg shadow-lg">
      <MapContainer 
        center={[11.9404, 79.8083]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property, index) => {
          const lat = parseFloat(property.location.latitude);
          const lng = parseFloat(property.location.longitude);
          
          // Get the room price, handling both array and single room cases
          const room = Array.isArray(property.rooms) && property.rooms.length > 0 
            ? property.rooms[0] 
            : property.room;
          
          const priceValue = parseInt(room?.base_price || '0', 10).toLocaleString();
          const price = `₹${priceValue}`;
          const name = property.property_name;

          return (
            <Marker 
              key={index} 
              position={[lat, lng]}
              icon={createCustomIcon(price)}
              eventHandlers={{
                click: () => {
                  // Open property details in new tab
                  window.open(`/property/${property.property_id}`, '_blank');
                }
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold mb-1">{name}</h3>
                  <p className="text-blue-600 font-bold">{price}</p>
                  <button 
                    onClick={() => window.open(`/property/${property.property_id}`, '_blank')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PriceMap;

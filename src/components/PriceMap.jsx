import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const prices = [
  { lat: 11.9404, lng: 79.8083, price: '₹1,300', name: 'Hotel A' },
  { lat: 11.9435, lng: 79.8195, price: '₹3,392', name: 'Hotel B' },
];

const PriceMap = () => {
  const createCustomIcon = (price) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="bg-white px-2 py-1 rounded-lg shadow-md border border-gray-200">
               <span class="text-[#FF5A5F] font-medium">${price}</span>
             </div>`,
      iconSize: [60, 20],
      iconAnchor: [30, 10]
    });
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={[11.9404, 79.8083]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {prices.map((place, index) => (
          <Marker 
            key={index} 
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.price)}
          >
            <Popup>
              <div className="font-medium">
                <p className="text-lg">{place.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PriceMap; 
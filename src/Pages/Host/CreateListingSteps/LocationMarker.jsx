import React from 'react';
import { useMapEvents, Marker } from 'react-leaflet';

const LocationMarker = ({ position, setPosition, setAddress, setAddressDetails }) => {
  useMapEvents({
    async click(e) {
      const newPosition = e.latlng;
      setPosition(newPosition);
      console.log('Selected Coordinates:', {
        latitude: newPosition.lat.toFixed(6),
        longitude: newPosition.lng.toFixed(6)
      });

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setAddress(data.display_name);
          const address = data.address || {};
          setAddressDetails({
            addressLine1: address.road || '',
            addressLine2: address.house_number || '',
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            country: address.country || '',
            postalCode: address.postcode || ''
          });
          console.log('Address Details:', {
            fullAddress: data.display_name,
            addressComponents: address
          });
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

export default LocationMarker; 
import React from 'react';
import PriceMap from '../components/PriceMap';

const PriceMapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Hotel Prices Map</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PriceMap />
        </div>
      </div>
    </div>
  );
};

export default PriceMapPage; 
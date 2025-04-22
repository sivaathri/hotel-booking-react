import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiInfo, FiCheck } from 'react-icons/fi';
import HostHeader from './HostHeader';

const CreateNewListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    price: '',
    images: [],
    description: '',
    amenities: [],
  });

  const propertyTypes = [
    'Apartment',
    'House',
    'Villa',
    'Cottage',
    'Cabin',
    'Hotel',
    'Resort',
  ];

  const amenities = [
    'WiFi',
    'Kitchen',
    'Washer',
    'Dryer',
    'Air conditioning',
    'Heating',
    'TV',
    'Pool',
    'Free parking',
    'Gym',
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      navigate('/host/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">What kind of place are you listing?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {propertyTypes.map(type => (
                <button
                  key={type}
                  className={`p-4 border rounded-lg text-center ${
                    formData.propertyType === type
                      ? 'border-black bg-gray-100'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, propertyType: type }))}
                >
                  <FiHome className="mx-auto mb-2" />
                  {type}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Where's your place located?</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <FiMapPin />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="flex-1 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Set your price</h2>
            <div className="flex items-center gap-2 p-4 border rounded-lg">
              <FiDollarSign />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price per night"
                className="flex-1 outline-none"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Add some amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map(amenity => (
                <button
                  key={amenity}
                  className={`p-4 border rounded-lg text-left flex items-center gap-2 ${
                    formData.amenities.includes(amenity)
                      ? 'border-black bg-gray-100'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  <FiCheck className={formData.amenities.includes(amenity) ? 'text-green-500' : 'text-gray-400'} />
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Describe your place</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell guests about your place..."
              className="w-full p-4 border rounded-lg h-40 outline-none"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <HostHeader />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold">Create your listing</h1>
            <span className="text-gray-500">Step {step} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`px-6 py-2 border rounded-lg ${
              step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {step === 5 ? 'Create Listing' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateNewListing; 
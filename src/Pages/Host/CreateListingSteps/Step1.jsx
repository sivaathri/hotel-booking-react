import React from 'react';
import { FiHome } from 'react-icons/fi';

const Step1 = ({ formData, setFormData, propertyTypes }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Property Name</label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter property name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {propertyTypes.map(type => (
              <button
                key={type}
                className={`p-4 border rounded-lg text-center ${formData.propertyType === type
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
      </div>
    </div>
  );
};

export default Step1; 
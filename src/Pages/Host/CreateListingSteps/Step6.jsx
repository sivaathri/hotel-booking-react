import React from 'react';
import { FiClock, FiCalendar } from 'react-icons/fi';

const Step6 = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">House Rules</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Check-In Time</label>
            <input
              type="time"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Check-Out Time</label>
            <input
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="petsAllowed"
              checked={formData.petsAllowed}
              onChange={handleCheckboxChange}
            />
            Pets Allowed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="smokingAllowed"
              checked={formData.smokingAllowed}
              onChange={handleCheckboxChange}
            />
            Smoking Allowed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="alcoholAllowed"
              checked={formData.alcoholAllowed}
              onChange={handleCheckboxChange}
            />
            Alcohol Allowed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="noiseRestrictions"
              checked={formData.noiseRestrictions}
              onChange={handleCheckboxChange}
            />
            Noise Restrictions
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step6; 
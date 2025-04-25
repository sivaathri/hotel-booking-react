import React from 'react';
import { FiClock, FiCalendar } from 'react-icons/fi';

const Step6 = ({ formData, setFormData, isEditing }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    if (!isEditing) return;
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
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Check-Out Time</label>
            <input
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            Pets Allowed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="smokingAllowed"
              checked={formData.smokingAllowed}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            Smoking Allowed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="alcoholAllowed"
              checked={formData.alcoholAllowed}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            Alcohol Allowed
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="noiseRestrictions"
              checked={formData.noiseRestrictions}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            Noise Restrictions
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step6; 
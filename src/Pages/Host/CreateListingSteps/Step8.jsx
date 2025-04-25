import React from 'react';

const Step8 = ({ formData, setFormData, guestTypes, isEditing }) => {
  const handleArrayToggle = (field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
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
      <h2 className="text-2xl font-semibold">Guest Booking Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Who can book?</label>
          <div className="grid grid-cols-2 gap-4">
            {guestTypes.map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allowedGuests.includes(type)}
                  onChange={() => handleArrayToggle('allowedGuests', type)}
                  disabled={!isEditing}
                  className={!isEditing ? 'cursor-not-allowed' : ''}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="instantBooking"
              checked={formData.instantBooking}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            Instant Booking
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="manualApproval"
              checked={formData.manualApproval}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            Manual Approval
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step8; 
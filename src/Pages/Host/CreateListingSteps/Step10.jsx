import React from 'react';

const Step10 = ({ formData, setFormData, isEditing }) => {
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
      <h2 className="text-2xl font-semibold">Verification & Submission</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">ID Proof</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              if (!isEditing) return;
              setFormData(prev => ({
                ...prev,
                idProof: e.target.files[0]
              }));
            }}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Property Ownership Proof</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              if (!isEditing) return;
              setFormData(prev => ({
                ...prev,
                propertyProof: e.target.files[0]
              }));
            }}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            I confirm all details are correct
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className={!isEditing ? 'cursor-not-allowed' : ''}
            />
            I accept TripNGrub's terms and policies
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step10; 
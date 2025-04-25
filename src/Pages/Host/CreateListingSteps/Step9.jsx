import React from 'react';

const Step9 = ({ formData, setFormData, paymentOptions, isEditing }) => {
  const handleArrayToggle = (field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleInputChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payment Setup</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Payment Methods</label>
          <div className="grid grid-cols-2 gap-4">
            {paymentOptions.map(method => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.paymentMethods.includes(method)}
                  onChange={() => handleArrayToggle('paymentMethods', method)}
                  disabled={!isEditing}
                  className={!isEditing ? 'cursor-not-allowed' : ''}
                />
                {method}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">PAN/GST ID</label>
          <input
            type="text"
            name="panGstId"
            value={formData.panGstId}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Enter PAN or GST ID"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Bank Account Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                }))}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">IFSC Code</label>
              <input
                type="text"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bankDetails: { ...prev.bankDetails, ifscCode: e.target.value }
                }))}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Holder Name</label>
            <input
              type="text"
              value={formData.bankDetails.accountHolderName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                bankDetails: { ...prev.bankDetails, accountHolderName: e.target.value }
              }))}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9; 
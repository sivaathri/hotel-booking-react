import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const Step7 = ({ formData, setFormData, refundPolicies, isEditing }) => {
  const handleRoomChange = (index, field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pricing & Availability</h2>

      {/* Room Summary Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Room Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Floor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Room Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Number of Rooms</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bed Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price/Night (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.rooms.map((room, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.floor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.bhk}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.capacity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.bedType}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={room.pricePerNight}
                      onChange={(e) => handleRoomChange(index, "pricePerNight", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter price"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Discounts</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.discounts.longStay}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discounts: { ...prev.discounts, longStay: e.target.checked }
                }))}
              />
              Long Stay Discount
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.discounts.earlyBird}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discounts: { ...prev.discounts, earlyBird: e.target.checked }
                }))}
              />
              Early Bird Discount
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.discounts.lastMinute}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discounts: { ...prev.discounts, lastMinute: e.target.checked }
                }))}
              />
              Last Minute Discount
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Refund Policy</label>
          <div className="grid grid-cols-3 gap-4">
            {refundPolicies.map(policy => (
              <button
                key={policy}
                disabled={!isEditing}
                className={`p-2 border rounded-lg text-center ${
                  formData.refundPolicy === policy ? 'border-black bg-gray-100' : 'hover:border-gray-400'
                } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, refundPolicy: policy }))}
              >
                {policy}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7; 
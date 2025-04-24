import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const Step7 = ({ formData, setFormData, refundPolicies }) => {
  const handleRoomChange = (index, field, value) => {
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rooms Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bed Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price/Night (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.rooms.map((room, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{room.floor || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{room.bhk || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{room.capacity ? `${room.capacity} persons` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{room.bedType || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <input
                      type="number"
                      value={room.price || ''}
                      onChange={(e) => handleRoomChange(index, "price", e.target.value)}
                      className="w-24 p-1 border rounded"
                      placeholder="Enter price"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-600">Total Rooms: {formData.rooms.length}</p>
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
                className={`p-2 border rounded-lg text-center ${formData.refundPolicy === policy ? 'border-black bg-gray-100' : 'hover:border-gray-400'
                  }`}
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
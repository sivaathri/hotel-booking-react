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

  const handleRoomCapacityChange = (roomIndex, roomNumber, capacity) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === roomIndex ? {
          ...room,
          individualRoomCapacities: {
            ...room.individualRoomCapacities,
            [roomNumber]: capacity
          }
        } : room
      )
    }));
  };

  const handleOccupancyRangeChange = (index, rangeIndex, field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? {
          ...room,
          occupancyRanges: room.occupancyRanges.map((range, ri) =>
            ri === rangeIndex ? { ...range, [field]: value } : range
          )
        } : room
      )
    }));
  };

  const addOccupancyRange = (index) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? {
          ...room,
          occupancyRanges: [
            ...(room.occupancyRanges || []),
            { minGuests: 1, maxGuests: 1, value: 0, type: 'INR' }
          ]
        } : room
      )
    }));
  };

  const removeOccupancyRange = (index, rangeIndex) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? {
          ...room,
          occupancyRanges: room.occupancyRanges.filter((_, ri) => ri !== rangeIndex)
        } : room
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
          <table className="w-full min-w-[1400px] divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-24">Floor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-32">Room Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-32">Number of Rooms</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-48">Room Capacities</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-40">Bed Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-40">Base Price/Night (₹)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-96">Occupancy Price Adjustments</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.rooms.map((room, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.floor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.bhk}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{room.numberOfRooms}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      {Array.from({ length: room.numberOfRooms }, (_, i) => {
                        const roomNumber = i + 1;
                        const currentCapacity = room.individualRoomCapacities?.[roomNumber] || room.capacity;
                        return (
                          <div key={roomNumber} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Room {roomNumber}:</span>
                            <input
                              type="number"
                              value={currentCapacity}
                              onChange={(e) => handleRoomCapacityChange(index, roomNumber, parseInt(e.target.value))}
                              disabled={!isEditing}
                              className={`w-20 p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              min="1"
                              max={room.capacity}
                            />
                            <span className="text-sm text-gray-600">guests</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {room.bedType === "SingleQueenSingle" ? "Single Queen Single" : room.bedType}
                  </td>
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
                  <td className="px-4 py-3">
                    <div className="space-y-4">
                      {(room.occupancyRanges || []).map((range, rangeIndex) => (
                        <div key={rangeIndex} className="flex items-center gap-2 p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={range.minGuests}
                              onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'minGuests', parseInt(e.target.value))}
                              disabled={!isEditing}
                              className={`w-16 p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              min="1"
                              max={range.maxGuests}
                            />
                            <span className="text-sm text-gray-600">to</span>
                            <input
                              type="number"
                              value={range.maxGuests}
                              onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'maxGuests', parseInt(e.target.value))}
                              disabled={!isEditing}
                              className={`w-16 p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              min={range.minGuests}
                              max={room.capacity}
                            />
                            <span className="text-sm text-gray-600">guests:</span>
                          </div>
                          <input
                            type="number"
                            value={range.value}
                            onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'value', e.target.value)}
                            disabled={!isEditing}
                            className={`w-32 p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            placeholder="Amount"
                          />
                          <select
                            value={range.type}
                            onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'type', e.target.value)}
                            disabled={!isEditing}
                            className={`w-24 p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          >
                            <option value="INR">INR</option>
                            <option value="percentage">%</option>
                          </select>
                          {isEditing && (
                            <button
                              onClick={() => removeOccupancyRange(index, rangeIndex)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          onClick={() => addOccupancyRange(index)}
                          className="w-full p-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
                        >
                          + Add Occupancy Range
                        </button>
                      )}
                    </div>
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
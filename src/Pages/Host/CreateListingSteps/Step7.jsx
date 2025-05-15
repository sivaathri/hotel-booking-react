import React, { useEffect } from 'react';
import { FiDollarSign, FiPlus, FiTrash2 } from 'react-icons/fi';

const Step7 = ({ formData, setFormData, refundPolicies, isEditing }) => {
  // Initialize room capacities when component mounts
  useEffect(() => {
    if (formData.rooms) {
      setFormData(prev => ({
        ...prev,
        rooms: prev.rooms.map(room => {
          // Initialize individualRoomCapacities if it doesn't exist
          const individualRoomCapacities = room.individualRoomCapacities || {};
          
          // Initialize capacities for each room number
          for (let i = 1; i <= (room.numberOfRooms || 1); i++) {
            if (!individualRoomCapacities[i]) {
              individualRoomCapacities[i] = { adults: 1, children: 0 };
            }
          }

          // Calculate total capacity
          const totalCapacity = Object.values(individualRoomCapacities).reduce((sum, capacity) => {
            return sum + ((capacity?.adults || 0) + (capacity?.children || 0));
          }, 0);

          // Add room capacity data for API
          const roomCapacityAdults = Object.values(individualRoomCapacities).reduce((sum, capacity) => 
            sum + (capacity?.adults || 0), 0);
          const roomCapacityChildren = Object.values(individualRoomCapacities).reduce((sum, capacity) => 
            sum + (capacity?.children || 0), 0);

          return {
            ...room,
            individualRoomCapacities,
            capacity: totalCapacity,
            room_capacity_adults: roomCapacityAdults,
            room_capacity_children: roomCapacityChildren
          };
        })
      }));
    }
  }, []);

  const handleRoomChange = (index, field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? { 
          ...room, 
          [field]: value,
          // Ensure individualRoomCapacities exists
          individualRoomCapacities: room.individualRoomCapacities || {}
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
            { minGuests: 1, value: 0, type: 'INR' }
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

  const handleInstantPaymentChange = (e) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      instantPayment: e.target.checked
    }));
  };

  const handleFreeCancellationChange = (e) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      freeCancellation: e.target.checked
    }));
  };

  const handleAddRefundPolicy = () => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      refundPolicies: [
        ...(prev.refundPolicies || []),
        {
          type: '',
          daysBeforeCheckIn: '',
          percentage: '',
          id: Date.now()
        }
      ]
    }));
  };

  const handleRefundPolicyChange = (index, field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      refundPolicies: prev.refundPolicies.map((policy, i) =>
        i === index ? { ...policy, [field]: value } : policy
      )
    }));
  };

  const handleRemoveRefundPolicy = (index) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      refundPolicies: prev.refundPolicies.filter((_, i) => i !== index)
    }));
  };

  const handleRoomCapacityChange = (index, roomNumber, type, value) => {
    if (!isEditing) return;
    const parsedValue = parseInt(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) => {
        if (i !== index) return room;
        
        // Initialize individualRoomCapacities if it doesn't exist
        const individualRoomCapacities = room.individualRoomCapacities || {};
        const currentRoomCapacity = individualRoomCapacities[roomNumber] || { adults: 1, children: 0 };
        
        // Update the specific room capacity
        const updatedRoomCapacities = {
          ...individualRoomCapacities,
          [roomNumber]: {
            ...currentRoomCapacity,
            [type]: parsedValue
          }
        };

        // Calculate total capacity and room capacities
        const totalCapacity = Object.values(updatedRoomCapacities).reduce((sum, capacity) => {
          return sum + ((capacity?.adults || 0) + (capacity?.children || 0));
        }, 0);

        const roomCapacityAdults = Object.values(updatedRoomCapacities).reduce((sum, capacity) => 
          sum + (capacity?.adults || 0), 0);
        const roomCapacityChildren = Object.values(updatedRoomCapacities).reduce((sum, capacity) => 
          sum + (capacity?.children || 0), 0);

        return {
          ...room,
          individualRoomCapacities: updatedRoomCapacities,
          capacity: totalCapacity,
          room_capacity_adults: roomCapacityAdults,
          room_capacity_children: roomCapacityChildren
        };
      })
    }));
  };

  const handleChildPricingChange = (index, field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      childPricing: prev.childPricing.map((pricing, i) =>
        i === index ? { ...pricing, [field]: value } : pricing
      )
    }));
  };

  const addChildPricing = () => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      childPricing: [
        ...(prev.childPricing || []),
        {
          ageFrom: 0,
          ageTo: 0,
          price: 0,
          type: 'INR',
          id: Date.now()
        }
      ]
    }));
  };

  const removeChildPricing = (index) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      childPricing: prev.childPricing.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Pricing & Availability</h2>

      {/* Room Summary Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-6">Room Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-24">Floor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">Room Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">Number of Rooms</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">Room Capacities</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-40">Total Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-40">Base Price/Night (₹)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-96">Occupancy Price Adjustments</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.rooms.map((room, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{room.floor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{room.bhk}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{room.numberOfRooms}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {Array.from({ length: room.numberOfRooms }, (_, i) => {
                        const roomNumber = i + 1;
                        const currentCapacity = room.individualRoomCapacities?.[roomNumber] || { adults: 0, children: 0 };
                        const totalCapacity = (currentCapacity.adults || 0) + (currentCapacity.children || 0);
                        return (
                          <div key={roomNumber} className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-900">Room {roomNumber}</span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Adults:</span>
                                <input
                                  type="number"
                                  value={currentCapacity.adults || 0}
                                  onChange={(e) => handleRoomCapacityChange(index, roomNumber, 'adults', e.target.value)}
                                  disabled={!isEditing}
                                  className={`w-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                  min="1"
                                  max={room.capacity}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Children:</span>
                                <input
                                  type="number"
                                  value={currentCapacity.children || 0}
                                  onChange={(e) => handleRoomCapacityChange(index, roomNumber, 'children', e.target.value)}
                                  disabled={!isEditing}
                                  className={`w-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                  min="0"
                                  max={room.capacity - (currentCapacity.adults || 0)}
                                />
                              </div>
                              <span className="text-sm text-gray-500">Total: {totalCapacity} guests</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {Object.values(room.individualRoomCapacities || {}).reduce((sum, capacity) => {
                      return sum + ((capacity?.adults || 0) + (capacity?.children || 0));
                    }, 0)} guests
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={room.pricePerNight}
                      onChange={(e) => handleRoomChange(index, "pricePerNight", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                      placeholder="Enter price"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {(room.occupancyRanges || []).map((range, rangeIndex) => (
                        <div key={rangeIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">For</span>
                            <input
                              type="number"
                              value={range.minGuests}
                              onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'minGuests', parseInt(e.target.value))}
                              disabled={!isEditing}
                              className={`w-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                              min="1"
                              max={room.capacity}
                            />
                            <span className="text-sm text-gray-500">guest(s)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Add</span>
                            <input
                              type="number"
                              value={range.value}
                              onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'value', e.target.value)}
                              disabled={!isEditing}
                              className={`w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                              placeholder="Amount"
                            />
                            <select
                              value={range.type}
                              onChange={(e) => handleOccupancyRangeChange(index, rangeIndex, 'type', e.target.value)}
                              disabled={!isEditing}
                              className={`w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                            >
                              <option value="INR">₹ per guest</option>
                              <option value="percentage">% per guest</option>
                            </select>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeOccupancyRange(index, rangeIndex)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          onClick={() => addOccupancyRange(index)}
                          className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiPlus /> Add Price Adjustment
                        </button>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Add price adjustments for additional guests. The adjustment will be applied per guest above the base occupancy.
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Child Pricing Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Child Pricing</h3>
          {isEditing && (
            <button
              onClick={addChildPricing}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Age Range
            </button>
          )}
        </div>
        <div className="space-y-4">
          {(formData.childPricing || []).map((pricing, index) => (
            <div key={pricing.id} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium text-gray-700">Age Range {index + 1}</h4>
                {isEditing && (
                  <button
                    onClick={() => removeChildPricing(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Age From</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={pricing.ageFrom}
                      onChange={(e) => handleChildPricingChange(index, 'ageFrom', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min="0"
                      max={pricing.ageTo}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                    />
                    <span className="text-sm text-gray-500">years</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Age To</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={pricing.ageTo}
                      onChange={(e) => handleChildPricingChange(index, 'ageTo', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min={pricing.ageFrom}
                      max="17"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                    />
                    <span className="text-sm text-gray-500">years</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={pricing.price}
                      onChange={(e) => handleChildPricingChange(index, 'price', e.target.value)}
                      disabled={!isEditing}
                      min="0"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price Type</label>
                  <select
                    value={pricing.type}
                    onChange={(e) => handleChildPricingChange(index, 'type', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                  >
                    <option value="INR">Fixed Amount (₹)</option>
                    <option value="percentage">Percentage of Room Rate (%)</option>
                  </select>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {pricing.type === 'INR' 
                  ? `Children aged ${pricing.ageFrom}-${pricing.ageTo} years will be charged ₹${pricing.price} per night`
                  : `Children aged ${pricing.ageFrom}-${pricing.ageTo} years will be charged ${pricing.price}% of the room rate per night`}
              </p>
            </div>
          ))}
          {(formData.childPricing || []).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No child pricing rules added yet. Click "Add Age Range" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Instant Payment Option */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="instantPayment"
            checked={formData.instantPayment || false}
            onChange={handleInstantPaymentChange}
            disabled={!isEditing}
            className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              !isEditing ? 'cursor-not-allowed opacity-50' : ''
            }`}
          />
          <label htmlFor="instantPayment" className="text-sm font-medium text-gray-900">
            Enable instant payment (0 down payment)
          </label>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          When enabled, guests can book without making an advance payment. Payment will be collected at check-in.
        </p>
      </div>

      {/* Free Cancellation Option */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="freeCancellation"
            checked={formData.freeCancellation || false}
            onChange={handleFreeCancellationChange}
            disabled={!isEditing}
            className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              !isEditing ? 'cursor-not-allowed opacity-50' : ''
            }`}
          />
          <label htmlFor="freeCancellation" className="text-sm font-medium text-gray-900">
            Enable free cancellation
          </label>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          When enabled, guests can cancel their booking free of charge up to 24 hours before check-in.
        </p>
      </div>

      {/* Refund Policy Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Refund Policies</h3>
          {isEditing && (
            <button
              onClick={handleAddRefundPolicy}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Policy
            </button>
          )}
        </div>
        <div className="space-y-4">
          {(formData.refundPolicies || []).map((policy, index) => (
            <div key={policy.id} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium text-gray-700">Policy {index + 1}</h4>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveRefundPolicy(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Policy Type</label>
                  <select
                    value={policy.type || ''}
                    onChange={(e) => handleRefundPolicyChange(index, 'type', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                  >
                    <option value="">Select a policy</option>
                    <option value="fully_refundable">Fully Refundable</option>
                    <option value="partially_refundable">Partially Refundable</option>
                    <option value="non_refundable">Non-Refundable</option>
                  </select>
                </div>
                {policy.type === 'fully_refundable' && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Days Before Check-in</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={policy.daysBeforeCheckIn || ''}
                        onChange={(e) => handleRefundPolicyChange(index, 'daysBeforeCheckIn', e.target.value)}
                        disabled={!isEditing}
                        min="0"
                        className={`w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                      />
                      <span className="text-sm text-gray-500">days before check-in</span>
                    </div>
                    <p className="text-sm text-gray-500">Guests can cancel and get a full refund if cancelled at least this many days before check-in</p>
                  </div>
                )}
                {policy.type === 'partially_refundable' && (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-700">Days Before Check-in</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={policy.daysBeforeCheckIn || ''}
                          onChange={(e) => handleRefundPolicyChange(index, 'daysBeforeCheckIn', e.target.value)}
                          disabled={!isEditing}
                          min="0"
                          className={`w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        />
                        <span className="text-sm text-gray-500">days before check-in</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-700">Refund Percentage</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={policy.percentage || ''}
                          onChange={(e) => handleRefundPolicyChange(index, 'percentage', e.target.value)}
                          disabled={!isEditing}
                          min="0"
                          max="100"
                          className={`w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        />
                        <span className="text-sm text-gray-500">% of booking amount</span>
                      </div>
                      <p className="text-sm text-gray-500">Guests will receive this percentage of their booking amount if cancelled at least this many days before check-in</p>
                    </div>
                  </div>
                )}
                {policy.type === 'non_refundable' && (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-700">Days Before Check-in</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={policy.daysBeforeCheckIn || ''}
                          onChange={(e) => handleRefundPolicyChange(index, 'daysBeforeCheckIn', e.target.value)}
                          disabled={!isEditing}
                          min="0"
                          className={`w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                        />
                        <span className="text-sm text-gray-500">days before check-in</span>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-md">
                      <p className="text-sm text-red-700">
                        This booking becomes non-refundable {policy.daysBeforeCheckIn ? `${policy.daysBeforeCheckIn} days` : 'immediately'} before check-in. Guests will not receive any refund if they cancel their booking after this point.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {(formData.refundPolicies || []).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No refund policies added yet. Click "Add Policy" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step7; 
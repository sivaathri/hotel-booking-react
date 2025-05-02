import React, { useState } from 'react';
import { FiGrid } from 'react-icons/fi';

const roomTypes = [
  { value: 'Single', label: 'Single', description: '1 bed, 1 room' },
  { value: 'Double', label: 'Double', description: '1 double bed, 1 room' },
  { value: 'Twin', label: 'Twin', description: '2 single beds, 1 room' },
  { value: 'TwinDouble', label: 'Twin/Double', description: 'Convertible beds' },
  { value: 'Triple', label: 'Triple', description: '3 beds' },
  { value: 'Quadruple', label: 'Quadruple', description: '4 beds' },
  { value: 'Family', label: 'Family', description: '2 beds + child bed or sofa bed' },
  { value: 'Suite', label: 'Suite', description: 'Bedroom + Living area' },
  { value: 'Studio', label: 'Studio', description: 'Open layout with kitchen' },
  { value: 'Apartment', label: 'Apartment', description: '1–3 bedrooms + kitchen & living' },
  { value: 'DormitoryRoom', label: 'Dormitory Room', description: 'Shared room with bunk beds' },
  { value: 'BedInDormitory', label: 'Bed in Dormitory', description: 'Single bed in shared dorm' },
  { value: 'Bungalow', label: 'Bungalow', description: 'Ground level house with rooms' },
  { value: 'Chalet', label: 'Chalet', description: 'Cabin-style home, often in hills' },
  { value: 'Villa', label: 'Villa', description: 'Independent large home with multiple rooms' },
  { value: 'HolidayHome', label: 'Holiday Home', description: 'Similar to villa, for vacation rentals' },
  { value: 'MobileHome', label: 'Mobile Home', description: 'Portable home/caravan' },
  { value: 'Tent', label: 'Tent', description: 'Luxury tent or camping tent' },
  { value: '1BHK', label: '1 BHK', description: '1 Bedroom + Hall + Kitchen' },
  { value: '2BHK', label: '2 BHK', description: '2 Bedrooms + Hall + Kitchen' },
  { value: '3BHK', label: '3 BHK', description: '3 Bedrooms + Hall + Kitchen' },
  { value: '4BHK', label: '4 BHK', description: '4 Bedrooms + Hall + Kitchen' },
  { value: '5BHK', label: '5 BHK', description: '5 Bedrooms + Hall + Kitchen' },
  { value: '6BHK', label: '6 BHK', description: '6 Bedrooms + Hall + Kitchen' }
];

const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Twin'];

const Step3 = ({ formData, setFormData, floorTypes, bhkTypes, isEditing }) => {
  const [selectedRoomTypes, setSelectedRoomTypes] = useState(formData.selectedRoomTypes || []);
  const [roomDetails, setRoomDetails] = useState(formData.roomDetails || {});
  const [dropdownValue, setDropdownValue] = useState('');

  // Add room type from dropdown
  const handleAddRoomType = (e) => {
    const value = e.target.value;
    if (value && !selectedRoomTypes.includes(value)) {
      const updated = [...selectedRoomTypes, value];
      setSelectedRoomTypes(updated);
      setFormData(prev => ({ ...prev, selectedRoomTypes: updated }));
      setDropdownValue('');
    }
  };

  // Remove room type
  const handleRemoveRoomType = (type) => {
    const updated = selectedRoomTypes.filter(t => t !== type);
    setSelectedRoomTypes(updated);
    setFormData(prev => ({ ...prev, selectedRoomTypes: updated }));
    // Optionally remove details for this type
    const updatedDetails = { ...roomDetails };
    delete updatedDetails[type];
    setRoomDetails(updatedDetails);
    setFormData(prev => ({ ...prev, roomDetails: updatedDetails }));
  };

  // Handle detail change for a room type
  const handleDetailChange = (type, field, value) => {
    const updatedDetails = {
      ...roomDetails,
      [type]: {
        ...roomDetails[type],
        [field]: value
      }
    };
    setRoomDetails(updatedDetails);
    setFormData(prev => ({ ...prev, roomDetails: updatedDetails }));
  };

  // Filter out already selected room types from dropdown
  const availableRoomTypes = roomTypes.filter(rt => !selectedRoomTypes.includes(rt.value));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
        <FiGrid className="text-blue-600" />
        Room Setup
      </h2>
      {/* Dropdown and chips/tags in a single row */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-lg font-medium mb-2">Select room type</label>
          <select
            value={dropdownValue}
            onChange={handleAddRoomType}
            disabled={!isEditing || availableRoomTypes.length === 0}
            className={`p-2 border rounded-lg min-w-[180px] ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select --</option>
            {availableRoomTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        {/* Selected room types as tags/chips */}
        <div className="flex flex-wrap gap-2 items-center">
          {selectedRoomTypes.map(type => {
            const roomTypeObj = roomTypes.find(rt => rt.value === type);
            return (
              <span key={type} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mr-2">
                {roomTypeObj ? roomTypeObj.label : type}
                {isEditing && (
                  <button
                    type="button"
                    className="ml-2 text-blue-700 hover:text-red-600 focus:outline-none"
                    onClick={() => handleRemoveRoomType(type)}
                  >
                    &times;
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>
      {/* For each selected room type, show details in a single column */}
      {selectedRoomTypes.length > 0 && (
        <div className="flex flex-col gap-4">
          {selectedRoomTypes.map((type) => {
            const roomTypeObj = roomTypes.find(rt => rt.value === type);
            return (
              <div key={type} className="flex flex-row gap-6 border p-4 rounded-xl bg-white items-end">
                <div className="text-base font-semibold min-w-[100px]">{roomTypeObj ? roomTypeObj.label : type}</div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium mb-2">Floor</label>
                  <select
                    value={roomDetails[type]?.floor || ''}
                    onChange={e => handleDetailChange(type, 'floor', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Floor</option>
                    {floorTypes.map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium mb-2">Number of Rooms</label>
                  <input
                    type="number"
                    value={roomDetails[type]?.numberOfRooms || ''}
                    onChange={e => handleDetailChange(type, 'numberOfRooms', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="e.g. 2, 3, 4"
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    value={roomDetails[type]?.capacity || ''}
                    onChange={e => handleDetailChange(type, 'capacity', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Number of guests"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Step3; 
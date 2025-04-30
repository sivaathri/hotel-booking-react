import React from 'react';
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

const Step3 = ({ formData, setFormData, floorTypes, bhkTypes, bedTypes, roomFacilities, isEditing }) => {
  const handleRoomChange = (index, field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  const addNewRoom = () => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, {
        name: '',
        floor: '',
        bhk: '',
        capacity: '',
        bedType: [],
        hasBathroom: false,
        hasBalcony: false,
        balconyView: '',
        facilities: []
      }]
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
        <FiGrid className="text-blue-600" />
        Rooms Setup
      </h2>

      <div className="space-y-6">
        {formData.rooms.map((room, index) => (
          <div
            key={index}
            className="border p-4 rounded-xl space-y-4 transition-shadow shadow-sm hover:shadow-lg bg-white"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Room {index + 1}</h3>
              {index > 0 && isEditing && (
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      rooms: prev.rooms.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Floor</label>
                <select
                  value={room.floor}
                  onChange={(e) => handleRoomChange(index, "floor", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Floor</option>
                  {floorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {!room.floor && (
                  <p className="text-sm text-red-500 mt-1">Please select a floor</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <select
                  value={room.bhk}
                  onChange={(e) => handleRoomChange(index, "bhk", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Rooms</label>
              <input
                type="number"
                value={room.numberOfRooms || ''}
                onChange={(e) => handleRoomChange(index, "numberOfRooms", e.target.value)}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="e.g. 2, 3, 4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Capacity</label>
              <input
                type="number"
                value={room.capacity}
                onChange={(e) => handleRoomChange(index, "capacity", e.target.value)}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Number of guests"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bed Type</label>
              <div className="grid grid-cols-3 gap-4">
                {bedTypes.map((type) => (
                  <button
                    key={type}
                    disabled={!isEditing}
                    className={`p-2 border rounded-xl text-center font-medium transition-colors duration-200 ${
                      room.bedType.includes(type)
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "hover:border-gray-400 text-gray-700"
                    } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => {
                      const newBedTypes = room.bedType.includes(type)
                        ? room.bedType.filter(t => t !== type)
                        : [...room.bedType, type];
                      handleRoomChange(index, "bedType", newBedTypes);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={room.hasBathroom}
                    onChange={(e) =>
                      handleRoomChange(index, "hasBathroom", e.target.checked)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? 'cursor-not-allowed' : ''}
                  />
                  Attached Bathroom
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={room.hasBalcony}
                    onChange={(e) =>
                      handleRoomChange(index, "hasBalcony", e.target.checked)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? 'cursor-not-allowed' : ''}
                  />
                  Balcony/View
                </label>
              </div>
            </div>

            {room.hasBalcony && (
              <div>
                <label className="block text-sm font-medium mb-2">Balcony View</label>
                <input
                  type="text"
                  value={room.balconyView}
                  onChange={(e) =>
                    handleRoomChange(index, "balconyView", e.target.value)
                  }
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="e.g., Sea, Garden, City"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-800">
                Facilities
              </label>
              <div className="flex flex-wrap gap-3">
                {roomFacilities.map((facility) => {
                  const isSelected = room.facilities.includes(facility);
                  return (
                    <button
                      key={facility}
                      onClick={() => {
                        const newFacilities = isSelected
                          ? room.facilities.filter((f) => f !== facility)
                          : [...room.facilities, facility];
                        handleRoomChange(index, "facilities", newFacilities);
                      }}
                      type="button"
                      className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium 
                      ${isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                        }`}
                    >
                      {facility}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {isEditing && (
          <button
            onClick={addNewRoom}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            + Add Another Room
          </button>
        )}
      </div>
    </div>
  );
};

export default Step3; 
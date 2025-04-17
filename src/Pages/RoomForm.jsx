import React, { useState } from 'react';

const RoomForm = () => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    status: 'Available',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Room Submitted:', formData);
    alert('Room submitted (console log)');
    // Later connect to Node.js backend
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium mb-1">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Room Type</label>
          <select
            name="type"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Price (per night)</label>
          <input
            type="number"
            name="price"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Save Room
        </button>
      </form>
    </div>
  );
};

export default RoomForm;

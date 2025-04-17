import React, { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    status: 'Pending',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Booking Submitted:', formData);
    alert('Booking submitted (console log)');
    // Later, submit this to backend
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Room Type</label>
          <select
            name="roomType"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          >
            <option value="">-- Select Room --</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Check-In</label>
            <input
              type="date"
              name="checkIn"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Check-Out</label>
            <input
              type="date"
              name="checkOut"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

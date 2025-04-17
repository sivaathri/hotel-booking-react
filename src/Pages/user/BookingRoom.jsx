import React, { useState } from 'react';

const BookingRoom = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomType: 'Standard',
    checkIn: '',
    checkOut: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // Later: Send formData to backend API
    alert('Booking submitted!');
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleBooking}
        className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Book a Room</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Check-In Date</label>
            <input
              type="date"
              name="checkIn"
              required
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Check-Out Date</label>
            <input
              type="date"
              name="checkOut"
              required
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingRoom;

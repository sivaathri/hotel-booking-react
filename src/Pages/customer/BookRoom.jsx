import React, { useState } from 'react';

const BookRoom = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    checkin: '',
    checkout: '',
    roomType: '',
    guests: 1,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Booking submitted!\n\n' + JSON.stringify(form, null, 2));
    // In backend stage, send this data via POST to the server
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Book a Room</h2>

        <div className="mb-4">
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Check-in Date</label>
          <input
            type="date"
            name="checkin"
            value={form.checkin}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Check-out Date</label>
          <input
            type="date"
            name="checkout"
            value={form.checkout}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Room Type</label>
          <select
            name="roomType"
            value={form.roomType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a room</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-medium">Number of Guests</label>
          <input
            type="number"
            name="guests"
            min="1"
            max="10"
            value={form.guests}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookRoom;

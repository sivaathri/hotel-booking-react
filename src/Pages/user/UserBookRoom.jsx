import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserBookRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later, we'll send this data to the backend
    console.log('Booking Info:', { roomId: id, ...form });

    alert('Booking request submitted!');
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Book This Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
        <div>
          <label className="block font-medium mb-1">Check-In Date</label>
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Check-Out Date</label>
          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Number of Guests</label>
          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            min="1"
            max="10"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default UserBookRoom;

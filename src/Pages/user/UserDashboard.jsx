import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear auth tokens/session here
    alert('Logged out!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Welcome, John Doe</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Your Bookings</h2>
            <p className="text-gray-600">You have 3 upcoming bookings.</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Bookings
            </button>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Make a New Booking</h2>
            <p className="text-gray-600">Browse available rooms and book now.</p>
            <button
              onClick={() => navigate('/available-rooms')}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Book a Room
            </button>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

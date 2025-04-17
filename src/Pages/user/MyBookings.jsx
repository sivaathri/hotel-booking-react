import React from 'react';

const MyBookings = () => {
  // Dummy data (replace with real data from backend later)
  const bookings = [
    {
      id: 1,
      room: 'Deluxe Suite',
      checkIn: '2025-04-15',
      checkOut: '2025-04-17',
      status: 'Confirmed',
    },
    {
      id: 2,
      room: 'Standard Room',
      checkIn: '2025-05-01',
      checkOut: '2025-05-03',
      status: 'Pending',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">You haven't made any bookings yet.</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 border-b text-left">Room</th>
                <th className="py-2 px-4 border-b text-left">Check-In</th>
                <th className="py-2 px-4 border-b text-left">Check-Out</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{booking.room}</td>
                  <td className="py-2 px-4 border-b">{booking.checkIn}</td>
                  <td className="py-2 px-4 border-b">{booking.checkOut}</td>
                  <td className="py-2 px-4 border-b">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

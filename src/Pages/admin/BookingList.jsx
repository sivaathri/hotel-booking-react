import React, { useState, useEffect } from 'react';

const dummyBookings = [
  {
    id: 1,
    name: 'John Doe',
    room: 'Deluxe',
    checkin: '2025-04-20',
    checkout: '2025-04-25',
    status: 'Confirmed',
  },
  {
    id: 2,
    name: 'Jane Smith',
    room: 'Suite',
    checkin: '2025-04-22',
    checkout: '2025-04-26',
    status: 'Pending',
  },
];

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // In future: fetch from backend
    setBookings(dummyBookings);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">All Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Booking ID</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Room</th>
              <th className="py-3 px-4 border">Check-In</th>
              <th className="py-3 px-4 border">Check-Out</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="text-center">
                <td className="py-2 px-4 border">{booking.id}</td>
                <td className="py-2 px-4 border">{booking.name}</td>
                <td className="py-2 px-4 border">{booking.room}</td>
                <td className="py-2 px-4 border">{booking.checkin}</td>
                <td className="py-2 px-4 border">{booking.checkout}</td>
                <td className="py-2 px-4 border">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsList;

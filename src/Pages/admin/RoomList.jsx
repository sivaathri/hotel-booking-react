import React, { useState, useEffect } from 'react';

const dummyRooms = [
  {
    id: 101,
    type: 'Deluxe',
    price: 120,
    status: 'Available',
  },
  {
    id: 102,
    type: 'Suite',
    price: 200,
    status: 'Occupied',
  },
];

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Will fetch from backend later
    setRooms(dummyRooms);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Rooms Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-3 px-4 border">Room ID</th>
              <th className="py-3 px-4 border">Room Type</th>
              <th className="py-3 px-4 border">Price ($)</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id} className="text-center">
                <td className="py-2 px-4 border">{room.id}</td>
                <td className="py-2 px-4 border">{room.type}</td>
                <td className="py-2 px-4 border">{room.price}</td>
                <td className="py-2 px-4 border">{room.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomsList;

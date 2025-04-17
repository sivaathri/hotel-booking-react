import React from 'react';
import { Link } from 'react-router-dom';

const UserRoomList = () => {
  const rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      image: 'https://source.unsplash.com/400x300/?hotel,room',
      price: 120,
      type: 'Deluxe',
      capacity: 2,
    },
    {
      id: 2,
      name: 'Suite Room',
      image: 'https://source.unsplash.com/400x300/?luxury,hotel',
      price: 200,
      type: 'Suite',
      capacity: 4,
    },
    {
      id: 3,
      name: 'Standard Room',
      image: 'https://source.unsplash.com/400x300/?room,bed',
      price: 90,
      type: 'Standard',
      capacity: 2,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Available Rooms</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <p className="text-gray-600">Type: {room.type}</p>
              <p className="text-gray-600">Capacity: {room.capacity} Persons</p>
              <p className="text-blue-700 font-bold mt-2">${room.price} / night</p>
              <Link
                to={`/rooms/${room.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRoomList;

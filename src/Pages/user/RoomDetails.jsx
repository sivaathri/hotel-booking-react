import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data (replace with backend data later)
  const room = {
    id,
    name: 'Deluxe Room',
    image: 'https://source.unsplash.com/600x400/?hotel,room',
    price: 120,
    type: 'Deluxe',
    capacity: 2,
    description:
      'Enjoy a relaxing stay in our deluxe rooms, equipped with modern amenities, comfortable bedding, and a scenic view.',
    facilities: ['Free Wi-Fi', 'Air Conditioning', 'Breakfast Included', 'Mini Fridge'],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img src={room.image} alt={room.name} className="w-full rounded-xl mb-6" />
      <h2 className="text-3xl font-bold text-blue-700 mb-2">{room.name}</h2>
      <p className="text-gray-600 mb-2">Type: {room.type} | Capacity: {room.capacity} persons</p>
      <p className="text-blue-700 font-bold mb-4">${room.price} / night</p>
      <p className="mb-4">{room.description}</p>

      <h4 className="text-lg font-semibold mb-2">Facilities:</h4>
      <ul className="list-disc list-inside mb-6 text-gray-700">
        {room.facilities.map((facility, index) => (
          <li key={index}>{facility}</li>
        ))}
      </ul>

      <button
        onClick={() => navigate(`/book/${room.id}`)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Book Now
      </button>
    </div>
  );
};

export default RoomDetails;

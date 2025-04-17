import React from 'react';

const UserProfile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+61 400 000 000',
    address: '123 Sydney Street, NSW, Australia',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">User Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="font-semibold block">Full Name:</label>
            <p>{user.name}</p>
          </div>
          <div>
            <label className="font-semibold block">Email:</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label className="font-semibold block">Phone:</label>
            <p>{user.phone}</p>
          </div>
          <div>
            <label className="font-semibold block">Address:</label>
            <p>{user.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

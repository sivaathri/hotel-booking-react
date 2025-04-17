import React, { useState, useEffect } from 'react';

const dummyStaff = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Manager',
    contact: 'alice@example.com',
  },
  {
    id: 2,
    name: 'Bob Williams',
    role: 'Receptionist',
    contact: 'bob@example.com',
  },
];

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setStaff(dummyStaff);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Hotel Staff</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-3 px-4 border">Staff ID</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">Contact</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.id} className="text-center">
                <td className="py-2 px-4 border">{member.id}</td>
                <td className="py-2 px-4 border">{member.name}</td>
                <td className="py-2 px-4 border">{member.role}</td>
                <td className="py-2 px-4 border">{member.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;

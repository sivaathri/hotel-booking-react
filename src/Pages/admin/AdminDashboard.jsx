import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Bookings', path: '/admin/bookings' },
    { title: 'Customers', path: '/admin/customers' },
    { title: 'Rooms', path: '/admin/rooms' },
    { title: 'Invoices', path: '/admin/invoices' },
    { title: 'Logout', action: () => navigate('/admin/login') },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => item.path ? navigate(item.path) : item.action()}
              className="cursor-pointer p-6 bg-white rounded shadow hover:shadow-lg text-center transition duration-300"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

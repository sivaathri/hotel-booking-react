import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBed, FaBookmark, FaCheck, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Room Types',
      count: '3',
      icon: <FaBed className="w-5 h-5" />,
      color: 'bg-sky-100 text-sky-600',
      link: 'View Details'
    },
    {
      title: 'New Bookings',
      count: '11',
      icon: <FaBookmark className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600',
      link: 'View Details'
    },
    {
      title: 'Confirmed Bookings',
      count: '0',
      icon: <FaCheck className="w-5 h-5" />,
      color: 'bg-amber-100 text-amber-600',
      link: 'View Details'
    },
    {
      title: 'Special Offers',
      count: '0',
      icon: <FaClock className="w-5 h-5" />,
      color: 'bg-red-100 text-red-600',
      link: 'Special Offers'
    }
  ];

  const bookings = [
    {
      code: 'X8B0R267',
      room: 'Beach Double Room',
      checkIn: '06/28/2018',
      checkOut: '06/30/2018',
      total: '$300.99',
      firstName: 'John',
      lastName: 'Smith',
      email: 'test@test.com',
      phone: '212-324-5422',
      remarks: ''
    },
    // Add more booking data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8 px-4">
            <button className="px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Dashboard</button>
            <button className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Contact Messages</button>
            <button className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Log in Report</button>
            <button className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Change Password</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-3xl font-semibold">{stat.count}</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-600">{stat.title}</h3>
                <button className="text-xs text-blue-600 hover:underline">{stat.link}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Latest Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{booking.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

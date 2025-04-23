import React, { useEffect, useState } from 'react';
import { FaBed, FaBookmark, FaCheck, FaClock, FaUserFriends, FaMoneyBillWave } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CustomersList from './CustomersList';
import { motion, AnimatePresence } from "framer-motion";
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Sample data for charts
  const roomData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Hosted Rooms',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const paymentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Payments ($)',
        data: [10000, 20000, 15000, 25000, 22000, 30000, 28000,40000,50000],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const stats = [
    {
      title: 'Users',
      count: '3',
      icon: <FaUserFriends className="w-8 h-8" />,
      color: 'bg-purple-100 text-purple-600',
      link: 'View Details',
      trend: '+12%',
      trendColor: 'text-green-500',
    },
    {
      title: 'Host Rooms',
      count: '3',
      icon: <FaBed className="w-8 h-8" />,
      color: 'bg-sky-100 text-sky-600',
      link: 'View Details',
      trend: '+5%',
      trendColor: 'text-green-500',
    },
    {
      title: 'Overall Bookings',
      count: '11',
      icon: <FaBookmark className="w-8 h-8" />,
      color: 'bg-green-100 text-green-600',
      link: 'View Details',
      trend: '+8%',
      trendColor: 'text-green-500',
    },
    {
      title: 'Confirmed Bookings',
      count: '0',
      icon: <FaCheck className="w-8 h-8" />,
      color: 'bg-amber-100 text-amber-600',
      link: 'View Details',
      trend: '0%',
      trendColor: 'text-gray-500',
    },
    {
      title: 'Cancelled Bookings',
      count: '0',
      icon: <FaClock className="w-8 h-8" />,
      color: 'bg-red-100 text-red-600',
      link: 'View Details',
      trend: '0%',
      trendColor: 'text-gray-500',
    },
    {
      title: 'Payments',
      count: '0',
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      color: 'bg-indigo-100 text-indigo-600',
      link: 'View Details',
      trend: '0%',
      trendColor: 'text-gray-500',
    },
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
      remarks: '',
      status: 'Confirmed',
      statusColor: 'bg-green-100 text-green-800',
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['Dashboard', 'Contact Messages', 'Log in Report', 'Change Password'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-800">{stat.count}</span>
                  <p className={`text-sm ${stat.trendColor}`}>{stat.trend}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <button
                  onClick={stat.title === 'Users' ? () => setShowUserModal(true) : null}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {stat.link}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hosted Rooms Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hosted Rooms Trend</h3>
            <div className="h-80">
              <Line data={roomData} options={chartOptions} />
            </div>
          </div>

          {/* Payments Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payments Overview</h3>
            <div className="h-80">
              <Bar data={paymentData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Latest Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Latest Bookings</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View All Bookings
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  {[
                    'Code',
                    'Room',
                    'Check in',
                    'Check out',
                    'Total',
                    'First Name',
                    'Last Name',
                    'Email',
                    'Phone',
                    'Status',
                    'Remarks',
                  ].map((heading, idx) => (
                    <th key={idx} className="px-6 py-3 whitespace-nowrap">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{booking.code}</td>
                    <td className="px-6 py-4 text-blue-600">{booking.room}</td>
                    <td className="px-6 py-4">{booking.checkIn}</td>
                    <td className="px-6 py-4">{booking.checkOut}</td>
                    <td className="px-6 py-4 font-medium">{booking.total}</td>
                    <td className="px-6 py-4">{booking.firstName}</td>
                    <td className="px-6 py-4">{booking.lastName}</td>
                    <td className="px-6 py-4">{booking.email}</td>
                    <td className="px-6 py-4">{booking.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.statusColor}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{booking.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={() => setShowUserModal(false)}
  >
    <AnimatePresence>
      <motion.div
        className="bg-white max-w-5xl w-full rounded-xl shadow-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button
          onClick={() => setShowUserModal(false)}
          className="absolute top-4 right-6 text-gray-600 hover:text-red-600 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Details</h2>
        <CustomersList />
      </motion.div>
    </AnimatePresence>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;

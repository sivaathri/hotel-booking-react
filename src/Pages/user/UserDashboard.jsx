import React, { useState, useEffect } from 'react';
import { User, LogOut, Monitor, Users, ChevronDown, Edit, Plus, Check, X, Mail, Phone, Calendar, MapPin, Lock, BookOpen, Search, Filter, ChevronRight, Star, MapPin as MapPinIcon, Clock, CreditCard, Smartphone, Laptop, Tablet, Globe, Trash2, AlertTriangle, UserPlus, UserMinus, UserCheck, Heart, Shield, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Header from '../.././Pages/user/Header';
import { API_URL } from '../../config/api.config';
const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [hoveredBooking, setHoveredBooking] = useState(null);

  const bookings = {
    upcoming: [
      {
        id: 1,
        hotelName: "Grand Hyatt",
        location: "Mumbai, India",
        checkIn: "15 Mar 2024",
        checkOut: "18 Mar 2024",
        status: "confirmed",
        price: "₹12,500",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      },
      {
        id: 2,
        hotelName: "Taj Palace",
        location: "Delhi, India",
        checkIn: "22 Mar 2024",
        checkOut: "25 Mar 2024",
        status: "pending",
        price: "₹15,000",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
      }
    ],
    completed: [
      {
        id: 3,
        hotelName: "The Oberoi",
        location: "Bangalore, India",
        checkIn: "05 Jan 2024",
        checkOut: "08 Jan 2024",
        status: "completed",
        price: "₹18,000",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
        reviewStatus: "reviewed"
      },
      {
        id: 4,
        hotelName: "ITC Grand Chola",
        location: "Chennai, India",
        checkIn: "12 Feb 2024",
        checkOut: "15 Feb 2024",
        status: "completed",
        price: "₹16,500",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        reviewStatus: "pending"
      }
    ],
    cancelled: [
      {
        id: 5,
        hotelName: "The Leela Palace",
        location: "Udaipur, India",
        checkIn: "20 Jan 2024",
        checkOut: "23 Jan 2024",
        status: "cancelled",
        price: "₹20,000",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        cancellationDate: "18 Jan 2024",
        refundStatus: "processed"
      },
      {
        id: 6,
        hotelName: "JW Marriott",
        location: "Pune, India",
        checkIn: "28 Feb 2024",
        checkOut: "02 Mar 2024",
        status: "cancelled",
        price: "₹14,000",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        cancellationDate: "25 Feb 2024",
        refundStatus: "pending"
      }
    ]
  };

  const renderBookingCard = (booking) => {
    const isCompleted = booking.status === 'completed';
    const isCancelled = booking.status === 'cancelled';

    return (
      <div
        key={booking.id}
        className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${hoveredBooking === booking.id ? 'ring-2 ring-blue-500' : ''
          } ${isCancelled ? 'opacity-75' : ''}`}
        onMouseEnter={() => setHoveredBooking(booking.id)}
        onMouseLeave={() => setHoveredBooking(null)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Hotel Image */}
          <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden group">
            <img
              src={booking.image}
              alt={booking.hotelName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isCancelled && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <span className="text-white text-xl font-bold rotate-[-30deg]">CANCELLED</span>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="transform transition-transform duration-300 hover:translate-x-1">
                <h3 className="text-xl font-bold text-gray-800">{booking.hotelName}</h3>
                <div className="flex items-center mt-1 text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span>{booking.location}</span>
                </div>
              </div>
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-md">
                <Star className="w-4 h-4 mr-1 fill-current animate-pulse" />
                <span>{booking.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center group">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 transition-colors duration-300 group-hover:text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium group-hover:text-blue-600 transition-colors duration-300">{booking.checkIn}</p>
                </div>
              </div>
              <div className="flex items-center group">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 transition-colors duration-300 group-hover:text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium group-hover:text-blue-600 transition-colors duration-300">{booking.checkOut}</p>
                </div>
              </div>
              <div className="flex items-center group">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2 transition-colors duration-300 group-hover:text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium group-hover:text-blue-600 transition-colors duration-300">{booking.price}</p>
                </div>
              </div>
            </div>

            {/* Additional Info based on status */}
            {isCompleted && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Stay Completed</span>
                  </div>
                  {booking.reviewStatus === 'pending' ? (
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Write a Review
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm font-medium">Review Submitted</span>
                  )}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-red-600">Cancelled on {booking.cancellationDate}</span>
                  </div>
                  <span className={`text-sm font-medium ${booking.refundStatus === 'processed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                    {booking.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${booking.status === 'confirmed' ? 'bg-green-500' :
                  booking.status === 'pending' ? 'bg-yellow-500' :
                    booking.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                <span className="text-sm font-medium">
                  {booking.status === 'confirmed' ? 'Confirmed' :
                    booking.status === 'pending' ? 'Pending' :
                      booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-700 group transition-all duration-300">
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">View Details</span>
                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 transform hover:scale-105 transition-transform duration-300">My Bookings</h2>
        <div className="flex gap-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 transition-colors duration-300 group-hover:text-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:scale-105">
            <Filter className="w-5 h-5 text-gray-600 transition-colors duration-300 group-hover:text-blue-500" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium relative transition-all duration-300 ${activeTab === tab
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings[activeTab].map(renderBookingCard)}
      </div>
    </div>
  );
};

const LoggedInDevices = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "iPhone 13 Pro",
      type: "mobile",
      lastActive: "Active now",
      location: "Mumbai, India",
      ipAddress: "192.168.1.1",
      isCurrent: true,
      os: "iOS 15.4",
      browser: "Safari"
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "laptop",
      lastActive: "2 hours ago",
      location: "Delhi, India",
      ipAddress: "192.168.1.2",
      isCurrent: false,
      os: "macOS Monterey",
      browser: "Chrome"
    },
    {
      id: 3,
      name: "iPad Pro",
      type: "tablet",
      lastActive: "1 day ago",
      location: "Bangalore, India",
      ipAddress: "192.168.1.3",
      isCurrent: false,
      os: "iPadOS 15.4",
      browser: "Safari"
    }
  ]);

  const handleLogoutDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-6 h-6 text-blue-500" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-purple-500" />;
      case 'tablet':
        return <Tablet className="w-6 h-6 text-green-500" />;
      default:
        return <Monitor className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Logged In Devices</h2>
          <p className="text-gray-600 mt-1">Manage your active sessions and devices</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span>Logout All Devices</span>
        </button>
      </div>

      {/* Security Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
        <div>
          <h3 className="font-medium text-yellow-800">Security Notice</h3>
          <p className="text-yellow-600 text-sm mt-1">
            For your security, please log out of devices you no longer use. If you notice any unfamiliar devices, log them out immediately.
          </p>
        </div>
      </div>

      {/* Devices List */}
      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 ${device.isCurrent ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="bg-gray-50 p-3 rounded-xl mr-4">
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{device.name}</h3>
                    {device.isCurrent && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        Current Device
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>{device.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{device.lastActive}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {device.os}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {device.browser}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      IP: {device.ipAddress}
                    </span>
                  </div>
                </div>
              </div>
              {!device.isCurrent && (
                <button
                  onClick={() => handleLogoutDevice(device.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Session Information */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Active Sessions</h4>
            <p className="text-2xl font-bold text-gray-800">{devices.length}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Last Password Change</h4>
            <p className="text-gray-800">15 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginDetails = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const checkPasswordRequirements = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const validatePassword = (password) => {
    const errors = [];
    const requirements = checkPasswordRequirements(password);

    if (!requirements.length) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!requirements.uppercase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!requirements.number) {
      errors.push('Password must contain at least one number');
    }
    if (!requirements.special) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('\n'));
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/auth/update-password`,
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Login Details</h2>
          <p className="text-gray-600 mt-1">Manage your login credentials</p>
        </div>
      </div>

      {/* Security Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
        <div>
          <h3 className="font-medium text-yellow-800">Security Notice</h3>
          <p className="text-yellow-600 text-sm mt-1">
            For your security, please use a strong password and never share it with anyone.
          </p>
        </div>
      </div>

      {/* Password Update Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setShowPasswordRequirements(true);
                  }}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setTimeout(() => setShowPasswordRequirements(false), 200)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements Dropdown */}
              {showPasswordRequirements && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <div className="space-y-2">
                    <div className={`flex items-center ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                      {newPassword.length >= 8 ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm">At least 8 characters long</span>
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[A-Z]/.test(newPassword) ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm">Contains at least one uppercase letter</span>
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[0-9]/.test(newPassword) ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm">Contains at least one number</span>
                    </div>
                    <div className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm">Contains at least one special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl space-y-2">
              {error.split('\n').map((err, index) => (
                <div key={index} className="flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
};

export default function UserDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('Profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    email: '',
    mobile: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    address: '',
    pincode: '',
    state: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          // Redirect to login if no token
          window.location.href = '/';
          return;
        }

        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const userData = response.data;
          console.log('User ID:', userData.id);
          setProfileData({
            id: userData._id || userData.id,
            name: userData.username || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            date_of_birth: userData.date_of_birth || '',
            gender: userData.gender || '',
            marital_status: userData.marital_status || '',
            address: userData.address || '',
            pincode: userData.pincode || '',
            state: userData.state || ''
          });
        }

      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddClick = (field) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleUpdate = async (value) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const fieldName = currentField.toLowerCase().replace(' ', '');

      if (!profileData.id) {
        throw new Error('User ID not found');
      }

      const response = await axios.put(
        `${API_URL}/auth/${profileData.id}`,
        {
          [fieldName]: value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          [fieldName]: value
        }));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      alert('Failed to update profile: ' + (error.message || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };

  const Modal = ({ isOpen, onClose, onUpdate, field }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 w-96 shadow-2xl transform transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Add {field}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          {field.toLowerCase() === 'date_of_birth' ? (
            <input
              type="date"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder={`Enter your ${field.toLowerCase()}`}
            />
          )}
          <div className="flex mt-2 justify-end">
            <button
              onClick={() => onUpdate(inputValue)}
              className="text-black font-semibold px-6 py-2 transition-all duration-300"
              style={{
                borderRadius: '8px',
                backgroundColor: '#ffc107',
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = '#e0ac00')}
              onMouseLeave={e => (e.target.style.backgroundColor = '#ffc107')}
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="max-w-7xl mx-auto pt-24 p-6">
        {/* Header Navigation */}
        <div className="flex items-center mb-8">
          <div className="relative group">
            <button className="flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <span className="font-medium text-gray-700"> My Profile</span>
              <ChevronDown className="ml-2 w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-6 flex flex-col items-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 w-48 h-48 rounded-full mb-6 flex items-center justify-center relative overflow-hidden group">
                <span className="text-white text-7xl font-bold transform group-hover:scale-110 transition-transform duration-500">
                  {profileData.name.charAt(0).toUpperCase()}
                </span>
                {/* <button className="absolute bottom-4 right-5 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                  <Edit className="w-4 h-5 text-white" />
                </button> */}
              </div>

              <h2 className="text-3xl font-bold mb-2 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {profileData.name}
              </h2>
              <p className="text-gray-500 text-sm uppercase tracking-wider">PERSONAL PROFILE</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl">
              <div
                className={`p-6 flex items-center cursor-pointer transition-all duration-300 ${selectedMenu === 'Profile'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedMenu('Profile')}
              >
                <User className={`mr-4 w-6 h-6 ${selectedMenu === 'Profile' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Profile' ? 'text-white font-medium' : 'text-gray-700'}`}>Profile</span>
              </div>
              <div
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${selectedMenu === 'My Bookings'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedMenu('My Bookings')}
              >
                <BookOpen className={`mr-4 w-6 h-6 ${selectedMenu === 'My Bookings' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'My Bookings' ? 'text-white font-medium' : 'text-gray-700'}`}>My Bookings</span>
              </div>
              <div
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${selectedMenu === 'Login Details'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedMenu('Login Details')}
              >
                <Lock className={`mr-4 w-6 h-6 ${selectedMenu === 'Login Details' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Login Details' ? 'text-white font-medium' : 'text-gray-700'}`}>Login Details</span>
              </div>

              <div
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${selectedMenu === 'Logged In Devices'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'hover:bg-gray-50'
                  }`}
                onClick={() => setSelectedMenu('Logged In Devices')}
              >
                <Monitor className={`mr-4 w-6 h-6 ${selectedMenu === 'Logged In Devices' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Logged In Devices' ? 'text-white font-medium' : 'text-gray-700'}`}>Logged In Devices</span>
              </div>
              <div
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${selectedMenu === 'Logout'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'hover:bg-gray-50'
                  }`}
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className={`mr-4 w-6 h-6 ${selectedMenu === 'Logout' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Logout' ? 'text-white font-medium' : 'text-gray-700'}`}>Logout</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl shadow-lg">
                {error}
              </div>
            ) : selectedMenu === 'My Bookings' ? (
              <MyBookings />
            ) : selectedMenu === 'Logged In Devices' ? (
              <LoggedInDevices />
            ) : selectedMenu === 'Login Details' ? (
              <LoginDetails />
            ) : (
              <>
                {/* AI Assistant */}
                {/* <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mr-6 animate-pulse">
                        <div className="bg-white w-8 h-3 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="text-white text-2xl font-semibold mb-2">Need help planning your next adventure?</h3>
                        <p className="text-white/80">Myra will help you out with any query related to your Travel</p>
                      </div>
                    </div>
                    <button className="bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                      Chat with Myra
                    </button>
                  </div>
                </div> */}

                {/* Profile Completion */}
                <div className="bg-white/90  w-200 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Complete your Profile</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    {(() => {
                      const totalFields = 7; // name, email, mobile, date_of_birth, gender, marital_status, address
                      const completedFields = Object.values(profileData).filter(value => value !== '').length;
                      const completionPercentage = (completedFields / totalFields) * 100;

                      let colorClass = '';
                      if (completionPercentage === 100) {
                        colorClass = 'from-green-400 to-green-600';
                      } else if (completionPercentage >= 70) {
                        colorClass = 'from-blue-400 to-blue-600';
                      } else if (completionPercentage >= 40) {
                        colorClass = 'from-yellow-400 to-yellow-600';
                      } else {
                        colorClass = 'from-red-400 to-red-600';
                      }

                      return (
                        <div className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-500`}
                          style={{ width: '100%' }}></div>
                      );
                    })()}
                  </div>
                  <p className="text-gray-600 mb-6">Get the best out of MakeMyTrip by adding the remaining details!</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                      <button className="flex items-center bg-blue-500 text-white rounded-full p-2 mr-3 hover:bg-blue-600 transition-colors duration-300">
                        <Mail className="w-5 h-5" />
                      </button>
                      <span className="ml-2 text-gray-700">{profileData.email}</span>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center">
                      <button className="flex items-center bg-green-500 text-white rounded-full p-2 mr-3">
                        <Phone className="w-5 h-5" />
                      </button>
                      <span className="ml-2 text-green-500">{profileData.mobile}</span>
                    </div>


                  </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Profile Details
                    </h2>
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`flex items-center  rounded-xl px-6 py-2 transition-all duration-300 transform hover:-translate-y-1 ${isEditMode
                          ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                          : 'border-blue-500 hover:bg-yellow-50'
                        }`}
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      {isEditMode ? 'SAVE' : 'EDIT'}
                    </button>
                  </div>
                  <p className="text-gray-600 mb-8">Basic info, for a faster booking experience</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Info Cards */}
                    {[
                      { label: 'NAME', value: profileData.name, key: 'name', icon: null },
                      { label: 'date_of_birth', value: profileData.date_of_birth, key: 'date_of_birth', icon: <Calendar className="w-5 h-5 mr-2" /> },
                      { label: 'GENDER', value: profileData.gender, key: 'gender', icon: <Plus className="w-5 h-5 mr-2" /> },
                      { label: 'MARITAL STATUS', value: profileData.marital_status, key: 'marital_status', icon: <Plus className="w-5 h-5 mr-2" /> },
                      { label: 'YOUR ADDRESS', value: profileData.address, key: 'address', icon: <MapPin className="w-5 h-5 mr-2" /> },
                      { label: 'PINCODE', value: profileData.pincode, key: 'pincode', icon: <Plus className="w-5 h-5 mr-2" /> },
                      { label: 'STATE', value: profileData.state, key: 'state', icon: <Plus className="w-5 h-5 mr-2" /> },
                    ].map(({ label, value, key, icon }) => (
                      <div key={key} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                        <p className="text-gray-500 text-sm mb-2">{label}</p>
                        {isEditMode ? (
                          key === 'gender' ? (
                            <select
                              value={value || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          ) : key === 'marital_status' ? (
                            <select
                              value={value || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                              <option value="">Select Marital Status</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Divorced">Divorced</option>
                              <option value="Widowed">Widowed</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          ) : (
                            <input
                              type={key === 'date_of_birth' ? 'date' : 'text'}
                              value={value || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder={`Enter your ${label.toLowerCase()}`}
                            />
                          )
                        ) : value ? (
                          <p className="font-medium text-gray-800">{value}</p>
                        ) : (
                          <button
                            onClick={() => handleAddClick(key)}
                            className="flex items-center hover:text-black-600 transition-colors"
                            style={{ color: '#ffc107' }}
                          >
                            {icon} Add {label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleUpdate}
                    field={currentField}
                  />
                </div>

              </>
            )}
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 w-96 shadow-2xl transform transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Confirm Logout</h3>
                <button onClick={() => setShowLogoutConfirm(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
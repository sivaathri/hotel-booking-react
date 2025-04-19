import React, { useState } from 'react';
import { User, LogOut, Monitor, Users, ChevronDown, Edit, Plus, Check, X, Mail, Phone, Calendar, MapPin, Lock, BookOpen, Search, Filter, ChevronRight, Star, MapPin as MapPinIcon, Clock, CreditCard, Smartphone, Laptop, Tablet, Globe, Trash2, AlertTriangle, UserPlus, UserMinus, UserCheck, Heart, Shield } from 'lucide-react';

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
        className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
          hoveredBooking === booking.id ? 'ring-2 ring-blue-500' : ''
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
                  <span className={`text-sm font-medium ${
                    booking.refundStatus === 'processed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                  booking.status === 'confirmed' ? 'bg-green-500' : 
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
            className={`px-6 py-3 font-medium relative transition-all duration-300 ${
              activeTab === tab
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
            className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 ${
              device.isCurrent ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
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

const CoTravellers = () => {
  const [travellers, setTravellers] = useState([
    {
      id: 1,
      name: "John Doe",
      relationship: "Spouse",
      age: 32,
      gender: "Male",
      isVerified: true,
      lastTraveled: "2 months ago",
      upcomingTrips: 2,
      favoriteDestinations: ["Goa", "Kerala"]
    },
    {
      id: 2,
      name: "Sarah Smith",
      relationship: "Friend",
      age: 28,
      gender: "Female",
      isVerified: true,
      lastTraveled: "1 month ago",
      upcomingTrips: 1,
      favoriteDestinations: ["Mumbai", "Delhi"]
    },
    {
      id: 3,
      name: "Michael Johnson",
      relationship: "Family",
      age: 45,
      gender: "Male",
      isVerified: false,
      lastTraveled: "Never",
      upcomingTrips: 0,
      favoriteDestinations: []
    }
  ]);

  const handleRemoveTraveller = (travellerId) => {
    setTravellers(travellers.filter(traveller => traveller.id !== travellerId));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Co-Travellers</h2>
          <p className="text-gray-600 mt-1">Manage your travel companions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300">
          <UserPlus className="w-5 h-5" />
          <span>Add New Traveller</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Travellers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{travellers.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verified Travellers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {travellers.filter(t => t.isVerified).length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Trips</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {travellers.reduce((acc, t) => acc + t.upcomingTrips, 0)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Travellers List */}
      <div className="space-y-4">
        {travellers.map((traveller) => (
          <div 
            key={traveller.id}
            className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {traveller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{traveller.name}</h3>
                    {traveller.isVerified && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">{traveller.relationship}</span>
                      <span className="mx-2">•</span>
                      <span>{traveller.age} years</span>
                      <span className="mx-2">•</span>
                      <span>{traveller.gender}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Last traveled: {traveller.lastTraveled}</span>
                    </div>
                  </div>
                  {traveller.favoriteDestinations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Favorite Destinations</p>
                      <div className="flex flex-wrap gap-2">
                        {traveller.favoriteDestinations.map((dest, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center"
                          >
                            <Heart className="w-3 h-3 mr-1 text-red-500" />
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => handleRemoveTraveller(traveller.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-300"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>Remove</span>
                </button>
                {!traveller.isVerified && (
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-300">
                    <UserCheck className="w-4 h-4" />
                    <span>Verify</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Traveller Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Traveller</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              <option>Select relationship</option>
              <option>Spouse</option>
              <option>Family</option>
              <option>Friend</option>
              <option>Colleague</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input 
              type="number" 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              <option>Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
            Add Traveller
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('Profile');
  const [profileData, setProfileData] = useState({
    name: 'athri',
    birthday: '',
    gender: '',
    maritalStatus: '',
    address: '',
    pincode: '',
    state: ''
  });

  const handleAddClick = (field) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleUpdate = (value) => {
    setProfileData(prev => ({
      ...prev,
      [currentField.toLowerCase().replace(' ', '')]: value
    }));
    setIsModalOpen(false);
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
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder={`Enter your ${field.toLowerCase()}`}
          />
          <div className="flex justify-end">
            <button
              onClick={() => onUpdate(inputValue)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center mb-8">
          <div className="relative">
            <button className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all">
              <span className="font-medium text-gray-700">My Account</span>
              <ChevronDown className="ml-2 w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center ml-4">
            <span className="text-gray-400 mx-2">&gt;</span>
            <span className="text-gray-700 font-medium">My Profile</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-6 flex flex-col items-center shadow-lg">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-48 h-48 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group">
                <span className="text-white text-7xl font-bold transform group-hover:scale-110 transition-transform">A</span>
                <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all">
                  <Edit className="w-5 h-5 text-white" />
                </button>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">athri</h2>
              <p className="text-gray-500 text-sm uppercase tracking-wider">PERSONAL PROFILE</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
              <div 
                className={`p-6 flex items-center cursor-pointer transition-colors ${
                  selectedMenu === 'Profile' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMenu('Profile')}
              >
                <User className={`mr-4 w-6 h-6 ${selectedMenu === 'Profile' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Profile' ? 'text-white font-medium' : 'text-gray-700'}`}>Profile</span>
              </div>
              <div 
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${
                  selectedMenu === 'My Bookings' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMenu('My Bookings')}
              >
                <BookOpen className={`mr-4 w-6 h-6 ${selectedMenu === 'My Bookings' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'My Bookings' ? 'text-white font-medium' : 'text-gray-700'}`}>My Bookings</span>
              </div>
              <div 
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${
                  selectedMenu === 'Login Details' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMenu('Login Details')}
              >
                <Lock className={`mr-4 w-6 h-6 ${selectedMenu === 'Login Details' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Login Details' ? 'text-white font-medium' : 'text-gray-700'}`}>Login Details</span>
              </div>
              <div 
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${
                  selectedMenu === 'Co-Travellers' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMenu('Co-Travellers')}
              >
                <Users className={`mr-4 w-6 h-6 ${selectedMenu === 'Co-Travellers' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Co-Travellers' ? 'text-white font-medium' : 'text-gray-700'}`}>Co-Travellers</span>
              </div>
              <div 
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${
                  selectedMenu === 'Logged In Devices' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMenu('Logged In Devices')}
              >
                <Monitor className={`mr-4 w-6 h-6 ${selectedMenu === 'Logged In Devices' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Logged In Devices' ? 'text-white font-medium' : 'text-gray-700'}`}>Logged In Devices</span>
              </div>
              <div 
                className={`border-t border-gray-100 p-6 flex items-center cursor-pointer transition-colors ${
                  selectedMenu === 'Logout' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMenu('Logout')}
              >
                <LogOut className={`mr-4 w-6 h-6 ${selectedMenu === 'Logout' ? 'text-white' : 'text-gray-500'}`} />
                <span className={`${selectedMenu === 'Logout' ? 'text-white font-medium' : 'text-gray-700'}`}>Logout</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-3/4">
            {selectedMenu === 'My Bookings' ? (
              <MyBookings />
            ) : selectedMenu === 'Logged In Devices' ? (
              <LoggedInDevices />
            ) : selectedMenu === 'Co-Travellers' ? (
              <CoTravellers />
            ) : (
              <>
                {/* AI Assistant */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 mb-8 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mr-6">
                        <div className="bg-purple-600 w-8 h-3 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="text-white text-2xl font-semibold mb-2">Need help planning your next adventure?</h3>
                        <p className="text-white/80">Myra will help you out with any query related to your Travel</p>
                      </div>
                    </div>
                    <button className="bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl hover:bg-white/30 transition-all">
                      Chat with Myra
                    </button>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Complete your Profile</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full w-2/5"></div>
                  </div>
                  <p className="text-gray-600 mb-6">Get the best out of MakeMyTrip by adding the remaining details!</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center hover:bg-gray-100 transition-colors">
                      <button className="flex items-center bg-blue-500 text-white rounded-full p-2 mr-3">
                        <Mail className="w-5 h-5" />
                      </button>
                      <span className="text-gray-700">Add your Email ID</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center">
                      <button className="flex items-center bg-green-500 text-white rounded-full p-2 mr-3">
                        <Phone className="w-5 h-5" />
                      </button>
                      <span className="text-blue-500">Verified mobile Number</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center hover:bg-gray-100 transition-colors">
                      <button className="flex items-center bg-blue-500 text-white rounded-full p-2 mr-3">
                        <Plus className="w-5 h-5" />
                      </button>
                      <span className="text-gray-700">Complete Basic Info</span>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
                    <button className="flex items-center text-blue-500 border-2 border-blue-500 rounded-xl px-6 py-2 hover:bg-blue-50 transition-colors">
                      <Edit className="w-5 h-5 mr-2" />
                      EDIT
                    </button>
                  </div>
                  <p className="text-gray-600 mb-8">Basic info, for a faster booking experience</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">NAME</p>
                      <p className="font-medium text-gray-800">{profileData.name}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">BIRTHDAY</p>
                      {profileData.birthday ? (
                        <p className="font-medium text-gray-800">{profileData.birthday}</p>
                      ) : (
                        <button 
                          onClick={() => handleAddClick('BIRTHDAY')}
                          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Add Birthday
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">GENDER</p>
                      {profileData.gender ? (
                        <p className="font-medium text-gray-800">{profileData.gender}</p>
                      ) : (
                        <button 
                          onClick={() => handleAddClick('GENDER')}
                          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Gender
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">MARITAL STATUS</p>
                      {profileData.maritalStatus ? (
                        <p className="font-medium text-gray-800">{profileData.maritalStatus}</p>
                      ) : (
                        <button 
                          onClick={() => handleAddClick('MARITAL STATUS')}
                          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Status
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">YOUR ADDRESS</p>
                      {profileData.address ? (
                        <p className="font-medium text-gray-800">{profileData.address}</p>
                      ) : (
                        <button 
                          onClick={() => handleAddClick('YOUR ADDRESS')}
                          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
                        >
                          <MapPin className="w-5 h-5 mr-2" />
                          Add Address
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">PINCODE</p>
                      {profileData.pincode ? (
                        <p className="font-medium text-gray-800">{profileData.pincode}</p>
                      ) : (
                        <button 
                          onClick={() => handleAddClick('PINCODE')}
                          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Pincode
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-500 text-sm mb-2">STATE</p>
                      {profileData.state ? (
                        <p className="font-medium text-gray-800">{profileData.state}</p>
                      ) : (
                        <button 
                          onClick={() => handleAddClick('STATE')}
                          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add State
                        </button>
                      )}
                    </div>
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
      </div>
    </div>
  );
}
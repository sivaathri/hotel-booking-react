import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from '../../context/UserContext';

const HostHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="bg-white p-0">
          {/* Header Start */}
          <Link to="/listings" className="navbar-brand w-10 h-10 ml-5 mt-2 p-0 d-flex">
  <h1 className="m-0 text-primary text-uppercase">Hotelier</h1>
</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/today" className="text-black hover:text-black">Today</Link>
          <Link to="/calendar" className="text-black hover:text-black">Calendar</Link>
          <Link to="/listings" className="text-black hover:text-black">Listings</Link>
          <Link to="/messages" className="text-black hover:text-black">Messages</Link>
        </div>

        {/* Right Side - User Profile */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="position-relative">
              <div className="flex items-center justify-between h-12 px-2 border border-gray-300 rounded-full shadow-sm">
                <div className="relative">
                  <button>
                    <div 
                      className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-sm font-semibold"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      {user.username ? user.username.charAt(0).toUpperCase() : 'S'}
                    </div>
                  </button>
                </div>
              </div>
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden animate-fade-in">
                  {/* Top Section - User Info */}
                  <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                  </div>

                  {/* Links Section */}
                  <div className="flex flex-col divide-y divide-gray-100">
                    <Link
                      to="/host-dashboard"
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/host-profile"
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/host-listings"
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Listings
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="px-5 py-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors py-2 px-2 rounded-md"
                    >
                      <i className="fas fa-sign-out-alt w-5 mr-3"></i> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HostHeader;

import React from "react";
import { Link } from "react-router-dom";

const HostHeader = () => {
  return (
    <header className="bg-white border-b">
      <nav className="flex items-center justify-between px-6 py-4">
      <div className="bg-white p-0">
        {/* Header Start */}
        <a href="/" className="navbar-brand w-10 h-10 ml-5 mt-2 p-0 d-flex">
          <h1 className="m-0 text-primary text-uppercase">Hotelier</h1>
        </a>
      </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/today" className="text-black hover:text-black">Today</Link>
          <Link to="/calendar" className="text-black hover:text-black">Calendar</Link>
          <Link to="/listings" className="text-black hover:text-black">Listings</Link>
          <Link to="/messages" className="text-black hover:text-black">Messages</Link>
        </div>

        {/* Right Side - Menu & Profile */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            Menu
          </button>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </nav>
    </header>
  );
};

export default HostHeader;

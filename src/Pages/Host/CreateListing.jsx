import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCopy, FiChevronRight } from 'react-icons/fi';
import HostHeader from './HostHeader';

const CreateListing = () => {
  return (
    <>
      <HostHeader />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-8">Welcome back, Sadhish</h1>

        {/* Finish your listing section */}
        <div className="mb-12">
          <h2 className="text-xl font-medium mb-4">Finish your listing</h2>
          <div className="border rounded-xl p-4 hover:border-gray-400 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FiHome className="text-xl" />
              </div>
              <p className="text-gray-700">Your listing started on 22 April 2025</p>
            </div>
          </div>
        </div>

        {/* Start a new listing section */}
        <div>
          <h2 className="text-xl font-medium mb-4">Start a new listing</h2>
          <div className="space-y-4">
            {/* Create new listing button */}
            <Link to="/create-new-listing" className="flex items-center justify-between p-6 border rounded-xl hover:border-gray-400 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FiHome className="text-xl" />
                </div>
                <span className="text-gray-700">Create a new listing</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>

            {/* Create from existing listing button */}
            <Link to="/create-from-existing" className="flex items-center justify-between p-6 border rounded-xl hover:border-gray-400 cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FiCopy className="text-xl" />
                </div>
                <span className="text-gray-700">Create from an existing listing</span>
              </div>
              <FiChevronRight className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateListing; 
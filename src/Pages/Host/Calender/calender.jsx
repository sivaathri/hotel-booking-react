import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import HostHeader from '../HostHeader';

const Calender = () => {
  const [selectedRange, setSelectedRange] = useState('28 May 2025 - 27 Jun 2025');
  const [viewType, setViewType] = useState('List view');

  // Calendar data structure
  const mayDates = [
    { date: 28, day: 'Wed' },
    { date: 29, day: 'Thu' },
    { date: 30, day: 'Fri' },
    { date: 31, day: 'Sat' }
  ];

  const juneDates = [
    { date: 1, day: 'Sun' },
    { date: 2, day: 'Mon' },
    { date: 3, day: 'Tue' },
    { date: 4, day: 'Wed' },
    { date: 5, day: 'Thu' },
    { date: 6, day: 'Fri' },
    { date: 7, day: 'Sat' },
    { date: 8, day: 'Sun' },
    { date: 9, day: 'Mon' },
    { date: 10, day: 'Tue' },
    { date: 11, day: 'Wed' },
    { date: 12, day: 'Thu' },
    { date: 13, day: 'Fri' },
    { date: 14, day: 'Sat' },
    { date: 15, day: 'Sun' },
    { date: 16, day: 'Mon' },
    { date: 17, day: 'Tue' },
    { date: 18, day: 'Wed' },
    { date: 19, day: 'Thu' },
    { date: 20, day: 'Fri' },
    { date: 21, day: 'Sat' },
    { date: 22, day: 'Sun' }
  ];

  const allDates = [...mayDates, ...juneDates];

  // Room data
  const rooms = [
    {
      id: '1381220102',
      name: '3 BHK',
      status: 'Bookable',
      roomsToSell: 2,
      netBooked: '',
      rate: 'Standard Rate',
      pricing: Array(26).fill({ price: 'INR 6000', available: 2 })
    },
    {
      id: '1381220101',
      name: '2 BHK',
      status: 'Bookable',
      roomsToSell: 1,
      netBooked: '',
      rate: 'Standard Rate',
      pricing: Array(26).fill({ price: 'INR 4000', available: 1 })
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <HostHeader />
      <div className="border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
            </div>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-red-500 font-bold">1</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>All rooms</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                  XML (not editable)
                </span>
                <span className="text-sm text-gray-600">
                  Last sync: 27 May 2025, 13:08
                </span>
                <button className="text-blue-600 text-sm hover:underline">
                  Learn more
                </button>
              </div>
            </div>
            
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>List view</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">{selectedRange}</span>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Pricing per guest</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Restrictions</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Month Headers */}
          <div className="flex bg-gray-50 border-b">
            <div className="w-48 p-3 font-medium text-gray-700">May 2025</div>
            <div className="flex">
              {mayDates.map((date, index) => (
                <div key={`may-${index}`} className="w-16 p-2 text-center border-l border-gray-200">
                  <div className="text-xs text-gray-600">{date.day}</div>
                  <div className="text-sm font-medium">{date.date}</div>
                </div>
              ))}
            </div>
            <div className="w-48 p-3 font-medium text-gray-700 border-l-2 border-gray-300">Jun 2025</div>
            <div className="flex">
              {juneDates.map((date, index) => (
                <div key={`jun-${index}`} className="w-16 p-2 text-center border-l border-gray-200">
                  <div className="text-xs text-gray-600">{date.day}</div>
                  <div className="text-sm font-medium">{date.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Rows */}
          {rooms.map((room, roomIndex) => (
            <div key={room.id} className="border-b border-gray-200">
              {/* Room Header */}
              <div className="flex items-center bg-gray-50">
                <div className="w-48 p-4">
                  <div className="font-medium text-gray-900">{room.name}</div>
                  <div className="text-xs text-gray-500">(Room ID: {room.id})</div>
                </div>
                <div className="flex-1 h-16"></div>
              </div>
              
              {/* Room Status Row */}
              <div className="flex">
                <div className="w-48 p-3 text-sm text-gray-600">Room status</div>
                <div className="flex-1 bg-green-100">
                  <div className="p-3 text-sm font-medium text-green-800">Bookable</div>
                </div>
              </div>
              
              {/* Rooms to Sell Row */}
              <div className="flex">
                <div className="w-48 p-3 text-sm text-gray-600">Rooms to sell</div>
                <div className="flex">
                  {allDates.map((_, index) => (
                    <div key={index} className="w-16 p-2 text-center border-l border-gray-200">
                      <div className="text-sm">{room.roomsToSell}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Net Booked Row */}
              <div className="flex">
                <div className="w-48 p-3 text-sm text-gray-600">Net booked</div>
                <div className="flex">
                  {allDates.map((_, index) => (
                    <div key={index} className="w-16 p-2 text-center border-l border-gray-200">
                      <div className="text-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rate Row */}
              <div className="flex bg-blue-50">
                <div className="w-48 p-3">
                  <div className="text-sm text-blue-600">▼ {room.rate}</div>
                  <div className="text-xs text-blue-600">▼ ✎ Edit</div>
                </div>
                <div className="flex">
                  {room.pricing.map((pricing, index) => (
                    <div key={index} className="w-16 p-2 text-center border-l border-gray-200">
                      <div className="text-xs text-gray-600">{pricing.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-900 text-white p-6 mt-8">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex space-x-8">
            <a href="#" className="text-white hover:text-blue-200">About Us</a>
            <a href="#" className="text-white hover:text-blue-200">Privacy and Cookie Statements</a>
            <a href="#" className="text-white hover:text-blue-200">FAQs</a>
          </div>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
              Add new property
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
              Share your feedback
            </button>
          </div>
        </div>
        <div className="text-center mt-4 text-blue-200">
          © Copyright 2025
        </div>
      </div>
    </div>
  );
};

export default Calender;
import React, { useState,useEffect } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react';
import HostHeader from '../HostHeader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

import { API_URL } from '../../../config/api.config';
import { getAuthToken } from '../../../utils/getAuthToken';
import { useUser } from '../../../context/UserContext';
const Calender = () => {
  const { user } = useUser();
    const token = getAuthToken();
      const [propertydetails, setpropertydetails] = useState([]);
      useEffect(() => {
        const fetchPropertyDetails = async () => {
          if (!user?.id) return;
          
          try {
            const response = await axios.get(`${API_URL}/getall/${user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Handle the nested data structure
            if (response.data.success && response.data.data) {
              // Convert the single property object to an array if it's not already
              const propertyData = Array.isArray(response.data.data) 
                ? response.data.data 
                : [response.data.data];
                
              // Parse the image_paths string to array if it exists
              const propertiesWithParsedImages = propertyData.map(property => ({
                ...property,
                images: property.image_paths ? JSON.parse(property.image_paths) : []
              }));
              
              setpropertydetails(propertiesWithParsedImages);
              console.log('Property Details:', propertiesWithParsedImages);
            }
          } catch (error) {
            console.error('Error fetching property details:', error);
          }
        };
    
        fetchPropertyDetails();
      }, [token, user?.id]);


  const [startDate, setStartDate] = useState(new Date('2025-05-28'));
  const [endDate, setEndDate] = useState(new Date('2025-06-27'));
  const [selectedRange, setSelectedRange] = useState('28 May 2025 - 27 Jun 2025');
  const [viewType, setViewType] = useState('List view');
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [pricingMode, setPricingMode] = useState('custom');
  const [guestPricing, setGuestPricing] = useState({
    6: { price: 0, enabled: true },
    5: { price: 1000, enabled: true },
    4: { price: 2000, enabled: true },
    3: { price: 3000, enabled: true },
    2: { price: 4000, enabled: true },
    1: { price: 5000, enabled: true }
  });

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

  // const renderCalendarHeader = () => {
  //   return (
  //     <div className="flex">
  //       <div className="w-48 flex-shrink-0 p-2">
  //         <div className="text-sm font-medium">May 2025</div>
  //       </div>
  //       <div className="flex-1 flex">
  //         {allDates.map((date, index) => (
  //           <div key={index} className="flex-1 text-center border-l border-gray-200">
  //             <div className="text-xs text-gray-600">{date.day}</div>
  //             <div className="text-xs">{date.date}</div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // const renderRoom = (room) => {
  //   return (
  //     <div>
  //       <div className="flex">
  //         <div className="w-48 flex-shrink-0 p-2">
  //           <div className="font-medium">{room.name}</div>
  //           <div className="text-xs text-gray-500">Room ID: {room.id}</div>
  //         </div>
  //       </div>
  //       <div className="flex">
  //         <div className="w-48 flex-shrink-0 p-2">
  //           <div className="text-xs">Rooms to sell</div>
  //         </div>
  //         <div className="flex-1 flex">
  //           {room.pricing.map((price, index) => (
  //             <div key={index} className="flex-1 text-center border-l border-gray-200">
  //               <div className="text-xs">{room.roomsToSell}</div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //       <div className="flex border-t border-gray-200">
  //         <div className="w-48 flex-shrink-0 p-2">
  //           <div className="flex items-center space-x-2">
  //             <span className="h-2 w-2 rounded-full bg-green-500"></span>
  //             <span className="text-xs">Standard Rate</span>
  //           </div>
  //         </div>
  //         <div className="flex-1 flex">
  //           {room.pricing.map((price, index) => (
  //             <div key={index} className="flex-1 text-center border-l border-gray-200">
  //               <div className="text-xs">INR {room.name === '3 BHK' ? '6000' : '4000'}</div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="bg-white min-h-screen">
      <HostHeader />
      <div className="p-4">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>All rooms</option>
            </select>
            <span className="text-sm text-gray-600">
              Last sync: 27 May 2025, 13:08
            </span>
          </div>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>List view</option>
          </select>
        </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <DatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
                if (start && end) {
                  const formattedStart = start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const formattedEnd = end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  setSelectedRange(`${formattedStart} - ${formattedEnd}`);
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="dd MMM yyyy - dd MMM yyyy"
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
              placeholderText="Select date range"
            />
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
              {/* <div className="flex">
                <div className="w-48 p-3 text-sm text-gray-600">Room status</div>
                <div className="flex-1 bg-green-100">
                  <div className="p-3 text-sm font-medium text-green-800">Bookable</div>
                </div>
              </div>
               */}
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
              {/* <div className="flex">
                <div className="w-48 p-3 text-sm text-gray-600">Net booked</div>
                <div className="flex">
                  {allDates.map((_, index) => (
                    <div key={index} className="w-16 p-2 text-center border-l border-gray-200">
                      <div className="text-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
               */}
              {/* Rate Row */}
              <div className="flex bg-blue-50">
                <div className="w-48 p-3">
                  <div className="text-sm text-blue-600">▼ {room.rate}</div>
                  <div className="text-xs text-blue-600 cursor-pointer" onClick={() => {
                    setSelectedRoom(room);
                    setShowPricingPopup(true);
                  }}>▼ ✎ Edit</div>
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

      {/* Pricing per Guest Popup */}
      {showPricingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit pricing per guest</h2>
              <button onClick={() => setShowPricingPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Standard Rate</div>
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricingMode"
                      value="recommended"
                      checked={pricingMode === 'recommended'}
                      onChange={(e) => setPricingMode(e.target.value)}
                      className="mr-2"
                    />
                    Recommended
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricingMode"
                      value="custom"
                      checked={pricingMode === 'custom'}
                      onChange={(e) => setPricingMode(e.target.value)}
                      className="mr-2"
                    />
                    Custom
                  </label>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Your prices can change depending on how many guests stay at your place. You can
                  set a fixed discount per person, a percentage discount and even decide which
                  amount of guests pay a different price.
                </p>

                <div className="space-y-4">
                  {Object.entries(guestPricing).map(([guests, data]) => (
                    <div key={guests} className="flex items-center justify-between">
                      <div className="w-24">{guests} guests</div>
                      <div className="flex-1">
                        {guests === '6' ? (
                          <div className="text-sm">Normal price</div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="text-sm">Normal price reduced by</div>
                            <input
                              type="number"
                              value={data.price}
                              onChange={(e) => setGuestPricing(prev => ({
                                ...prev,
                                [guests]: { ...data, price: parseInt(e.target.value) || 0 }
                              }))}
                              className="border rounded px-2 py-1 w-24"
                            />
                            <select className="border rounded px-2 py-1">
                              <option>INR</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">On</div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={data.enabled}
                            onChange={() => setGuestPricing(prev => ({
                              ...prev,
                              [guests]: { ...data, enabled: !data.enabled }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowPricingPopup(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save pricing logic here
                    setShowPricingPopup(false);
                  }}
                  className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
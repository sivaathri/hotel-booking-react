import React, { useState, useEffect } from 'react';
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
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

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
  const [selectedRoomType, setSelectedRoomType] = useState('all');

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

  // Helper to generate all dates between startDate and endDate (inclusive)
  function getDateRangeArray(start, end) {
    if (!start || !end) return [];
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
      arr.push({
        date: dt.getDate(),
        day: dt.toLocaleDateString('en-GB', { weekday: 'short' }),
        month: dt.getMonth(),
        year: dt.getFullYear(),
        full: new Date(dt)
      });
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  const selectedDates = (startDate && endDate) ? getDateRangeArray(startDate, endDate) : [];

  // Find selected property
  const selectedProperty = propertydetails.find(p => p.property_id === Number(selectedPropertyId)) || propertydetails[0];

  // Now define rooms, which uses selectedDates and selectedProperty
  const rooms = selectedProperty && Array.isArray(selectedProperty.rooms)
    ? selectedProperty.rooms
      .filter(room => {
        if (selectedRoomType === 'all') return true;
        return room.room_type && room.room_type.split('_')[0] === selectedRoomType;
      })
      .map(room => ({
        id: room.room_id,
        name: room.room_type ? room.room_type.split('_')[0] : '',
        status: 'Bookable',
        roomsToSell: room.rpa_number_of_rooms || room.number_of_rooms || 0,
        netBooked: '',
        rate: 'Standard Rate',
        pricing: Array(selectedDates.length).fill({ price: room.base_price ? `INR ${parseFloat(room.base_price)}` : '', available: room.rpa_number_of_rooms || room.number_of_rooms || 0 })
      }))
    : [];

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
      </div>

      {console.log('propertydetails:', propertydetails)}

      {/* Property Selection Dropdown */ }
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={selectedPropertyId}
            onChange={e => {
              setSelectedPropertyId(e.target.value);
              setSelectedRoomType('all'); // reset room type filter on property change
            }}
          >
            <option value="">Select property</option>
            {propertydetails.map(property => (
              <option key={property.property_id} value={property.property_id}>{property.property_name}</option>
            ))}
          </select>

          {/* Room Type Dropdown depends on selected property */}
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={selectedRoomType}
            onChange={e => setSelectedRoomType(e.target.value)}
            disabled={!selectedProperty && !propertydetails.length}
          >
            <option value="all">All rooms</option>
            {selectedProperty && Array.isArray(selectedProperty.rooms) &&
              [...new Set(selectedProperty.rooms
                .filter(room => room.room_type)
                .map(room => room.room_type.split('_')[0]))]
                .map(roomType => (
                  <option key={roomType} value={roomType}>{roomType}</option>
                ))
            }
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
              if (formattedStart === formattedEnd) {
                setSelectedRange(formattedStart);
              } else {
                setSelectedRange(`${formattedStart} - ${formattedEnd}`);
              }
            } else if (start) {
              const formattedStart = start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              setSelectedRange(formattedStart);
            } else {
              setSelectedRange('');
            }
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          dateFormat="dd MMM yyyy"
          className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
          placeholderText="Select date range"
        />
      </div>
      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          {/* Table Head: Date Headers */}
          {selectedDates.length > 0 && (
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="w-48 p-3 font-medium text-gray-700 text-left align-bottom">{selectedDates[0].full.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</th>
                {selectedDates.map((date, index) => (
                  <th key={index} className="w-16 p-2 text-center border-l border-gray-200 font-normal align-bottom">
                    <div className="text-xs text-gray-600">{date.day}</div>
                    <div className="text-sm font-medium">{date.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {/* Room Rows */}
            {rooms.map((room, roomIndex) => (
              <React.Fragment key={room.id}>
                {/* Room Header Row */}
                <tr className="bg-gray-50">
                  <td className="w-48 p-4 font-medium text-gray-900 align-middle border-b border-gray-200">
                    {room.name}
                    <div className="text-xs text-gray-500">(Room ID: {room.id})</div>
                  </td>
                  {selectedDates.map((_, index) => (
                    <td key={index} className="h-8 border-b border-gray-200"></td>
                  ))}
                </tr>
                {/* Rooms to Sell Row */}
                <tr>
                  <td className="w-48 p-3 text-sm text-gray-600 align-middle">Rooms to sell</td>
                  {selectedDates.map((_, index) => (
                    <td key={index} className="w-16 p-2 text-center border-l border-gray-200 align-middle">
                      <div className="text-sm">{room.roomsToSell}</div>
                    </td>
                  ))}
                </tr>
                {/* Rate Row */}
                <tr className="bg-blue-50">
                  <td className="w-48 p-3 align-middle">
                    <div className="text-sm text-blue-600">▼ {room.rate}</div>
                    <div className="text-xs text-blue-600 cursor-pointer" onClick={() => {
                      // Find the original room object from selectedProperty.rooms
                      const origRoom = selectedProperty.rooms.find(r => r.room_id === room.id);
                      setSelectedRoom({
                        ...room,
                        room_capacity_adults: origRoom ? origRoom.room_capacity_adults : undefined,
                      });
                      setShowPricingPopup(true);
                    }}>▼ ✎ Edit</div>
                  </td>
                  {selectedDates.map((_, index) => (
                    <td key={index} className="w-16 p-2 text-center border-l border-gray-200 align-middle">
                      <div className="text-xs text-gray-600">{room.pricing[0].price}</div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing per Guest Popup */ }
      {showPricingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit pricing per guest</h2>
              <button onClick={() => setShowPricingPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Show room_capacity_adults value */}
            <div className="p-4">
              <div className="mb-2 text-sm text-gray-700">
                <strong>Room Capacity (Adults):</strong> {selectedRoom && selectedRoom.room_capacity_adults !== undefined ? selectedRoom.room_capacity_adults : '-'}
              </div>
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
                  {/* Dynamically generate guest pricing rows based on room_capacity_adults */}
                  {selectedRoom && selectedRoom.room_capacity_adults
                    ? Array.from({ length: selectedRoom.room_capacity_adults }, (_, i) => {
                      const guests = (i + 1).toString();
                      const data = guestPricing[guests] || { price: 0, enabled: true };
                      return (
                        <div key={guests} className="flex items-center justify-between">
                          <div className="w-24">{guests} guest{guests !== '1' ? 's' : ''}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="text-sm">Price</div>
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
                      );
                    })
                    : null};
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
        </div>
      )}
    </div>
  );
};

export default Calender;
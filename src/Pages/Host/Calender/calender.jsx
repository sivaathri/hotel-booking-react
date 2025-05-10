import React, { useState, useEffect, useRef } from 'react';
import HostHeader from '../HostHeader';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, X, Settings, Home } from 'lucide-react';
import moment from 'moment';

const Calender = () => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDates, setSelectedDates] = useState([]);
    const [priceAdjustments, setPriceAdjustments] = useState({});
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedDateForPrice, setSelectedDateForPrice] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [occupancy, setOccupancy] = useState({
        adults: 2,
        children: 0,
        rooms: 1
    });
    const [showOccupancyModal, setShowOccupancyModal] = useState(false);
    const [showOccupancySettingsModal, setShowOccupancySettingsModal] = useState(false);
    const [showRoomSettingsModal, setShowRoomSettingsModal] = useState(false);
    const calendarRef = useRef(null);

    // Room and pricing data
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([
        {
            id: 1,
            name: "2BHK",
            basePrice: 7500,
            occupancyAdjustments: [
                { minGuests: 1, maxGuests: 3, adjustment: 3000 },
                { minGuests: 1, maxGuests: 4, adjustment: 4000 },
                { minGuests: 1, maxGuests: 6, adjustment: 6000 }
            ]
        }
    ]);

    // Calculate total price based on occupancy and room
    const calculateTotalPrice = (date) => {
        if (!selectedRoom) return 0;
        
        const totalGuests = occupancy.adults + occupancy.children;
        let price = selectedRoom.basePrice;

        // Find applicable occupancy adjustment
        const adjustment = selectedRoom.occupancyAdjustments.find(adj => 
            totalGuests >= adj.minGuests && totalGuests <= adj.maxGuests
        );

        if (adjustment) {
            price = adjustment.adjustment;
        }

        // Add any date-specific price adjustments
        const dateStr = date.format('YYYY-MM-DD');
        if (priceAdjustments[dateStr]) {
            price = parseInt(priceAdjustments[dateStr]);
        }

        return price;
    };

    const handleRoomChange = (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        setSelectedRoom(room);
    };

    const handleRoomSettingsChange = (roomId, field, value) => {
        setRooms(prevRooms => 
            prevRooms.map(room => 
                room.id === roomId 
                    ? { ...room, [field]: value }
                    : room
            )
        );
    };

    const handleOccupancyAdjustmentChange = (roomId, index, field, value) => {
        setRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId) {
                    const newAdjustments = [...room.occupancyAdjustments];
                    newAdjustments[index] = {
                        ...newAdjustments[index],
                        [field]: parseInt(value)
                    };
                    return { ...room, occupancyAdjustments: newAdjustments };
                }
                return room;
            })
        );
    };

    const addOccupancyAdjustment = (roomId) => {
        setRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId) {
                    return {
                        ...room,
                        occupancyAdjustments: [
                            ...room.occupancyAdjustments,
                            { minGuests: 1, maxGuests: 2, adjustment: 0 }
                        ]
                    };
                }
                return room;
            })
        );
    };

    const removeOccupancyAdjustment = (roomId, index) => {
        setRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId) {
                    return {
                        ...room,
                        occupancyAdjustments: room.occupancyAdjustments.filter((_, i) => i !== index)
                    };
                }
                return room;
            })
        );
    };

    const renderRoomSettingsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Room Price Settings</h3>
                    <button
                        onClick={() => setShowRoomSettingsModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {rooms.map(room => (
                        <div key={room.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-lg">{room.name}</h4>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Base Price (₹)
                                </label>
                                <input
                                    type="number"
                                    value={room.basePrice}
                                    onChange={(e) => handleRoomSettingsChange(room.id, 'basePrice', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">Occupancy Adjustments</h4>
                                    <button
                                        onClick={() => addOccupancyAdjustment(room.id)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Add Adjustment
                                    </button>
                                </div>

                                {room.occupancyAdjustments.map((adjustment, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-1">Min Guests</label>
                                            <input
                                                type="number"
                                                value={adjustment.minGuests}
                                                onChange={(e) => handleOccupancyAdjustmentChange(room.id, index, 'minGuests', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-1">Max Guests</label>
                                            <input
                                                type="number"
                                                value={adjustment.maxGuests}
                                                onChange={(e) => handleOccupancyAdjustmentChange(room.id, index, 'maxGuests', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={adjustment.adjustment}
                                                onChange={(e) => handleOccupancyAdjustmentChange(room.id, index, 'adjustment', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeOccupancyAdjustment(room.id, index)}
                                            className="p-2 text-red-600 hover:text-red-800"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={() => setShowRoomSettingsModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setShowRoomSettingsModal(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
                setShowOccupancyModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOccupancyChange = (type, value) => {
        setOccupancy(prev => ({
            ...prev,
            [type]: Math.max(0, value)
        }));
    };

    const renderOccupancyModal = () => (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Adults</h3>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleOccupancyChange('adults', occupancy.adults - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span>{occupancy.adults}</span>
                        <button
                            onClick={() => handleOccupancyChange('adults', occupancy.adults + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Children</h3>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleOccupancyChange('children', occupancy.children - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span>{occupancy.children}</span>
                        <button
                            onClick={() => handleOccupancyChange('children', occupancy.children + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Rooms</h3>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleOccupancyChange('rooms', occupancy.rooms - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span>{occupancy.rooms}</span>
                        <button
                            onClick={() => handleOccupancyChange('rooms', occupancy.rooms + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCalendar = () => (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-medium">
                    {currentDate.format('MMMM YYYY')}
                </span>
                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-900">
                        {day}
                    </div>
                ))}
                {renderCalendarDays()}
            </div>
        </div>
    );

    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = moment(currentDate).startOf('month').day();
    const lastDayOfMonth = moment(currentDate).endOf('month').day();

    const handlePrevMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, 'month'));
    };

    const handleDateClick = (date) => {
        if (selectedDates.length === 0 || selectedDates.length === 2) {
            setSelectedDates([date]);
        } else {
            const [startDate] = selectedDates;
            if (moment(date).isBefore(startDate)) {
                setSelectedDates([date]);
            } else {
                setSelectedDates([startDate, date]);
            }
        }
    };

    const handlePriceAdjustment = (date, price) => {
        setPriceAdjustments(prev => ({
            ...prev,
            [date]: price
        }));
        setShowPriceModal(false);
    };

    const renderCalendarDays = () => {
        const days = [];
        const today = moment();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = moment(currentDate).date(day);
            const isSelected = selectedDates.some(selectedDate => 
                moment(selectedDate).isSame(date, 'day')
            );
            const isInRange = selectedDates.length === 2 && 
                date.isBetween(selectedDates[0], selectedDates[1], 'day', '[]');
            const isPast = date.isBefore(today, 'day');
            const price = calculateTotalPrice(date);

            days.push(
                <div
                    key={day}
                    onClick={() => !isPast && handleDateClick(date)}
                    className={`h-24 border border-gray-200 p-2 cursor-pointer relative
                        ${isPast ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-blue-50'}
                        ${isSelected ? 'bg-blue-500 text-white' : ''}
                        ${isInRange && !isSelected ? 'bg-blue-100' : ''}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-sm">{day}</span>
                        <div className="flex flex-col items-end">
                            <span className="text-xs bg-green-100 text-green-800 px-1 rounded mb-1">
                                ₹{price}
                            </span>
                            <span className="text-xs text-gray-500">
                                {occupancy.adults + occupancy.children} guests
                            </span>
                        </div>
                    </div>
                    {!isPast && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDateForPrice(date);
                                setShowPriceModal(true);
                            }}
                            className="absolute bottom-1 right-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                            Set Price
                        </button>
                    )}
                </div>
            );
        }

        // Add empty cells for days after the last day of the month
        for (let i = lastDayOfMonth; i < 6; i++) {
            days.push(<div key={`empty-end-${i}`} className="h-24 border border-gray-200"></div>);
        }

        return days;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <HostHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Calendar & Pricing</h2>
                        <div className="flex items-center space-x-4">
                            <select
                                value={selectedRoom?.id || ''}
                                onChange={(e) => handleRoomChange(parseInt(e.target.value))}
                                className="p-2 border rounded"
                            >
                                <option value="">Select Room</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} - ₹{room.basePrice}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setShowRoomSettingsModal(true)}
                                className="p-2 text-blue-600 hover:text-blue-800"
                                title="Manage Room Prices"
                            >
                                <Home className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Booking.com style search bar */}
                    <div className="relative" ref={calendarRef}>
                        <div className="flex items-center space-x-4 bg-white border border-gray-300 rounded-lg p-4">
                            <div className="flex-1 relative">
                                <div
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                >
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Dates</div>
                                        <div className="text-sm font-medium">
                                            {selectedDates.length === 2
                                                ? `${moment(selectedDates[0]).format('MMM D')} - ${moment(selectedDates[1]).format('MMM D')}`
                                                : 'Select dates'}
                                        </div>
                                    </div>
                                </div>
                                {showCalendar && renderCalendar()}
                            </div>

                            <div className="flex-1 relative">
                                <div
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => setShowOccupancyModal(!showOccupancyModal)}
                                >
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Guests</div>
                                        <div className="text-sm font-medium">
                                            {`${occupancy.adults} adults · ${occupancy.children} children · ${occupancy.rooms} room`}
                                        </div>
                                    </div>
                                </div>
                                {showOccupancyModal && renderOccupancyModal()}
                            </div>

                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="mt-8 grid grid-cols-7 gap-px bg-gray-200">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-900">
                                {day}
                            </div>
                        ))}
                        {renderCalendarDays()}
                    </div>
                </div>
            </div>

            {/* Price Adjustment Modal */}
            {showPriceModal && selectedDateForPrice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Set Price for {selectedDateForPrice.format('MMMM D, YYYY')}
                            </h3>
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="number"
                            placeholder="Enter price adjustment"
                            className="w-full p-2 border rounded mb-4"
                            onChange={(e) => handlePriceAdjustment(
                                selectedDateForPrice.format('YYYY-MM-DD'),
                                e.target.value
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowPriceModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRoomSettingsModal && renderRoomSettingsModal()}
        </div>
    );
};

export default Calender;

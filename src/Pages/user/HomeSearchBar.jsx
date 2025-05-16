import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeSearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [childrenAges, setChildrenAges] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  // Get today's date and day after tomorrow's date
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Format dates to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(dayAfterTomorrow));
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0
  });
  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);

  // Handle scroll event to set sticky state
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100); // Change to sticky after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update state when URL parameters change
  useEffect(() => {
    const urlDestination = searchParams.get('destination');
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlAdults = searchParams.get('adults');
    const urlChildren = searchParams.get('children');
    const urlChildrenAges = searchParams.get('childrenAges');

    if (urlDestination) setDestination(urlDestination);
    if (urlCheckIn) setCheckIn(urlCheckIn);
    if (urlCheckOut) setCheckOut(urlCheckOut);
    if (urlAdults || urlChildren) {
      setGuests({
        adults: parseInt(urlAdults) || 1,
        children: parseInt(urlChildren) || 0
      });
    }
    if (urlChildrenAges) {
      setChildrenAges(JSON.parse(decodeURIComponent(urlChildrenAges)));
    }
  }, [searchParams]);

  const handleChange = (type, value) => {
    if (type === 'children') {
      const newChildrenCount = Math.max(0, guests.children + value);
      setGuests(prev => ({
        ...prev,
        children: newChildrenCount
      }));

      // Update children ages array
      if (value > 0) {
        setChildrenAges(prev => [...prev, 0]);
      } else {
        setChildrenAges(prev => prev.slice(0, -1));
      }
    } else {
      setGuests(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] + value)
      }));
    }
  };

  const handleAgeChange = (index, value) => {
    setChildrenAges(prev => {
      const newAges = [...prev];
      newAges[index] = value;
      return newAges;
    });
  };

  const getSummary = () => {
    const totalGuests = guests.adults + guests.children;
    return `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
  };

  const handleSearch = () => {
    // Basic validation
    if (!destination || !checkIn || !checkOut) {
      alert("Please fill in all fields.");
      return;
    }

    // Create query params or search data object
    const searchData = {
      destination,
      checkIn,
      checkOut,
      guests,
      childrenAges
    };

    console.log("Search Data:", searchData);

    // Navigate to rooms page with query parameters
    navigate(`/rooms?destination=${encodeURIComponent(destination)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${guests.adults}&children=${guests.children}&childrenAges=${encodeURIComponent(JSON.stringify(childrenAges))}`);
  };

  return (
    <div className={`w-full transition-all duration-300 z-50 mb-5 `}>
      <div className="w-full max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-full shadow-lg flex items-center h-21 w-200 divide-x ${isSticky ? 'border border-gray-200' : ''}`}
        >
          {/* Where */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 px-6"
          >
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-800">Where</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search destinations"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full outline-none text-gray-600 placeholder-gray-400 text-sm"
              />
            </div>
          </motion.div>

          {/* Date */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 px-6 relative"
            ref={datePickerRef}
          >
            <div className="flex flex-col">
              <label className="text-sm mt-3 font-semibold text-gray-800">Date</label>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="text-left outline-none text-gray-600 text-sm cursor-pointer"
              >
                <p className="text-sm font-medium">
                  {checkIn && checkOut ? (
                    <span className="text-gray-800">
                      {`${formatDateForDisplay(checkIn)} - ${formatDateForDisplay(checkOut)}`}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Check-in - Check-out
                    </span>
                  )}
                </p>


              </motion.button>
            </div>

            <AnimatePresence>
              {isDatePickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-3 left-0 bg-white rounded-2xl shadow-lg p-6 z-50 w-[650px]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Select dates</h3>
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex gap-6">
                    {/* Current Month Calendar */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-600">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h4>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-400">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }, (_, i) => (
                          <div key={`empty-start-${i}`} className="h-10" />
                        ))}
                        {Array.from(
                          { length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() },
                          (_, i) => {
                            const date = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1);
                            const dateString = formatDate(date);
                            const isSelected = dateString >= checkIn && dateString <= checkOut;
                            const isCheckIn = dateString === checkIn;
                            const isCheckOut = dateString === checkOut;
                            const isPast = date < today;

                            return (
                              <motion.button
                                key={i}
                                whileHover={!isPast ? { scale: 1.1 } : {}}
                                whileTap={!isPast ? { scale: 0.95 } : {}}
                                onClick={() => {
                                  if (!isPast) {
                                    if (!checkIn || (checkIn && checkOut) || dateString < checkIn) {
                                      setCheckIn(dateString);
                                      setCheckOut('');
                                    } else {
                                      setCheckOut(dateString);
                                    }
                                  }
                                }}
                                disabled={isPast}
                                className={`h-10 rounded-lg flex items-center justify-center text-sm relative
                                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-orange-50 cursor-pointer'}
                                  ${isSelected ? 'bg-orange-100' : ''}
                                  ${isCheckIn ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                                  ${isCheckOut ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                                `}
                              >
                                {i + 1}
                                {(isCheckIn || isCheckOut) && (
                                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 whitespace-nowrap">
                                    {/* {isCheckIn ? 'Check-in' : 'Check-out'} */}
                                  </div>
                                )}
                              </motion.button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Next Month Calendar */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-600">
                          {new Date(new Date().getFullYear(), new Date().getMonth() + 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h4>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-400">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getDay() }, (_, i) => (
                          <div key={`empty-start-next-${i}`} className="h-10" />
                        ))}
                        {Array.from(
                          { length: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).getDate() },
                          (_, i) => {
                            const date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, i + 1);
                            const dateString = formatDate(date);
                            const isSelected = dateString >= checkIn && dateString <= checkOut;
                            const isCheckIn = dateString === checkIn;
                            const isCheckOut = dateString === checkOut;

                            return (
                              <motion.button
                                key={i}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (!checkIn || (checkIn && checkOut) || dateString < checkIn) {
                                    setCheckIn(dateString);
                                    setCheckOut('');
                                  } else {
                                    setCheckOut(dateString);
                                  }
                                }}
                                className={`h-10 rounded-lg flex items-center justify-center text-sm relative
                                  hover:bg-orange-50 cursor-pointer
                                  ${isSelected ? 'bg-orange-100' : ''}
                                  ${isCheckIn ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                                  ${isCheckOut ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                                `}
                              >
                                {i + 1}
                                {(isCheckIn || isCheckOut) && (
                                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 whitespace-nowrap">
                                    {/* {isCheckIn ? 'Check-in' : 'Check-out'} */}
                                  </div>
                                )}
                              </motion.button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Range Display */}
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">





                      <button
                        onClick={() => {
                          setCheckIn('');
                          setCheckOut('');
                        }}
                        className="text-sm text-orange-500 hover:text-orange-600"
                      >
                        Clear dates
                      </button>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Who */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 px-6"
          >
            <div className="flex flex-col relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-gray-800">Who</label>
              <motion.input
                whileTap={{ scale: 0.95 }}
                type="text"
                placeholder="Add guests"
                value={getSummary()}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                className="w-full outline-none text-gray-600 placeholder-gray-400 text-sm cursor-pointer"
              />
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-lg p-4 z-50"
                  >
                    {['adults', 'children'].map(type => (
                      <div key={type} className="flex justify-between items-center mb-2">
                        <span className="capitalize text-gray-700 text-sm sm:text-base">{type}</span>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700 text-sm sm:text-base"
                            onClick={() => handleChange(type, -1)}
                          >
                            -
                          </motion.button>
                          <span className="text-sm sm:text-base">{guests[type]}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700 text-sm sm:text-base"
                            onClick={() => handleChange(type, 1)}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    ))}
                    {guests.children > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Children's Ages</h3>
                        {childrenAges.map((age, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">Child {index + 1}</span>
                            <select
                              value={age}
                              onChange={(e) => handleAgeChange(index, parseInt(e.target.value))}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              {[...Array(18)].map((_, i) => (
                                <option key={i} value={i}>
                                  {i} years
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Search Button */}
          <div className="px-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-orange-400 hover:bg-orange-400/90 text-white rounded-full p-2 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  DollarSign,
  Users,
  Settings,
  MessageSquare,
  Star,
  TrendingUp,
  Bell
} from 'lucide-react';
import HostHeader from '../Host/HostHeader';
import { API_URL } from '../../config/api.config';
import { getAuthToken } from '../../utils/getAuthToken';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div
    className="bg-white rounded-xl p-6 shadow-sm"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <p className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </motion.div>
);

const BookingCard = ({ booking }) => (
  <motion.div
    className="bg-white rounded-xl p-4 shadow-sm"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold">{booking.guestName}</h4>
        <p className="text-sm text-gray-500">{booking.propertyName}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">₹{booking.amount}</p>
        <p className="text-sm text-gray-500">{booking.dates}</p>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between">
      <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
        {booking.status}
      </span>
      <button className="text-sm text-[#FF5A5F] hover:underline">
        View Details
      </button>
    </div>
  </motion.div>
);

const PropertyCard = ({ property }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-sm"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="relative h-40">
      <img
        src={property.image}
        alt={property.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold">{property.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{property.location}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-sm">{property.rating}</span>
        </div>
        <span className="text-sm font-semibold">₹{property.price}/night</span>
      </div>
    </div>
  </motion.div>
);

const HostUserDashboard = () => {
  const [activeTab, setActiveTab] = useState('Reservation');
  const navigate = useNavigate();
  const { user } = useUser();
  const token = getAuthToken();
  const [propertydetails, setpropertydetails] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(`${API_URL}/getall/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const propertyData = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];
            const allBookings = [];
            propertyData.forEach(property => {
              property.rooms?.forEach(room => {
                room.bookings?.forEach(booking => {
                  allBookings.push({
                    guestName: `${booking.first_name} ${booking.last_name}`,
                    guests: booking.adults + booking.children,
                    checkIn: formatDate(booking.check_in_date),
                    checkOut: formatDate(booking.check_out_date),
                    rooms: room.room_type,
                    bookedOn: formatDate(booking.created_at),
                    status: booking.payment_status === 'Canceled' ? 'Canceled' : 'Confirmed',
                    price: `Rs. ${booking.total_price}`,
                    commission: 'Rs. 0', // Change this if commission logic exists
                    bookingNumber: booking.booking_id.toString(),
                  });
                });
              });
            });
            setReservations(allBookings);
          const propertiesWithParsedImages = propertyData.map(property => ({
            ...property,
            images: property.image_paths ? JSON.parse(property.image_paths) : []
          }));

          setpropertydetails(propertiesWithParsedImages);

          // Calculate and set stats
          const totalProperties = propertiesWithParsedImages.length;
          // Count total active bookings
          const totalBookings = propertiesWithParsedImages.reduce((bookingCount, property) => {
            if (!property.rooms || !Array.isArray(property.rooms)) return bookingCount;

            const propertyBookingCount = property.rooms.reduce((roomCount, room) => {
              return roomCount + (room.bookings ? room.bookings.length : 0);
            }, 0);

            return bookingCount + propertyBookingCount;
          }, 0);
          const stats = [
            { title: 'Total Properties', value: totalProperties.toString(), icon: Home, trend: '+2 this month', color: 'text-blue-500' },
            { title: 'Active Bookings', value: totalBookings.toString(), icon: Calendar, trend: '+3 today', color: 'text-green-500' },
            { title: 'Total Revenue', icon: DollarSign, trend: '+15% this month', color: 'text-purple-500' },
            { title: 'Total Guests', icon: Users, trend: '+8 this week', color: 'text-orange-500' },
          ];

          setStatsData(stats);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [token, user?.id]);

// Helper to format dates like "Jun 23, 2025"
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};



  // const stats = [
  //   { title: 'Total Properties', value: '{property.property_id}', icon: Home, trend: '+2 this month', color: 'text-blue-500' },
  //   { title: 'Active Bookings', value: '12', icon: Calendar, trend: '+3 today', color: 'text-green-500' },
  //   { title: 'Total Revenue', value: '₹1,25,000', icon: DollarSign, trend: '+15% this month', color: 'text-purple-500' },
  //   { title: 'Total Guests', value: '48', icon: Users, trend: '+8 this week', color: 'text-orange-500' },
  // ];

  const recentBookings = [
    {
      guestName: 'John Doe',
      propertyName: 'Luxury Beach Villa',
      amount: '15,000',
      dates: '15-20 Mar 2024',
      status: 'Confirmed'
    },
    {
      guestName: 'Jane Smith',
      propertyName: 'Mountain View Resort',
      amount: '12,500',
      dates: '22-25 Mar 2024',
      status: 'Pending'
    },
    {
      guestName: 'Mike Johnson',
      propertyName: 'City Center Apartment',
      amount: '8,000',
      dates: '28-30 Mar 2024',
      status: 'Cancelled'
    },
    {
      guestName: 'Mike Johnson',
      propertyName: 'City Center Apartment',
      amount: '8,000',
      dates: '28-30 Mar 2024',
      status: 'Cancelled'
    },
    {
      guestName: 'Mike Johnson',
      propertyName: 'City Center Apartment',
      amount: '8,000',
      dates: '28-30 Mar 2024',
      status: 'Cancelled'
    }
  ];

  const properties = [
    {
      name: 'Luxury Beach Villa',
      location: 'Goa, India',
      rating: '4.8',
      price: '15,000',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Mountain View Resort',
      location: 'Manali, India',
      rating: '4.6',
      price: '12,500',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'City Center Apartment',
      location: 'Mumbai, India',
      rating: '4.5',
      price: '8,000',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];
  // const reservations = [
  //   {
  //     guestName: 'Ramya C',
  //     guests: 2,
  //     checkIn: 'Jun 2, 2025',
  //     checkOut: 'Jun 3, 2025',
  //     rooms: '2 BHK',
  //     bookedOn: 'May 16, 2025',
  //     status: 'Canceled',
  //     price: 'Rs. 0',
  //     commission: 'Rs. 0',
  //     bookingNumber: '4763178491'
  //   },
  //   {
  //     guestName: 'sadhish kumar',
  //     guests: 2,
  //     checkIn: 'Jun 11, 2025',
  //     checkOut: 'Jun 12, 2025',
  //     rooms: '3 BHK',
  //     bookedOn: 'May 23, 2025',
  //     status: 'Canceled',
  //     price: 'Rs. 0',
  //     commission: 'Rs. 0',
  //     bookingNumber: '4336571675'
  //   }
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HostHeader />



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['Reservation', 'properties', 'bookings', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${activeTab === tab
                    ? 'border-b-2 border-[#FF5A5F] text-[#FF5A5F]'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Reservation' && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Reservations</h1>
              <div className="flex gap-2 items-center">
                <select className="border p-2 rounded">
                  <option>Check-in</option>
                  <option>Check-out</option>
                </select>
                <input type="date" className="border p-2 rounded" defaultValue="2025-05-29" />
                <input type="date" className="border p-2 rounded" defaultValue="2025-06-30" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Show</button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Check-in</th>
                    <th className="p-3">Check-out</th>
                    <th className="p-3">Rooms</th>
                    <th className="p-3">Booked on</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Commission</th>
                    <th className="p-3">Booking number</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                        {r.guestName}
                        <div className="text-gray-500 text-xs">{r.guests} guests</div>
                      </td>
                      <td className="p-3">{r.checkIn}</td>
                      <td className="p-3">{r.checkOut}</td>
                      <td className="p-3">{r.rooms.split('_')[0]}</td>

                      <td className="p-3">{r.bookedOn}</td>
                      <td className="p-3 text-red-600 font-semibold">{r.status}</td>
                      <td className="p-3">{r.price}</td>
                      <td className="p-3">{r.commission}</td>
                      <td className="p-3 text-blue-600 hover:underline cursor-pointer">{r.bookingNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {/* <div className="mt-4 flex items-center justify-between text-sm">
           <div className="text-gray-500">Page 1</div>
           <div className="font-semibold">
             Commission: Rs. 0 <span className="ml-4">Total Price: Rs. 0</span>
           </div>
         </div> */}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard key={index} property={property} />
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-gray-300 hover:border-[#FF5A5F] transition-colors"
              onClick={() => navigate('/listings')}
            >
              <Home className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-600 font-medium">Add New Property</span>
            </motion.button>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
            <div className="space-y-4">
              {[...recentBookings, ...recentBookings].map((booking, index) => (
                <BookingCard key={index} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Revenue Reservation</h2>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Revenue Chart Placeholder
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Booking Trends Chart Placeholder
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HostUserDashboard;
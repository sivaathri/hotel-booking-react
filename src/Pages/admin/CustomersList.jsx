import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api.config';
import { getAuthToken } from '../../utils/getAuthToken';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await axios.get(`${API_URL}/auth/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setCustomers(response.data);
          setTotalUsers(response.data.length);
        }
        console.log("response",response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-pulse text-blue-500 font-semibold">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="animate-bounce text-red-500 text-lg font-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center animate-fade-in">Customer List</h2>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
          <span className="font-semibold">Total Users: </span>
          <span className="text-2xl font-bold">{totalUsers}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-center">
            <th className="py-3 px-4 border transition-colors duration-300 hover:bg-gray-300">SL.NO</th>
              <th className="py-3 px-4 border transition-colors duration-300 hover:bg-gray-300">Name</th>
              <th className="py-3 px-4 border transition-colors duration-300 hover:bg-gray-300">Email</th>
              <th className="py-3 px-4 border transition-colors duration-300 hover:bg-gray-300">Phone</th>
              {/* <th className="py-3 px-4 border transition-colors duration-300 hover:bg-gray-300">Status</th> */}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr 
                key={customer._id} 
                className="text-center transition-all duration-300 hover:bg-gray-50 transform hover:scale-[1.01]"
                style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
              >
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{customer.username}</td>
                <td className="py-2 px-4 border">{customer.email}</td>
                <td className="py-2 px-4 border">{customer.mobile}</td>
                {/* <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    customer.isActive 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;

import React, { useState, useEffect } from 'react';

const dummyCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876500000',
  },
];

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Replace with backend call later
    setCustomers(dummyCustomers);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Customer List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-3 px-4 border">Customer ID</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="text-center">
                <td className="py-2 px-4 border">{customer.id}</td>
                <td className="py-2 px-4 border">{customer.name}</td>
                <td className="py-2 px-4 border">{customer.email}</td>
                <td className="py-2 px-4 border">{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;

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
    <>
     {/* <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p>Here you can show a list of users or user-related info.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div> */}
    <div className="bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-xl p-10 max-w-3xl w-full">
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
    </>
    
  );
};

export default CustomersList;

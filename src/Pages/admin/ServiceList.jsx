import React, { useEffect, useState } from 'react';

const dummyServices = [
  {
    id: 1,
    name: 'Laundry',
    description: 'Clothes washing and ironing service',
    price: 20,
  },
  {
    id: 2,
    name: 'Spa',
    description: 'Relaxing massage and spa treatments',
    price: 50,
  },
  {
    id: 3,
    name: 'Room Service',
    description: 'Food and beverages to your room',
    price: 15,
  },
];

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Replace with API call later
    setServices(dummyServices);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Hotel Services</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-3 px-4 border">Service ID</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Description</th>
              <th className="py-3 px-4 border">Price ($)</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="text-center">
                <td className="py-2 px-4 border">{service.id}</td>
                <td className="py-2 px-4 border">{service.name}</td>
                <td className="py-2 px-4 border">{service.description}</td>
                <td className="py-2 px-4 border">{service.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceList;

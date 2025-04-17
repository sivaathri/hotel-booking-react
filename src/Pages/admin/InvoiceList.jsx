import React from 'react';

const Invoices = () => {
  const invoiceList = [
    {
      invoiceNo: 'INV-001',
      name: 'John Doe',
      email: 'john@example.com',
      roomType: 'Deluxe',
      checkin: '2025-04-15',
      checkout: '2025-04-18',
      pricePerNight: 120,
      nights: 3,
    },
    {
      invoiceNo: 'INV-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      roomType: 'Suite',
      checkin: '2025-04-10',
      checkout: '2025-04-12',
      pricePerNight: 200,
      nights: 2,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Invoices</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Invoice No</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Room Type</th>
              <th className="px-4 py-2">Check-in</th>
              <th className="px-4 py-2">Check-out</th>
              <th className="px-4 py-2">Nights</th>
              <th className="px-4 py-2">Price/Night</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceList.map((inv, i) => (
              <tr key={i} className="text-center border-b">
                <td className="px-4 py-2">{inv.invoiceNo}</td>
                <td className="px-4 py-2">{inv.name}</td>
                <td className="px-4 py-2">{inv.email}</td>
                <td className="px-4 py-2">{inv.roomType}</td>
                <td className="px-4 py-2">{inv.checkin}</td>
                <td className="px-4 py-2">{inv.checkout}</td>
                <td className="px-4 py-2">{inv.nights}</td>
                <td className="px-4 py-2">${inv.pricePerNight}</td>
                <td className="px-4 py-2 font-semibold">
                  ${inv.nights * inv.pricePerNight}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;

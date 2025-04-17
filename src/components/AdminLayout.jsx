import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4>Admin Panel</h4>
        <ul className="list-unstyled">
          <li><Link className="text-white" to="/admin/dashboard">Dashboard</Link></li>
          <li><Link className="text-white" to="/admin/bookings">Bookings</Link></li>
          <li><Link className="text-white" to="/admin/rooms">Rooms</Link></li>
          <li><Link className="text-white" to="/admin/users">Users</Link></li>
          <li><Link className="text-white" to="/login">Logout</Link></li>
        </ul>
        <p>hello</p>
      </div>
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

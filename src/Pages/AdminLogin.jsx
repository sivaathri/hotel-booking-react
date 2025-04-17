import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // For now, we’ll hardcode login check. Replace with backend API later.
    if (credentials.email === 'admin@hotel.com' && credentials.password === 'admin123') {
      alert('Login successful!');
      navigate('/admin/dashboard'); // Navigate to admin dashboard
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          name="password"
          required
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

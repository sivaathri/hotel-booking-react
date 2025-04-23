import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api.config';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Starting login process...');

    // Check for admin credentials
    if (formData.email === 'admin@gmail.com' && formData.password === 'Admin@123') {
      console.log('Admin login detected, redirecting to admin dashboard...');
      // Store admin token
      if (stayLoggedIn) {
        localStorage.setItem('token', 'admin-token');
      } else {
        sessionStorage.setItem('token', 'admin-token');
      }
      window.location.href = '/admin/dashboard';
      return;
    }

    try {
      console.log('Making API request for regular user...');
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response);

      if (response.status === 200) {
        console.log('Login successful, storing token...');
        // Store the token if stayLoggedIn is true
        if (stayLoggedIn) {
          localStorage.setItem('token', response.data.token);
        } else {
          sessionStorage.setItem('token', response.data.token);
        }
        
        console.log('Token stored, attempting navigation...');
        // Force navigation to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border w-full mb-3 p-2"
        required
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border w-full mb-3 p-2 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="stayLoggedIn"
          checked={stayLoggedIn}
          onChange={(e) => setStayLoggedIn(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="stayLoggedIn" className="text-sm text-gray-600">
          Stay logged in
        </label>
      </div>
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}
      <button
        type="submit"
        className="bg-gray-800 text-white py-2 px-4 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default SignIn;

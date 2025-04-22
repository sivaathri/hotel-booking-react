import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      console.log('Making API request...');
      const response = await axios.post('http://localhost:5000/api/auth/login', {
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
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border w-full mb-3 p-2"
        required
      />
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

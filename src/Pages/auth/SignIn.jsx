import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api.config';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import ForgotPassword from './ForgotPassword';

const SignIn = ({ setSigninOpen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Starting login process...');

    // Check for admin credentials    
    try {
      console.log('Making API request for regular user...');
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response);

      if (response.status === 200) {
        console.log('Login successful, storing token...');

        const { token, user } = response.data; // assuming `user` object is returned

        if (stayLoggedIn) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        console.log('Token stored, checking for admin...');

        // Check for specific admin credentials
        if (
          formData.email === 'admin@gmail.com' &&
          formData.password === 'Admin@123'
        ) {
          console.log('Admin detected, redirecting...');
          window.location.href = '/admin/dashboard'; // or your admin route
        } else {
          console.log('Regular user, redirecting to home...');
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }

    return;


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
    <>
      {showForgotPassword ? (
        <ForgotPassword setForgotPasswordOpen={setShowForgotPassword} />
      ) : (
        <div className=" flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please sign in to your account
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-10  py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="stayLoggedIn"
                    name="stayLoggedIn"
                    type="checkbox"
                    checked={stayLoggedIn}
                    onChange={(e) => setStayLoggedIn(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="stayLoggedIn" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    Stay logged in
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setSigninOpen(false);
                      // The signup form will be opened by the parent component
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;

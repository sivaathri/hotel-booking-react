import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import ForgotPassword from './ForgotPassword';

const SignIn = ({ setSigninOpen }) => {
  const navigate = useNavigate();
  const { login } = useUser();
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

    try {
      const result = await login(formData.email, formData.password, stayLoggedIn);
      
      if (result.success) {
        if (formData.email === 'admin@gmail.com' && formData.password === 'Admin@123') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForgotPassword ? (
        <ForgotPassword setForgotPasswordOpen={setShowForgotPassword} />
      ) : (
        <form className="space-y-4 w-full max-w-xs" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-md block w-full pl-8 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-xs text-sm"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-md block w-full pl-8 pr-8 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-xs text-sm"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="stayLoggedIn"
                name="stayLoggedIn"
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="stayLoggedIn" className="ml-1 block text-xs text-gray-900 cursor-pointer">
                Stay logged in
              </label>
            </div>
            <div className="text-xs">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded bg-red-50 p-2 text-xs">
              <div className="flex">
                <div className="ml-2">
                  <h3 className="font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          <div className="text-center text-xs">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setSigninOpen(false);
                }}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      )}
    </>
  );
};

export default SignIn;

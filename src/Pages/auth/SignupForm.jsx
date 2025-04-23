import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../../config/api.config';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaMobile } from 'react-icons/fa';

function SignupForm({ setSignupOpen,setSigninOpen }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: ""
  });
  const [mobile, setMobile] = useState("");
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (value) => {
    return {
      hasChar: /[a-zA-Z]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|&lt;&gt;]/.test(value),
      hasNumber: /[0-9]/.test(value),
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);

    // Validate mobile number length
    if (value.length > 10) {
      setMobileError("Mobile number cannot exceed 10 digits");
      setIsOtpEnabled(false);
    } else if (value.length === 10) {
      setMobileError("");
      setIsOtpEnabled(true);
    } else {
      setMobileError("");
      setIsOtpEnabled(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setFormData(prev => ({
      ...prev,
      password: value
    }));
  };

  const handlePasswordFocus = () => {
    setShowPasswordRequirements(true);
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setShowPasswordRequirements(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const generateOtp = () => {
    // Generate a random 4-digit number between 1000 and 9999
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  const handleSendOtp = async () => {
    try {
      // Generate OTP
      const newOtp = generateOtp();
      
      // Here you would typically make an API call to your backend to send OTP
      // For now, we'll simulate it with a timeout and log the OTP to console
      console.log(`OTP for ${mobile}: ${newOtp}`); // For testing purposes
      
      setIsOtpSent(true);
      setOtpError("");
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real implementation, you would handle the API response here
    } catch (error) {
      setOtpError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (otp.length !== 4) {
        setOtpError("OTP must be 4 digits");
        return;
      }
      
      // Verify the entered OTP against the generated OTP
      if (otp === generatedOtp) {
        setIsOtpVerified(true);
        setOtpError("");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setOtp(value);
      setOtpError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setError("Please verify your mobile number first");
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.hasChar || !passwordValidation.hasSpecialChar || !passwordValidation.hasNumber) {
      setError("Password must meet all requirements");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: mobile
      });

      if (response.status === 201) {
        // Show success message
        alert("Registration successful! You will be redirected to login page.");
        setSignupOpen(false)
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      // Send the Google credential to your backend
      const response = await axios.post(`${API_URL}/auth/google`, {
        credential: credentialResponse.credential
      });

      if (response.status === 201) {
        // Show success message
        alert("Registration successful! You will be redirected to login page.");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  const handleAppleSuccess = async (response) => {
    try {
      setLoading(true);
      setError("");

      // Send the Apple authentication response to your backend
      const response = await axios.post(`${API_URL}/auth/apple`, {
        credential: response.credential
      });

      if (response.status === 201) {
        // Show success message
        alert("Registration successful! You will be redirected to login page.");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Apple authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleError = () => {
    setError("Apple authentication failed. Please try again.");
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please fill in your details to sign up
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="appearance-none rounded-lg relative block w-full pl-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-lg relative block w-full pl-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out focus:outline-none"
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {showPasswordRequirements && (
              <div className="space-y-1 bg-gray-50 p-3 rounded-lg">
                <p className={`text-sm ${validatePassword(password).hasChar ? 'text-green-500' : 'text-gray-500'}`}>
                  ✓ At least one character (a-z or A-Z)
                </p>
                <p className={`text-sm ${validatePassword(password).hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                  ✓ At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                </p>
                <p className={`text-sm ${validatePassword(password).hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                  ✓ At least one number (0-9)
                </p>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMobile className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                placeholder="Mobile Number"
                value={mobile}
                onChange={handleMobileChange}
                className="appearance-none rounded-lg relative block w-full pl-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            {mobileError && (
              <p className="text-red-500 text-sm">{mobileError}</p>
            )}

            {!isOtpSent ? (
              <button
                type="button"
                className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${isOtpEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                disabled={!isOtpEnabled}
                onClick={handleSendOtp}
              >
                Get OTP
              </button>
            ) : !isOtpVerified ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className="appearance-none rounded-lg relative block w-full py-3 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    className="flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    onClick={handleVerifyOtp}
                  >
                    Verify
                  </button>
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm">{otpError}</p>
                )}
              </div>
            ) : (
              <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">
                ✓ Mobile number verified
              </div>
            )}
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
              disabled={!isOtpVerified || loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </div>
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setSignupOpen(false);
                  // The sign-in form will be opened by the parent component
                }}
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
                logo_alignment="left"
                context="signup"
              />
            </div>
          </GoogleOAuthProvider>

          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            onClick={() => {
              if (window.AppleID) {
                window.AppleID.auth.signIn({
                  clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
                  scope: 'name email',
                  redirectURI: window.location.origin,
                  state: 'origin:web',
                  usePopup: true,
                  responseMode: 'form_post',
                  responseType: 'code id_token'
                })
                .then(handleAppleSuccess)
                .catch(handleAppleError);
              } else {
                setError("Apple sign-in is not available. Please try another method.");
              }
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="w-5 h-5"
            />
            Continue with Apple
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;

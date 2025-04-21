import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function SignupForm() {
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
      
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: mobile
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
      const response = await axios.post('http://localhost:5000/api/auth/google', {
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
      const response = await axios.post('http://localhost:5000/api/auth/apple', {
        credential: response.credential
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
      setError(error.response?.data?.message || 'Apple authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleError = () => {
    setError("Apple authentication failed. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChange}
        className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        required
      />
      
      <div className="relative mb-3">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500"
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 11c0-1.21-.51-2.42-1.42-3.42M15 9c-1.2 0-2.4.49-3.42 1.42M9 15c1.2 0 2.4-.49 3.42-1.42M9 9C7.8 9 6.6 9.49 5.58 10.42M13 5C12.21 5 11.47 5.15 10.78 5.42M3 5l18 18"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.5 0 8.5 3.58 8.5 8s-4 8-8.5 8-8.5-3.58-8.5-8 4-8 8.5-8zm0 3a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5z"/>
            </svg>
          )}
        </button>
      </div>
      {showPasswordRequirements && (
        <div className="mb-3 space-y-1">
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

      <input
        type="number"
        placeholder="Mobile Number"
        value={mobile}
        onChange={handleMobileChange}
        className="w-full mb-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      />
      {mobileError && (
        <p className="text-red-500 text-sm mb-3">{mobileError}</p>
      )}

      {!isOtpSent ? (
        <button
          type="button"
          className={`bg-blue-500 text-white py-2 px-4 rounded w-full mb-3 ${isOtpEnabled ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
          disabled={!isOtpEnabled}
          onClick={handleSendOtp}
        >
          Get OTP
        </button>
      ) : !isOtpVerified ? (
        <div className="mb-3">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              maxLength={4}
            />
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
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
        <div className="mb-3 text-green-500 text-sm">
          ✓ Mobile number verified
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <button 
        type="submit" 
        className={`bg-[#FEA116] text-white py-2 px-4 rounded w-full ${!isOtpVerified ? "opacity-50 cursor-not-allowed" : ""} ${loading ? "opacity-70" : ""}`}
        disabled={!isOtpVerified || loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="my-4 text-center text-gray-400 text-sm">or</div>

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
        className="flex items-center justify-center gap-2 border w-full py-2 rounded hover:bg-gray-100 transition mt-3"
        onClick={() => {
          // Initialize Apple sign-in
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
  );
}

export default SignupForm;

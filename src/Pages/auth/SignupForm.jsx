import React, { useState } from "react";

function SignupForm() {
  const [mobile, setMobile] = useState("");
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const validatePassword = (value) => {
    return {
      hasChar: /[a-zA-Z]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|&lt;&gt;]/.test(value),
      hasNumber: /[0-9]/.test(value),
    };
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

  return (
    <form>
      <input
        type="text"
        placeholder="Username"
        className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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

      <button
        type="button"
        className={`bg-blue-500 text-white py-2 px-4 rounded w-full mb-3 ${isOtpEnabled ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
        disabled={!isOtpEnabled}
      >
        Get OTP
      </button>

      <button type="submit" className="bg-[#FEA116] text-white py-2 px-4 rounded w-full">
        Sign Up
      </button>

      <div className="my-4 text-center text-gray-400 text-sm">or</div>

      <button
        type="button"
        className="flex items-center justify-center gap-2 border w-full py-2 rounded mb-3 hover:bg-gray-100 transition"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-2 border w-full py-2 rounded hover:bg-gray-100 transition"
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

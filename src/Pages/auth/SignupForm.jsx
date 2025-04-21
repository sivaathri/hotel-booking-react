import React, { useState } from "react";

function SignupForm() {
  const [mobile, setMobile] = useState("");
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);

    // Enable OTP if it's a 10-digit number (you can customize the logic)
    if (/^\d{10}$/.test(value)) {
      setIsOtpEnabled(true);
    } else {
      setIsOtpEnabled(false);
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
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500"
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 11c0-1.21-.51-2.42-1.42-3.42M15 9c-1.2 0-2.4.49-3.42 1.42M9 15c1.2 0 2.4-.49 3.42-1.42M9 9C7.8 9 6.6 9.49 5.58 10.42M13 5C12.21 5 11.47 5.15 10.78 5.42M3 5l18 18"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.5 0 8.5 3.58 8.5 8s-4 8-8.5 8-8.5-3.58-8.5-8 4-8 8.5-8zm0 3a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5z"/>
            </svg>
          )}
        </button>
      </div>

      <input
        type="number"
        placeholder="Mobile Number"
        value={mobile}
        onChange={handleMobileChange}
        className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      />

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

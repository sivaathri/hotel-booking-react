import React, { useState } from "react";

function SignupForm() {
  const [mobile, setMobile] = useState("");
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);

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

  return (
    <form>
      <input type="text" placeholder="Username" className="border-1 w-full mb-3 p-2" />
      <input type="email" placeholder="Email" className="border-1 w-full mb-3 p-2" />
      <input type="password" placeholder="Password" className="border-1 w-full mb-3 p-2" />
      
      <input
        type="number"
        placeholder="Mobile Number"
        value={mobile}
        onChange={handleMobileChange}
        className="border-1 w-full mb-3 p-2"
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

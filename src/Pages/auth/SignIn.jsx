import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  
  return (
    <form>
      <input type="email" placeholder="Email" className="border w-full mb-3 p-2" />
      <input type="password" placeholder="Password" className="border w-full mb-3 p-2" />
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="stayLoggedIn"
          checked={stayLoggedIn}
          onChange={(e) => setStayLoggedIn(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="stayLoggedIn" className="text-sm  text-gray-600">
          Stay logged in
        </label>
      </div>
      <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded">
        Login
      </button>
    </form>
  );
};

export default SignIn;

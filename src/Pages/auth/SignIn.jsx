import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  
  return (
    <form>
                        <input type="email" placeholder="Email" className="border w-full mb-3 p-2" />
                        <input type="password" placeholder="Password" className="border w-full mb-3 p-2" />
                        <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded">
                          Login
                        </button>
                      </form>
  );
};

export default SignIn;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SignupForm from "../auth/SignupForm";
import SignIn from "../auth/SignIn";
import { useUser } from '../../context/UserContext';
import axios from "axios";
import { API_URL } from '../../config/api.config';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiLogOut,
  FiMessageSquare,
  FiUser,
  FiBell,
  FiSettings,
  FiGlobe,
  FiHelpCircle,
} from 'react-icons/fi';
const Header = () => {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      const spinner = document.getElementById("spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    }, 1000);

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavOpen(true);
      } else {
        setIsNavOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="bg-white p-0">
      {/* Spinner Start */}
      <div
        id="spinner"
        className="position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
        style={{ zIndex: 9999, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {/* Spinner End */}

      {/* Header Start */}
      <div className="container-fluid bg-dark px-0 rounded-top-start-3">
        <div className="row gx-0">
          <div className="col-lg-3 bg-dark d-none d-lg-block">
            <a
              href="/"
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
            >
              <h1 className="m-0 text-primary text-uppercase">Hotelier</h1>
            </a>
          </div>
          <div className="col-lg-9">
            {/* <div className="row gx-0 bg-white d-none d-lg-flex">
              <div className="col-lg-7 px-5 text-start">
                <div className="h-100 d-inline-flex align-items-center py-2 me-4">
                  <i className="fa fa-envelope text-primary me-2"></i>
                  <p className="mb-0">info@example.com</p>
                </div>
                <div className="h-100 d-inline-flex align-items-center py-2">
                  <i className="fa fa-phone-alt text-primary me-2"></i>
                  <p className="mb-0">+012 345 6789</p>
                </div>
              </div>
              <div className="col-lg-5 px-5 text-end">
                <div className="d-inline-flex align-items-center py-2">
                  <a className="me-3" href="">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="me-3" href="">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="me-3" href="">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="me-3" href="">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div> */}
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0">
              <a href="/" className="navbar-brand d-block d-lg-none">
                <h1 className="m-0 text-primary text-uppercase">Hotelier</h1>
              </a>
              <button
                type="button"
                className="navbar-toggler"
                onClick={toggleNav}
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={`navbar-collapse ${isNavOpen ? 'show' : 'collapse'}`}
                id="navbarCollapse"
              >
                <div className="navbar-nav me-auto py-0">
                  {isNavOpen ? (
                    <>
                      {/* <Link
                        to="/"
                        className={`nav-item nav-link ${currentPath === "/" ? "text-warning fw-bold border-bottom border-warning" : ""}`}
                      >
                    Hotels
                      </Link> */}
                      {/* <Link
                        to="/about"
                        className={`nav-item nav-link ${currentPath === "/about" ? "text-warning fw-bold border-bottom border-warning" : ""}`}
                      >
                        About
                      </Link>
                      <Link
                        to="/service"
                        className={`nav-item nav-link ${currentPath === "/service" ? "text-warning fw-bold border-bottom border-warning" : ""}`}
                      >
                        Services
                      </Link>
                      <Link to="/room"
                        className={`nav-item nav-link ${currentPath === "/Rooms" ? "text-warning fw-bold border-bottom border-warning" : ""}`}>
                        Rooms
                      </Link>
                      <div className="nav-item dropdown">
                        <a
                          href="#"
                          className="nav-link dropdown-toggle"
                          role="button"
                        >
                          Pages
                        </a>
                        <div className="dropdown-menu w-20 rounded-0 m-0">
                          <Link to="/booking" className="dropdown-item">
                            Booking
                          </Link>
                          <Link to="/team" className="dropdown-item">
                            Our Team
                          </Link>
                          <Link to="/testimonial" className="dropdown-item">
                            Testimonial
                          </Link>
                        </div>
                      </div>
                      <Link to="/contact" className="nav-item nav-link">
                        Contact
                      </Link> */}
                    </>
                  ) : (
                    <Link
                      to={currentPath}
                      className="nav-item nav-link text-warning fw-bold border-bottom border-warning"
                    >
                      {currentPath === "/" && "Rooms"}
                      {currentPath === "/about" && "About"}
                      {currentPath === "/service" && "Services"}
                      {currentPath === "/Rooms" && "Rooms"}
                      {currentPath === "/booking" && "Booking"}
                      {currentPath === "/team" && "Our Team"}
                      {currentPath === "/testimonial" && "Testimonial"}
                      {currentPath === "/contact" && "Contact"}
                    </Link>
                  )}
                </div>
                <div className="d-flex gap-3 m-3 align-items-center">
                  {user ? (
                    <>
                      <Link
                        to="/HostHeader"
                        className="relative  inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl     px-6 py-2 font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
                      >
                        <span className="relative text-white backdrop-blur-sm bg-white/10 px-2 py-2 rounded-lg  font-semibold z-10 flex items-center">
                      
                        Go Host Mode
                        </span>
                        {/* <span className="absolute inset-0 z-0 bg-white opacity-10 blur-lg"></span> */}
                      </Link>

                      <div className="position-relative">
                        <div className="flex items-center justify-between h-12 px-2  border border-gray-300 rounded-full shadow-sm">
                          {/* Hamburger Menu Icon */}
                          {/* <button
                            className="p-2 focus:outline-none"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                          >
                            <i className="fas fa-bars text-gray-700"></i>
                          </button> */}


                          {/* Profile Icon with Badge */}
                          <div className="relative">
                            <button>
                              <div className="w-8 h-8 bg-black text-white flex items-center  justify-center rounded-full text-sm font-semibold"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                              >
                                {user.username ? user.username.charAt(0).toUpperCase() : 'S'}
                              </div>
                            </button>

                            <span className="absolute -top-4 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                              2
                            </span>
                          </div>
                        </div>
                        {showUserMenu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0  mt-3 w-64 rounded-xl bg-white shadow-xl z-50 overflow-hidden border border-gray-100"
                          >
                            <div className="flex flex-col  text-sm text-gray-800 py-2">
                              {/* Section 1 */}
                              <Link
                                to="/messages"
                                className="flex items-center gap-3 px-5 py-3 text-gray-900 font-medium hover:bg-orange-50 transition-colors duration-200"
                              >
                                <FiMessageSquare size={18} className="text-gray-600" />
                                Messages
                              </Link>

                              <Link
                                to="/notifications"
                                className="flex items-center gap-3 px-5 py-3 text-gray-900 font-medium hover:bg-orange-50 transition-colors duration-200"
                              >
                                <FiBell size={18} className="text-gray-600" />
                                Notifications
                                {/* You can re-enable this for a notification dot */}
                                {/* <span className="ml-auto h-2 w-2 bg-red-500 rounded-full inline-block animate-ping"></span> */}
                              </Link>

                              <Link
                                to="/wishlists"
                                className="flex items-center gap-3 px-5 py-3 text-gray-900 font-medium hover:bg-orange-50 transition-colors duration-200"
                              >
                                <FiHeart size={18} className="text-gray-600" />
                                Wishlists
                              </Link>

                              {/* Section Divider */}
                              <div className="my-2 border-t border-gray-100"></div>

                              {/* Section 2 */}
                              <Link
                                to="/user-dashboard"
                                className="flex items-center gap-3 px-5 py-3 text-gray-900 font-medium hover:bg-orange-50 transition-colors duration-200"
                              >
                                <FiUser size={18} className="text-gray-600" />
                                Account
                              </Link>

                              {/* Section Divider */}
                              <div className="my-2 border-t border-gray-100"></div>

                              {/* Section 3 */}
                              <Link
                                to="/help"
                                className="flex items-center gap-3 px-5 py-3 text-gray-900 font-medium hover:bg-orange-50 transition-colors duration-200"
                              >
                                <FiHelpCircle size={18} className="text-gray-600" />
                                Help Centre
                              </Link>

                              <button
                                onClick={handleLogout}
                                className="text-left w-full px-5 py-3 hover:bg-orange-50 text-red-600 font-medium transition-colors duration-200 flex items-center gap-3"
                              >
                                <FiLogOut size={18} className="text-red-600" />
                                Log out
                              </button>
                            </div>
                          </motion.div>
                        )}
                        {/* Logout Confirmation Popup */}
                        {showLogoutConfirm && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-fade-in">
                              <div className="text-center">
                                <h3 className="text-xl font-semibold mb-4">Logout Confirmation</h3>
                                <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                                <div className="flex justify-center gap-4">
                                  <button
                                    onClick={cancelLogout}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={confirmLogout}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                  >
                                    Logout
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setSigninOpen(true)}
                          className="bg-gray-200 text-black font-semibold px-6 py-2 hover:bg-gray-300 transition"
                          style={{ borderRadius: '8px' }}
                        >
                          Sign In
                        </button>

                        <button
                          onClick={() => setSignupOpen(true)}
                          className="text-black font-semibold px-6 py-2 transition"
                          style={{
                            borderRadius: '8px',
                            backgroundColor: '#ffc107',
                          }}
                          onMouseEnter={e => (e.target.style.backgroundColor = '#e0ac00')}
                          onMouseLeave={e => (e.target.style.backgroundColor = '#ffc107')}
                        >
                          Sign Up
                        </button>

                      </div>



                    </>
                  )}
                </div>

                {isSignupOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                    <div className="relative w-[800px] h-[500px] mx-auto overflow-hidden rounded-2xl shadow-2xl flex">
                      {/* Close Button */}
                      <button
                        onClick={() => setSignupOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl z-20"
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      {/* Left Panel: Orange Gradient, Logo, Welcome Text */}
                      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-br from-yellow-400 to-orange-500 relative overflow-hidden">
                        {/* Logo */}
                        <div className="z-10 mb-6">
                          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="#fff" fillOpacity="0.15" />
                            <path d="M32 12L36 36H28L32 12Z" fill="#fff" />
                            <circle cx="32" cy="44" r="4" fill="#fff" />
                          </svg>
                        </div>
                        <h2 className="z-10 text-2xl font-bold text-white mb-2">Welcome!</h2>
                        <p className="z-10 text-white text-center max-w-xs">Sign up or sign in to continue your journey. Enjoy exclusive features and offers!</p>
                      </div>
                      {/* Right Panel: Form */}
                      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-4 overflow-auto">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Create your account</h3>
                        <SignupForm setSigninOpen={setSigninOpen} setSignupOpen={(value) => {
                          setSignupOpen(value);
                          if (!value) {
                            setSigninOpen(true);
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                )}

                {isSigninOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                    <div className="relative w-[800px] h-[420px] mx-auto overflow-hidden rounded-2xl shadow-2xl flex">
                      {/* Close Button */}
                      <button
                        onClick={() => setSigninOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl z-20"
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      {/* Left Panel: Orange Gradient, Logo, Welcome Text */}
                      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-br from-yellow-400 to-orange-500 relative overflow-hidden">
                        {/* Logo */}
                        <div className="z-10 mb-6">
                          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="#fff" fillOpacity="0.15" />
                            <path d="M32 12L36 36H28L32 12Z" fill="#fff" />
                            <circle cx="32" cy="44" r="4" fill="#fff" />
                          </svg>
                        </div>
                        <h2 className="z-10 text-2xl font-bold text-white mb-2">Welcome!</h2>
                        <p className="z-10 text-white text-center max-w-xs">Sign up or sign in to continue your journey. Enjoy exclusive features and offers!</p>
                      </div>
                      {/* Right Panel: Form */}
                      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-4 overflow-auto">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Sign in to your account</h3>
                        <SignIn setSigninOpen={(value) => {
                          setSigninOpen(value);
                          if (!value) {
                            setSignupOpen(true);
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Header End */}

      {/* Add PageHeader, Booking, Contact form and Google Map here following the same JSX style */}
    </div>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SignupForm from "../auth/SignupForm";
import SignIn from "../auth/SignIn";
import axios from "axios";
import { API_URL } from '../../config/api.config';
const Header = () => {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;

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

    // Check authentication status and fetch user data
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    console.log(token);

    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setUserName(response.data.username || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }

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
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
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
                      <Link
                        to="/"
                        className={`nav-item nav-link ${currentPath === "/" ? "text-warning fw-bold border-bottom border-warning" : ""}`}
                      >
                        Rooms
                      </Link>
                      <Link
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
                      </Link>
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
                <div className="d-flex align-items-center">
                  {isAuthenticated ? (
                    <>
                      <Link to="/HostHeader" className="btn btn-warning me-3 rounded-0 py-2 px-4">
                        <i className="fas fa-home me-2"></i> Join our Hoterlier
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
                                {userName ? userName.charAt(0).toUpperCase() : 'S'}
                              </div>
                            </button>

                            <span className="absolute -top-4 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                              2
                            </span>
                          </div>
                        </div>
                        {showUserMenu && (
                          <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden animate-fade-in">
                            {/* Top Section - User Info */}
                            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                              <p className="text-xs text-gray-500">Signed in as</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                            </div>

                            {/* Links Section */}
                            <div className="flex flex-col divide-y divide-gray-100">
                              <Link
                                to="/user-dashboard"
                                className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Dashboard
                              </Link>
                              <Link
                                to="/user-profile"
                                className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Profile
                              </Link>
                              <Link
                                to="/my-bookings"
                                className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                My Bookings
                              </Link>
                            </div>

                            {/* Logout Section */}
                            <div className="px-5 py-3">
                              <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors py-2 px-2 rounded-md"
                              >
                                <i className="fas fa-sign-out-alt w-5 mr-3"></i> Logout
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSignupOpen(true)}
                        className="btn btn-outline-light me-3 rounded-0 py-2 px-4"
                      >
                        Sign Up
                      </button>
                      <button
                        onClick={() => setSigninOpen(true)}
                        className="btn btn-outline-light rounded-0 py-2 px-4"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>

                {isSignupOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-fade-in">
                      {/* Close Button */}
                      <button
                        onClick={() => setSignupOpen(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        &times;
                      </button>

                      {/* Sign Up Title */}
                      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>

                      {/* Signup Form */}
                      <SignupForm />
                    </div>
                  </div>
                )}

                {isSigninOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md p-6 w-full max-w-md relative">
                      <button
                        onClick={() => setSigninOpen(false)}
                        className="absolute top-2 right-2 text-black text-xl"
                      >
                        &times;
                      </button>
                      <h2 className="text-lg font-bold mb-4">Sign In</h2>
                      {/* Replace below with your signin form */}
                      <SignIn />
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

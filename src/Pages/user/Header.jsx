import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SignupForm from "../auth/SignupForm";

const Header = () => {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isSigninOpen, setSigninOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {

    // Remove spinner after load
    const timer = setTimeout(() => {
      const spinner = document.getElementById("spinner");
      if (spinner) {
        spinner.style.display = "none";
      }
    }, 1000);

    // Initialize Bootstrap navbar
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener("click", () => {
        navbarCollapse.classList.toggle("show");
      });
    }

    return () => {
      clearTimeout(timer);
      // Clean up event listener
      if (navbarToggler) {
        navbarToggler.removeEventListener("click", () => { });
      }
    };
  }, []);

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
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="navbar-collapse" id="navbarCollapse">

                <div className="navbar-nav me-auto py-0">
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
                    <div className="dropdown-menu rounded-0 m-0">
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
                </div>
                <div className="d-flex">
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
                      <form>
                        <input type="email" placeholder="Email" className="border w-full mb-3 p-2" />
                        <input type="password" placeholder="Password" className="border w-full mb-3 p-2" />
                        <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded">
                          Login
                        </button>
                      </form>
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

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/Logo.jpg";

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Don't show navbar on login or register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <div className="bg-[#03112B] sticky top-0 z-50 shadow-md">
      <header className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h2 className="text-xl md:text-2xl font-bold m-0">
            <img
              src={logo}
              alt="Women in Tourism"
              className="h-20 "
              onClick={() => window.location.reload(navigate("/"))}
            />
          </h2>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                {user.role === "user" && (
                  <>
                    <Link
                      to="/home"
                      className={`${
                        window.location.pathname === "/home"
                          ? "text-blue-300"
                          : "text-white hover:text-blue-300"
                      }`}
                    >
                      Home
                    </Link>

                    <Link
                      to="/my-orders"
                      className={`${
                        window.location.pathname === "/my-orders"
                          ? "text-blue-300"
                          : "text-white hover:text-blue-300"
                      }`}
                    >
                      My Orders
                    </Link>
                  </>
                )}
                <Link
                  to={user.role === "admin" ? "/admin" : "/user"}
                  className={`${
                    window.location.pathname ===
                    (user.role === "admin" ? "/admin" : "/user")
                      ? "text-blue-300"
                      : "text-white hover:text-blue-300"
                  }`}
                >
                  Dashboard
                </Link>

                <button
                  onClick={onLogout}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/"
                  className="text-white cursor-pointer font-medium hover:text-blue-300 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 pb-4 space-y-3 md:hidden">
            {/* <Link
              to="/"
              className="block text-white font-medium hover:text-blue-300 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link> */}

            {user && (
              <>
                {/* <Link
                  to={user.role === "admin" ? "/admin" : "/user"}
                  className="block text-white font-medium hover:text-blue-300 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link> */}

                {user.role === "user" && (
                  <>
                    {/* <Link
                      to="/user-dashboard"
                      className="block text-white font-medium hover:text-blue-300 py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      User Dashboard
                    </Link> */}
                    <Link
                      to="/home"
                      className="block text-white font-medium hover:text-blue-300 py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                      // className={`${
                      //   window.location.pathname === "/home"
                      //     ? "text-blue-300"
                      //     : "text-white hover:text-blue-300"
                      // }`}
                    >
                      Home
                    </Link>

                    <Link
                      to="/my-orders"
                      className="block text-white font-medium hover:text-blue-300 py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  </>
                )}

                <Link
                  to={user.role === "admin" ? "/admin" : "/user"}
                  className="block text-white font-medium hover:text-blue-300 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left cursor-pointer rounded-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <nav className="mt-4 pb-4 grid  space-y-3 md:hidden">
             
       <Link
                    to="/"
                    className="text-white font-medium hover:text-blue-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>

                
           
                </nav>
              </>
              // <Link
              //   to="/login"
              //   className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              //   onClick={() => setIsMenuOpen(false)}
              // >
              //   Login
              // </Link>
            )}
          </nav>
        )}
      </header>
    </div>
  );
}

export default Navbar;

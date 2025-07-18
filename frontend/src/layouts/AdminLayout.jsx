/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FiSettings,
  FiFileText,
  FiList,
  FiPieChart,
  FiHome,
} from "react-icons/fi";

export default function AdminLayout({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (!token || !savedUser) {
          throw new Error("No authentication data found");
        }

        // First try to use the saved user data
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserData(parsedUser);
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }

        // Then validate with the server
        const response = await axios.get(
          `${baseUrl}/api/protected/current-user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Normalize user data structure
        const normalizedUser = {
          id:
            response.data?.id || response.data?._id || response.data?.user?._id,
          username: response.data?.username || response.data?.user?.username,
          role: response.data?.role || response.data?.user?.role,
          email: response.data?.email || response.data?.user?.email,
        };

        setUserData(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.pathname]); // Re-fetch when route changes

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">No user data available</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Sidebar */}
      <div className="w-[286px] min-h-screen bg-[#121212] flex flex-col">
        {/* Admin Profile */}
        <div className="px-6 py-8">
          <div className="flex items-center mb-2">
            {/* Profile Image Container */}
            <div className="mb-3">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage} // Direct Cloudinary URL
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    // e.target.src = '/default-profile.png';
                  }}
                />
              ) : (
                // <img
                //   src={`${baseUrl}/${userData.profileImage.replace(
                //     /\\/g,
                //     "/"
                //   )}`}
                //   alt="Profile"
                //   className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                // />
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}
            </div>

            <div className="ml-4">
              <h2 className="text-white text-2xl font-bold">
                {userData.username || "Admin"}
              </h2>
              <p className="text-gray-400 text-[12px]">
                {userData.email || "admin@example.com"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {userData.role || "admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 mt-6">
          <ul className="space-y-6">
            <li>
              <Link
                to="/admin"
                className={`text-white py-3 px-6 rounded-full w-full text-left flex items-center ${
                  window.location.pathname === "/admin" ? "bg-gray-600" : ""
                }`}
              >
                <FiHome className="mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-post"
                className={`text-white py-3 px-6 rounded-full w-full text-left flex items-center ${
                  window.location.pathname === "/admin/add-post"
                    ? "bg-gray-600"
                    : ""
                }`}
              >
                <span>ADD NEW POST</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className={`text-white py-3 px-6 rounded-full w-full text-left flex items-center ${
                  window.location.pathname === "/admin/orders"
                    ? "bg-gray-600"
                    : " "
                }`}
              >
                <FiList className="mr-3" />
                <span>My Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/summary"
                className={`text-white py-3 px-6 rounded-full w-full text-left flex items-center ${
                  window.location.pathname === "/admin/summary"
                    ? "bg-gray-600"
                    : ""
                }`}
              >
                <FiPieChart className="mr-3" />
                <span>Summary</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/accounts"
                className={`text-white py-3 px-6 rounded-full w-full text-left flex items-center ${
                  window.location.pathname === "/admin/accounts"
                    ? "bg-gray-600"
                    : " "
                }`}
              >
                <FiFileText className="mr-3" />
                <span>Accounts</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to="/admin/settings"
                className={`text-white py-3 px-6 rounded-full w-full text-left flex items-center ${
                  window.location.pathname === "/admin/settings"
                    ? "bg-gray-600"
                    : " "
                }`}
              >
                <FiSettings className="mr-3" />
                <span>Settings</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-tl-3xl rounded-bl-3xl p-8 relative">
        <Outlet />
      </div>
    </div>
  );
}

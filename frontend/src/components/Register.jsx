/* eslint-disable no-unused-vars */

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
    acceptTerms: false,
  });

  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
   const baseUrl = import.meta.env.VITE_API_BASE_URI ;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("role", formData.role);
    if (profileImage) {
      data.append("profileImage", profileImage); // Append image file
    }
    try {
  

      const res = await axios.post(
        `${baseUrl}/api/auth/register`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("User registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Home button */}
      <div className="absolute top-4 right-4">
        <button  onClick={() => navigate("/")} className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors">
          Home
        </button>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
        {/* Registration form */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
            <span className="border-b-2 border-blue-500">Re</span>gistration
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Enter your user name"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="phone number (e.g., +1234567890)"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                pattern="^\+[1-9]\d{1,14}$"
                title="Please enter a valid international phone number with country code"
              />

              <div className="mt-3">
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-500"
                >
                  I accept all terms & conditions
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register Now
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?
            <a href="/login" className="text-blue-500 ml-1 hover:underline">
              Login now
            </a>
          </div>
        </div>

        {/* Register now text */}
        <div className="mt-8 md:mt-0 md:ml-10 text-white text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            REGISTER
            <br />
            NOW WITH   US
            <br />
          
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Register;

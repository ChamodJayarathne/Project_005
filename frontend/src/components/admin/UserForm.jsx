

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiSave,
  FiUser,
  FiMail,
  FiShield,
  FiPhone,
  FiLock,
} from "react-icons/fi";

export default function UserForm() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    role: "user",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    if (userId && userId !== "create") {
      setIsEdit(true);
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        username: response.data.username,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || "",
        role: response.data.role,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswordChange = () => {
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const updatePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/api/auth/users/${userId}/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update password");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Update user info (excluding password)
      const payload = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
      };

      if (isEdit) {
        // First update regular user data
        await axios.put(`${baseUrl}/api/auth/users/${userId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Then handle password update if fields are shown and filled
        if (showPasswordFields && formData.newPassword) {
          if (!validatePasswordChange()) {
            return;
          }
          const passwordUpdated = await updatePassword();
          if (!passwordUpdated) {
            return;
          }
        }
      } else {
        // For new users, use the register endpoint
        await axios.post(
          `${baseUrl}/api/auth/register`,
          {
            ...payload,
            password: formData.newPassword || "defaultPassword",
            phoneNumber: formData.phoneNumber,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      navigate("/admin/accounts");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  // const updatePassword = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.post(
  //       `${baseUrl}/api/auth/change-password`,
  //       {
  //         currentPassword: formData.currentPassword,
  //         newPassword: formData.newPassword,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     return true;
  //   } catch (err) {
  //     setError(err.response?.data?.msg || "Failed to update password");
  //     return false;
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const token = localStorage.getItem("token");

  //     // Update user info (excluding password)
  //     const payload = {
  //       username: formData.username,
  //       email: formData.email,
  //       role: formData.role,
  //       phoneNumber: formData.phoneNumber,
  //     };

  //     if (isEdit) {
  //       // First update regular user data
  //       await axios.put(`${baseUrl}/api/auth/users/${userId}`, payload, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       // Then handle password update if fields are shown and filled
  //       if (showPasswordFields) {
  //         if (!validatePasswordChange()) {
  //           return;
  //         }
  //         const passwordUpdated = await updatePassword();
  //         if (!passwordUpdated) {
  //           return;
  //         }
  //       }
  //     } else {
  //       // For new users, use the register endpoint
  //       await axios.post(
  //         `${baseUrl}/api/auth/register`,
  //         {
  //           ...payload,
  //           password: formData.newPassword || "defaultPassword",
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //     }

  //     navigate("/admin/accounts");
  //   } catch (err) {
  //     setError(err.response?.data?.msg || "Failed to save user");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit User" : "Create New User"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Existing fields (username, email, phone, role) */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            <FiUser className="inline mr-2" />
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            <FiMail className="inline mr-2" />
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            <FiPhone className="inline mr-2" />
            Phone Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            <FiShield className="inline mr-2" />
            Role
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {isEdit && (
          <div className="mb-6">
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium mb-2"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields
                ? "Hide Password Change"
                : "Change Password..."}
            </button>

            {showPasswordFields && (
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="currentPassword"
                  >
                    <FiLock className="inline mr-2" />
                    Current Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    <FiLock className="inline mr-2" />
                    New Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    <FiLock className="inline mr-2" />
                    Confirm New Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!isEdit && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              <FiLock className="inline mr-2" />
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="submit"
            disabled={loading}
          >
            <FiSave className="mr-2" />
            {loading ? "Saving..." : "Save User"}
          </button>
        </div>
      </form>
    </div>
  );
}


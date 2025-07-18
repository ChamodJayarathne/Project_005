/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiShield,
  FiTrash2,
  FiEdit,
  FiDownload,
} from "react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import UserPdfDocument from "../UserPdfDocument";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Accounts</h1>
        <PDFDownloadLink
          document={<UserPdfDocument users={users} baseUrl={baseUrl} />}
          fileName="user-accounts-report.pdf"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {({ loading }) => (
            <>
              <FiDownload className="mr-2" />
              {loading ? "Preparing document..." : "Export to PDF"}
            </>
          )}
        </PDFDownloadLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow-md h-[300px] overflow-hidden relative hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/admin/users/${user._id}`)}
          >
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className=" p-3 rounded-full mr-4">
                  {user?.profileImage ? (
                    // <img
                    //   src={`${baseUrl}/${user.profileImage.replace(
                    //     /\\/g,
                    //     "/"
                    //   )}`}
                    //   alt="Profile"
                    //   className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    // />
                    <img
                      src={user.profileImage} // Direct Cloudinary URL
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        // e.target.src = "/default-profile.png"; // Fallback image
                      }}
                    />
                  ) : (
                    // <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                    //   <span className="text-gray-500 text-xs">No Image</span>
                    // </div>
                    <FiUser className="text-blue-600 text-xl" />
                  )}
                  {/* <FiUser className="text-blue-600 text-xl" /> */}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <FiMail className="mr-2" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <FiShield className="mr-2" />
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="flex items-center text-gray-600 text-sm mt-4">
                <span className="text-gray-500">Joined: </span>
                <span className="ml-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* <div>
                <h3 className="font-semibold text-lg">
                  Joined Date: {new Date(user.createdAt).toLocaleDateString()}
                </h3>
               
              </div> */}
            </div>

            <div className="bg-gray-50 px-6 py-3  absolute bottom-0 w-full flex justify-end space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/users/${user._id}/edit`);
                }}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(user._id);
                }}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

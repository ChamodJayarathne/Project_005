
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiSettings,
  FiPieChart,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";



export default function AdminDashboard() {

const baseUrl = import.meta.env.VITE_API_BASE_URI ;
  const [stats, setStats] = useState([
    {
      title: "Total Products",
      value: "0",
      icon: <FiPackage size={24} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Orders",
      value: "0",
      icon: <FiActivity size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Revenue",
      value: "Rs 0",
      icon: <FiDollarSign size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Users",
      value: "0",
      icon: <FiUsers size={24} />,
      color: "bg-orange-100 text-orange-600",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const endpoints = [
         `${baseUrl}/api/protected/admin/posts`,
          `${baseUrl}/api/protected/admin/orders`,
          `${baseUrl}/api/protected/admin/users`,
        ];

        const requests = endpoints.map((url) =>
          axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const [postsRes, ordersRes, usersRes] = await Promise.all(requests);

        // Calculate total revenue
        const totalRevenue = ordersRes.data.reduce((sum, order) => {
          return sum + (order.fullAmount || 0);
        }, 0);

        setStats([
          {
            title: "Total Products",
            value: postsRes.data.length.toString(),
            icon: <FiPackage size={24} />,
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Total Orders",
            value: ordersRes.data.length.toString(),
            icon: <FiActivity size={24} />,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Total Revenue",
            value: `Rs ${totalRevenue.toLocaleString()}`,
            icon: <FiDollarSign size={24} />,
            color: "bg-green-100 text-green-600",
          },
          {
            title: "Active Users",
            value: usersRes.data
              .filter((u) => u.role === "user")
              .length.toString(),
            icon: <FiUsers size={24} />,
            color: "bg-orange-100 text-orange-600",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to placeholder values
        setStats([
          {
            title: "Total Products",
            value: "N/A",
            icon: <FiPackage size={24} />,
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Total Orders",
            value: "N/A",
            icon: <FiActivity size={24} />,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Total Revenue",
            value: "$N/A",
            icon: <FiDollarSign size={24} />,
            color: "bg-green-100 text-green-600",
          },
          {
            title: "Active Users",
            value: "N/A",
            icon: <FiUsers size={24} />,
            color: "bg-orange-100 text-orange-600",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 flex items-center"
          >
            <div className={`p-3 rounded-full ${stat.color} mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/add-post"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <FiPackage size={20} className="mb-2" />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <FiActivity size={20} className="mb-2" />
            <span>View Orders</span>
          </Link>
          <Link
            to="/admin/accounts"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            <FiUsers size={20} className="mb-2" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/summary"
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
          >
            {/* <FiSettings size={20} className="mb-2" /> */}
            <FiPieChart size={20} className="mb-2" />
            <span>Summery</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      {/* <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
         
        </div>
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">4</span> of{" "}
            <span className="font-medium">24</span> orders
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

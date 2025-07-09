/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function UserForm() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user'
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    if (userId && userId !== 'create') {
      setIsEdit(true);
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(`${baseUrl}/api/auth/users/${userId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${baseUrl}/api/auth/register`, {
          ...formData,
          password: 'defaultPassword' // In a real app, you'd generate or require a password
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/accounts');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit User' : 'Create New User'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
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

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="submit"
            disabled={loading}
          >
            <FiSave className="mr-2" />
            {loading ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  );
}
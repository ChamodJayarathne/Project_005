/* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiSave,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiEye,
//   FiEyeOff,
// } from "react-icons/fi";

// export default function UserForm() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "user",
//     phoneNumber: "",
//   });
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (userId && userId !== "create") {
//       setIsEdit(true);
//       fetchUser();
//     }
//   }, [userId]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFormData({
//         username: response.data.username,
//         email: response.data.email,
//         password: response.data.password,
//         role: response.data.role,
//         phoneNumber: response.data.phoneNumber,
//       });
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (isEdit) {
//         await axios.put(`${baseUrl}/api/auth/users/${userId}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         await axios.post(
//           `${baseUrl}/api/auth/register`,
//           {
//             ...formData,
//             password: "defaultPassword", // In a real app, you'd generate or require a password
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       }
//       navigate("/admin/accounts");
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit User" : "Create New User"}
//       </h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             <FiUser className="inline mr-2" />
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             <FiMail className="inline mr-2" />
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="password"
//           >
//             <FiMail className="inline mr-2" />
//             Password
//           </label>
//           <div className="relative">
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="password"
//               // type="password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               ) : (
//                 <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="role"
//           >
//             <FiShield className="inline mr-2" />
//             Role
//           </label>
//           <select
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="phoneNumber"
//           >
//             <FiMail className="inline mr-2" />
//             Phone Number
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//             type="submit"
//             disabled={loading}
//           >
//             <FiSave className="mr-2" />
//             {loading ? "Saving..." : "Save User"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

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

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiSave,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiPhone,
//   FiLock,
// } from "react-icons/fi";

// export default function UserForm() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     phoneNumber: "",
//     role: "user",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [isEdit, setIsEdit] = useState(false);
//   const [showPasswordFields, setShowPasswordFields] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   useEffect(() => {
//     if (userId && userId !== "create") {
//       setIsEdit(true);
//       fetchUser();
//     }
//   }, [userId]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFormData({
//         username: response.data.username,
//         email: response.data.email,
//         phoneNumber: response.data.phoneNumber || "",
//         role: response.data.role,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validatePasswordChange = () => {
//     if (!formData.currentPassword) {
//       setError("Current password is required");
//       return false;
//     }
//     if (!formData.newPassword || formData.newPassword.length < 6) {
//       setError("New password must be at least 6 characters");
//       return false;
//     }
//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("New passwords do not match");
//       return false;
//     }
//     return true;
//   };

//   const updatePassword = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${baseUrl}/api/auth/change-password`,
//         {
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return true;
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to update password");
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       // Update user info (excluding password)
//       const payload = {
//         username: formData.username,
//         email: formData.email,
//         role: formData.role,
//         phoneNumber: formData.phoneNumber,
//       };

//       if (isEdit) {
//         // First update regular user data
//         await axios.put(`${baseUrl}/api/auth/users/${userId}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Then handle password update if fields are shown and filled
//         if (showPasswordFields) {
//           if (!validatePasswordChange()) {
//             return;
//           }
//           const passwordUpdated = await updatePassword();
//           if (!passwordUpdated) {
//             return;
//           }
//         }
//       } else {
//         // For new users, use the register endpoint
//         await axios.post(
//           `${baseUrl}/api/auth/register`,
//           {
//             ...payload,
//             password: formData.newPassword || "defaultPassword",
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       }

//       navigate("/admin/accounts");
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit User" : "Create New User"}
//       </h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         {/* Existing fields (username, email, phone, role) */}
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             <FiUser className="inline mr-2" />
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             <FiMail className="inline mr-2" />
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="phoneNumber"
//           >
//             <FiPhone className="inline mr-2" />
//             Phone Number
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="role"
//           >
//             <FiShield className="inline mr-2" />
//             Role
//           </label>
//           <select
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {isEdit && (
//           <div className="mb-6">
//             <button
//               type="button"
//               className="text-blue-500 hover:text-blue-700 text-sm font-medium mb-2"
//               onClick={() => setShowPasswordFields(!showPasswordFields)}
//             >
//               {showPasswordFields
//                 ? "Hide Password Change"
//                 : "Change Password..."}
//             </button>

//             {showPasswordFields && (
//               <div className="space-y-4">
//                 <div>
//                   <label
//                     className="block text-gray-700 text-sm font-bold mb-2"
//                     htmlFor="currentPassword"
//                   >
//                     <FiLock className="inline mr-2" />
//                     Current Password
//                   </label>
//                   <input
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     id="currentPassword"
//                     type="password"
//                     name="currentPassword"
//                     value={formData.currentPassword}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     className="block text-gray-700 text-sm font-bold mb-2"
//                     htmlFor="newPassword"
//                   >
//                     <FiLock className="inline mr-2" />
//                     New Password
//                   </label>
//                   <input
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     id="newPassword"
//                     type="password"
//                     name="newPassword"
//                     value={formData.newPassword}
//                     onChange={handleChange}
//                     minLength="6"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     className="block text-gray-700 text-sm font-bold mb-2"
//                     htmlFor="confirmPassword"
//                   >
//                     <FiLock className="inline mr-2" />
//                     Confirm New Password
//                   </label>
//                   <input
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     id="confirmPassword"
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     minLength="6"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {!isEdit && (
//           <div className="mb-6">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="newPassword"
//             >
//               <FiLock className="inline mr-2" />
//               Password
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="newPassword"
//               type="password"
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               minLength="6"
//               required
//             />
//           </div>
//         )}

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//             type="submit"
//             disabled={loading}
//           >
//             <FiSave className="mr-2" />
//             {loading ? "Saving..." : "Save User"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiSave,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiEye,
//   FiEyeOff,
//   FiPhone,
//   FiLock,
//   FiCopy,
// } from "react-icons/fi";

// export default function UserForm() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "user",
//     phoneNumber: "",
//   });
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (userId && userId !== "create") {
//       setIsEdit(true);
//       fetchUser();
//     }
//   }, [userId]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFormData({
//         username: response.data.username,
//         email: response.data.email,
//         password: response.data.password || "", // This will contain the plain text password from the database
//         role: response.data.role,
//         phoneNumber: response.data.phoneNumber,
//       });
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const copyPasswordToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(formData.password);
//       setSuccess("Password copied to clipboard!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       setError("Failed to copy password");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (isEdit) {
//         await axios.put(`${baseUrl}/api/auth/users/${userId}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuccess("User updated successfully!");
//       } else {
//         if (!formData.password.trim()) {
//           setError("Password is required for new users");
//           setLoading(false);
//           return;
//         }

//         await axios.post(`${baseUrl}/api/auth/register`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuccess("User created successfully!");
//       }

//       // Don't navigate immediately, let user see the success message
//       setTimeout(() => {
//         navigate("/admin/accounts");
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !formData.username) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit User" : "Create New User"}
//       </h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             <FiUser className="inline mr-2" />
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             <FiMail className="inline mr-2" />
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="password"
//           >
//             <FiLock className="inline mr-2" />
//             Password
//             {isEdit && (
//               <span className="text-gray-500 text-xs font-normal ml-2">
//                 (Current password shown)
//               </span>
//             )}
//           </label>
//           <div className="relative">
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-20"
//               id="password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder={isEdit ? "Current password" : "Enter password"}
//             />
//             <div className="absolute inset-y-0 right-0 flex items-center">
//               {formData.password && (
//                 <button
//                   type="button"
//                   className="px-2 text-gray-400 hover:text-gray-600"
//                   onClick={copyPasswordToClipboard}
//                   title="Copy password"
//                 >
//                   <FiCopy className="h-4 w-4" />
//                 </button>
//               )}
//               <button
//                 type="button"
//                 className="px-2 text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//                 title="Toggle password visibility"
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="h-5 w-5" />
//                 ) : (
//                   <FiEye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="phoneNumber"
//           >
//             <FiPhone className="inline mr-2" />
//             Phone Number
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             placeholder="+1234567890"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="role"
//           >
//             <FiShield className="inline mr-2" />
//             Role
//           </label>
//           <select
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center disabled:opacity-50"
//             type="submit"
//             disabled={loading}
//           >
//             <FiSave className="mr-2" />
//             {loading ? "Saving..." : "Save User"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/accounts")}
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiSave,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiEye,
//   FiEyeOff,
//   FiPhone,
//   FiLock,
//   FiCopy,
//   FiRefreshCw,
// } from "react-icons/fi";

// export default function UserForm() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "user",
//     phoneNumber: "",
//   });
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (userId && userId !== "create") {
//       setIsEdit(true);
//       fetchUser();
//     }
//   }, [userId]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFormData({
//         username: response.data.username,
//         email: response.data.email,
//         password: response.data.password || "", // This will now contain the plain text password
//         role: response.data.role,
//         phoneNumber: response.data.phoneNumber,
//       });
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const generateRandomPassword = () => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
//     let password = "";
//     for (let i = 0; i < 12; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setFormData((prev) => ({ ...prev, password }));
//   };

//   const copyPasswordToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(formData.password);
//       setSuccess("Password copied to clipboard!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       setError("Failed to copy password");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (isEdit) {
//         await axios.put(`${baseUrl}/api/auth/users/${userId}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuccess("User updated successfully!");
//       } else {
//         if (!formData.password.trim()) {
//           setError("Password is required for new users");
//           setLoading(false);
//           return;
//         }

//         await axios.post(`${baseUrl}/api/auth/register`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuccess("User created successfully!");
//       }

//       // Don't navigate immediately, let user see the success message
//       setTimeout(() => {
//         navigate("/admin/accounts");
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !formData.username) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit User" : "Create New User"}
//       </h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             <FiUser className="inline mr-2" />
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             <FiMail className="inline mr-2" />
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="password"
//           >
//             <FiLock className="inline mr-2" />
//             Password
//             {isEdit && (
//               <span className="text-gray-500 text-xs font-normal ml-2">
//                 (Current password is shown)
//               </span>
//             )}
//           </label>
//           <div className="relative">
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-20"
//               id="password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder={isEdit ? "Current password" : "Enter password"}
//             />
//             <div className="absolute inset-y-0 right-0 flex items-center">
//               {formData.password && (
//                 <button
//                   type="button"
//                   className="px-2 text-gray-400 hover:text-gray-600"
//                   onClick={copyPasswordToClipboard}
//                   title="Copy password"
//                 >
//                   <FiCopy className="h-4 w-4" />
//                 </button>
//               )}
//               <button
//                 type="button"
//                 className="px-2 text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//                 title="Toggle password visibility"
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="h-5 w-5" />
//                 ) : (
//                   <FiEye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="mt-2 flex items-center space-x-2">
//             <button
//               type="button"
//               onClick={generateRandomPassword}
//               className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded flex items-center"
//             >
//               <FiRefreshCw className="mr-1 h-3 w-3" />
//               Generate Random Password
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="phoneNumber"
//           >
//             <FiPhone className="inline mr-2" />
//             Phone Number
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             placeholder="+1234567890"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="role"
//           >
//             <FiShield className="inline mr-2" />
//             Role
//           </label>
//           <select
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center disabled:opacity-50"
//             type="submit"
//             disabled={loading}
//           >
//             <FiSave className="mr-2" />
//             {loading ? "Saving..." : "Save User"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/accounts")}
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiSave,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiEye,
//   FiEyeOff,
//   FiPhone,
//   FiLock,
//   FiCheck,
//   FiInfo,
// } from "react-icons/fi";

// export default function UserForm() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "user",
//     phoneNumber: "",
//   });
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [passwordInfo, setPasswordInfo] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (userId && userId !== "create") {
//       setIsEdit(true);
//       fetchUser();
//     }
//   }, [userId]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setFormData({
//         username: response.data.username,
//         email: response.data.email,
//         password: "",
//         role: response.data.role,
//         phoneNumber: response.data.phoneNumber,
//       });

//       // Set password info for display
//       if (response.data.createdAt) {
//         setPasswordInfo({
//           lastUpdated: response.data.updatedAt || response.data.createdAt,
//           hasPassword: true,
//         });
//       }
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (isEdit) {
//         const updateData = { ...formData };
//         if (!updateData.password.trim()) {
//           delete updateData.password;
//         }

//         await axios.put(`${baseUrl}/api/auth/users/${userId}`, updateData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         if (!formData.password.trim()) {
//           setError("Password is required for new users");
//           setLoading(false);
//           return;
//         }

//         await axios.post(`${baseUrl}/api/auth/register`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       navigate("/admin/accounts");
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit User" : "Create New User"}
//       </h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             <FiUser className="inline mr-2" />
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             <FiMail className="inline mr-2" />
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="password"
//           >
//             <FiLock className="inline mr-2" />
//             Password
//           </label>

//           {/* Current Password Status - Only shown in edit mode */}
//           {isEdit && passwordInfo && (
//             <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
//               <div className="flex items-center text-blue-700 mb-2">
//                 <FiCheck className="mr-2" />
//                 <span className="font-medium">Current Password Status</span>
//               </div>
//               <div className="text-sm text-blue-600">
//                 <p>• Password is set and secured</p>
//                 <p>
//                   • Last updated:{" "}
//                   {new Date(passwordInfo.lastUpdated).toLocaleDateString()}
//                 </p>
//                 <p>• Enter new password below to change it</p>
//               </div>
//             </div>
//           )}

//           <div className="relative">
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required={!isEdit}
//               placeholder={
//                 isEdit
//                   ? "Enter new password (leave empty to keep current)"
//                   : "Enter password"
//               }
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               ) : (
//                 <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               )}
//             </button>
//           </div>

//           {isEdit && (
//             <div className="mt-2 flex items-center text-sm text-gray-600">
//               <FiInfo className="mr-1" />
//               <span>Leave empty to keep the current password unchanged</span>
//             </div>
//           )}
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="phoneNumber"
//           >
//             <FiPhone className="inline mr-2" />
//             Phone Number
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             placeholder="+1234567890"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="role"
//           >
//             <FiShield className="inline mr-2" />
//             Role
//           </label>
//           <select
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center disabled:opacity-50"
//             type="submit"
//             disabled={loading}
//           >
//             <FiSave className="mr-2" />
//             {loading ? "Saving..." : "Save User"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/accounts")}
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiSave,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiEye,
//   FiEyeOff,
//   FiPhone,
//   FiLock,
// } from "react-icons/fi";

// export default function UserForm() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "user",
//     phoneNumber: "",
//   });
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (userId && userId !== "create") {
//       setIsEdit(true);
//       fetchUser();
//     }
//   }, [userId]);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFormData({
//         username: response.data.username,
//         email: response.data.email,
//         password: response.data.password || "", // This will be empty from backend
//         role: response.data.role,
//         phoneNumber: response.data.phoneNumber,
//       });
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to fetch user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (isEdit) {
//         // For editing, only send password if it's not empty
//         const updateData = { ...formData };
//         if (!updateData.password.trim()) {
//           delete updateData.password; // Don't update password if empty
//         }

//         await axios.put(`${baseUrl}/api/auth/users/${userId}`, updateData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         // For creating new user, password is required
//         if (!formData.password.trim()) {
//           setError("Password is required for new users");
//           setLoading(false);
//           return;
//         }

//         await axios.post(`${baseUrl}/api/auth/register`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       navigate("/admin/accounts");
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEdit ? "Edit User" : "Create New User"}
//       </h1>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="username"
//           >
//             <FiUser className="inline mr-2" />
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="email"
//           >
//             <FiMail className="inline mr-2" />
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="password"
//           >
//             <FiLock className="inline mr-2" />
//             Password{" "}
//             {isEdit && (
//               <span className="text-gray-500 text-xs">
//                 (leave empty to keep current password)
//               </span>
//             )}
//           </label>
//           <div className="relative">
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required={!isEdit} // Only required for new users
//               placeholder={
//                 isEdit ? "Enter new password (optional)" : "Enter password"
//               }
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               ) : (
//                 <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="phoneNumber"
//           >
//             <FiPhone className="inline mr-2" />
//             Phone Number
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="phoneNumber"
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             placeholder="+1234567890"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="role"
//           >
//             <FiShield className="inline mr-2" />
//             Role
//           </label>
//           <select
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center disabled:opacity-50"
//             type="submit"
//             disabled={loading}
//           >
//             <FiSave className="mr-2" />
//             {loading ? "Saving..." : "Save User"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/accounts")}
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

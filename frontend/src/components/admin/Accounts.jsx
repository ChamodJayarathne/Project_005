// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FiUser,
//   FiMail,
//   FiShield,
//   FiTrash2,
//   FiEdit,
//   FiDownload,
// } from "react-icons/fi";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import UserPdfDocument from "../UserPdfDocument";

// export default function Accounts() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`${baseUrl}/api/auth/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(response.data);
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${baseUrl}/api/auth/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(users.filter((user) => user._id !== userId));
//     } catch (err) {
//       setError(err.response?.data?.msg || "Failed to delete user");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     );

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">User Accounts</h1>
//         <PDFDownloadLink
//           document={<UserPdfDocument users={users} baseUrl={baseUrl} />}
//           fileName="user-accounts-report.pdf"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
//         >
//           {({ loading }) => (
//             <>
//               <FiDownload className="mr-2" />
//               {loading ? "Preparing document..." : "Export to PDF"}
//             </>
//           )}
//         </PDFDownloadLink>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {users.map((user) => (
//           <div
//             key={user._id}
//             className="bg-white rounded-lg shadow-md h-[300px] overflow-hidden relative hover:shadow-lg transition-shadow cursor-pointer"
//             onClick={() => navigate(`/admin/users/${user._id}`)}
//           >
//             <div className="p-6">
//               <div className="flex items-center mb-6">
//                 <div className=" p-3 rounded-full mr-4">
//                   {user?.profileImage ? (
//                     // <img
//                     //   src={`${baseUrl}/${user.profileImage.replace(
//                     //     /\\/g,
//                     //     "/"
//                     //   )}`}
//                     //   alt="Profile"
//                     //   className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
//                     // />
//                     <img
//                       src={user.profileImage} // Direct Cloudinary URL
//                       alt="Profile"
//                       className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         // e.target.src = "/default-profile.png"; // Fallback image
//                       }}
//                     />
//                   ) : (
//                     // <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
//                     //   <span className="text-gray-500 text-xs">No Image</span>
//                     // </div>
//                     <FiUser className="text-blue-600 text-xl" />
//                   )}
//                   {/* <FiUser className="text-blue-600 text-xl" /> */}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">{user.username}</h3>
//                   <p className="text-gray-500 text-sm">{user.role}</p>
//                 </div>
//               </div>

//               <div className="flex items-center text-gray-600 mb-2">
//                 <FiMail className="mr-2" />
//                 <span className="truncate">{user.email}</span>
//               </div>

//               <div className="flex items-center text-gray-600">
//                 <FiShield className="mr-2" />
//                 <span
//                   className={`px-2 py-1 text-xs rounded-full ${
//                     user.role === "admin"
//                       ? "bg-purple-100 text-purple-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {user.role}
//                 </span>
//               </div>

//               <div className="flex items-center text-gray-600 text-sm mt-4">
//                 <span className="text-gray-500">Joined: </span>
//                 <span className="ml-1">
//                   {new Date(user.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </span>
//               </div>

//               {/* <div>
//                 <h3 className="font-semibold text-lg">
//                   Joined Date: {new Date(user.createdAt).toLocaleDateString()}
//                 </h3>
               
//               </div> */}
//             </div>

//             <div className="bg-gray-50 px-6 py-3  absolute bottom-0 w-full flex justify-end space-x-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/admin/users/${user._id}/edit`);
//                 }}
//                 className="text-blue-600 hover:text-blue-800 p-1"
//               >
//                 <FiEdit size={18} />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(user._id);
//                 }}
//                 className="text-red-600 hover:text-red-800 p-1"
//               >
//                 <FiTrash2 size={18} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


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
  FiToggleLeft,
  FiToggleRight,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import UserPdfDocument from "../UserPdfDocument";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(`${baseUrl}/api/auth/users`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setUsers(response.data);
  //     } catch (err) {
  //       setError(err.response?.data?.msg || "Failed to fetch users");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // const handleDelete = async (userId) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`${baseUrl}/api/auth/users/${userId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUsers(users.filter((user) => user._id !== userId));
  //   } catch (err) {
  //     setError(err.response?.data?.msg || "Failed to delete user");
  //   }
  // };

  // const handleToggleStatus = async (userId, currentStatus) => {
  //   const newStatus = !currentStatus;
  //   const action = newStatus ? "enable" : "disable";
    
  //   if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

  //   try {
  //     setUpdatingStatus({ ...updatingStatus, [userId]: true });
  //     const token = localStorage.getItem("token");
      
  //     await axios.put(
  //       `${baseUrl}/api/auth/users/${userId}`,
  //       { isActive: newStatus },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // Update local state
  //     setUsers(users.map(user => 
  //       user._id === userId ? { ...user, isActive: newStatus } : user
  //     ));

  //     alert(`Account ${action}d successfully`);
  //   } catch (err) {
  //     alert(err.response?.data?.msg || `Failed to ${action} account`);
  //   } finally {
  //     setUpdatingStatus({ ...updatingStatus, [userId]: false });
  //   }
  // };

    const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch users");
      toast.error(err.response?.data?.msg || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      toast.success("User deleted successfully");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete user");
      toast.error(err.response?.data?.msg || "Failed to delete user");
    }
  };


  const handleToggleStatus = async (userId, currentStatus) => {
  const newStatus = !currentStatus;
  const action = newStatus ? "enable" : "disable";
  
  if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

  try {
    setUpdatingStatus({ ...updatingStatus, [userId]: true });
    const token = localStorage.getItem("token");
    
    // Use the dedicated PATCH endpoint for toggling status
    const response = await axios.patch(
      `${baseUrl}/api/auth/users/${userId}/toggle-status`,
      { isActive: newStatus },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log("Toggle status response:", response.data);

    // Update local state with the new status
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isActive: newStatus } : user
    ));

    // Show success message
    toast.success(response.data.msg || `Account ${action}d successfully`);
    
    // Optional: Refresh users from server to ensure consistency
    setTimeout(() => {
      fetchUsers();
    }, 500);

  } catch (err) {
    console.error("Error updating user status:", err);
    const errorMsg = err.response?.data?.msg || `Failed to ${action} account`;
    
    toast.error(errorMsg);
    
    // Revert local state on error
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isActive: currentStatus } : user
    ));
  } finally {
    setUpdatingStatus({ ...updatingStatus, [userId]: false });
  }
};

//  const handleToggleStatus = async (userId, currentStatus) => {
//     const newStatus = !currentStatus;
//     const action = newStatus ? "enable" : "disable";
    
//     if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

//     try {
//       setUpdatingStatus({ ...updatingStatus, [userId]: true });
//       const token = localStorage.getItem("token");
      
//       // Use PUT request to update the user with ALL required fields
//       const userToUpdate = users.find(user => user._id === userId);
//       if (!userToUpdate) {
//         throw new Error("User not found");
//       }

//       // Prepare update data with all required fields
//       const updateData = {
//         username: userToUpdate.username,
//         email: userToUpdate.email,
//         role: userToUpdate.role,
//         phoneNumber: userToUpdate.phoneNumber,
//         isActive: newStatus // This is the key change
//       };

//       console.log("Updating user with data:", updateData);
      
//       await axios.put(
//         `${baseUrl}/api/auth/users/${userId}`,
//         updateData,
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         }
//       );

//       // Update local state with the new status
//       setUsers(users.map(user => 
//         user._id === userId ? { ...user, isActive: newStatus } : user
//       ));

//       // Show success message
//       toast.success(`Account ${action}d successfully`);
      
//       // Refresh users from server to ensure consistency
//       setTimeout(() => {
//         fetchUsers();
//       }, 500);

//     } catch (err) {
//       console.error("Error updating user status:", err);
//       const errorMsg = err.response?.data?.msg || err.response?.data?.message || `Failed to ${action} account`;
      
//       // Show detailed error in console for debugging
//       if (err.response) {
//         console.error("Response error:", err.response.data);
//         console.error("Response status:", err.response.status);
//       }
      
//       toast.error(errorMsg);
      
//       // Revert local state on error
//       setUsers(users.map(user => 
//         user._id === userId ? { ...user, isActive: currentStatus } : user
//       ));
//     } finally {
//       setUpdatingStatus({ ...updatingStatus, [userId]: false });
//     }
//   }; 

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
            className={`bg-white rounded-lg shadow-md h-[340px] overflow-hidden relative hover:shadow-lg transition-shadow cursor-pointer ${
              !user.isActive ? "opacity-70 border-2 border-red-200" : ""
            }`}
            onClick={() => navigate(`/admin/users/${user._id}`)}
          >
            <div className="p-6">
              {/* Account Status Badge */}
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  user.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {user.isActive ? (
                    <>
                      <FiUnlock className="mr-1" size={10} />
                      Active
                    </>
                  ) : (
                    <>
                      <FiLock className="mr-1" size={10} />
                      Disabled
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full mr-4">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <FiUser className="text-blue-600 text-xl" />
                  )}
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

              <div className="flex items-center text-gray-600 mb-2">
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

              <div className="flex items-center text-gray-600 text-sm mt-4 mb-2">
                <span className="text-gray-500">Joined: </span>
                <span className="ml-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Account Status */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Account Status:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(user._id, user.isActive);
                    }}
                    disabled={updatingStatus[user._id]}
                    className={`flex items-center text-sm font-medium ${
                      user.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {updatingStatus[user._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                    ) : user.isActive ? (
                      <>
                        <FiToggleRight className="mr-1" size={20} />
                        Enabled
                      </>
                    ) : (
                      <>
                        <FiToggleLeft className="mr-1" size={20} />
                        Disabled
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 absolute bottom-0 w-full flex justify-end space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/users/${user._id}/edit`);
                }}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Edit User"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(user._id, user.isActive);
                }}
                className={`p-1 ${user.isActive ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}`}
                title={user.isActive ? "Disable Account" : "Enable Account"}
                disabled={updatingStatus[user._id]}
              >
                {user.isActive ? <FiLock size={18} /> : <FiUnlock size={18} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(user._id);
                }}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete User"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-gray-600">Total Accounts</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-gray-600">Active Accounts</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => !u.isActive).length}
            </div>
            <div className="text-gray-600">Disabled Accounts</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === "admin").length}
            </div>
            <div className="text-gray-600">Admin Accounts</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
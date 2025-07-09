/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Login from "./components/Login";
// import Register from "./components/Register";
// import AdminDashboard from "./components/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
// import GuestHome from "./components/GuestHome";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Dashboard from "./components/Dashboard";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import AdminLayout from "./layouts/AdminLayout";
// import AddNewPost from "./components/admin/AddNewPost";

// // import Summary from "./components/admin/Summary";
// import Accounts from "./components/admin/Accounts";
// import UserDetail from "./components/admin/UserDetail";
// import UserForm from "./components/admin/UserForm";
// import AdminOrders from "./components/admin/AdminOrders";
// import MyOrders from "./components/MyOrders";
// import OrderDetail from "./components/admin/OrderDetail";
// // import Settings from "./components/admin/Settings";

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("user"));
//     if (savedUser) setUser(savedUser);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <>
//       <Navbar user={user} onLogout={handleLogout} />
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<GuestHome />} />
//         <Route
//           path="/login"
//           element={
//             user ? (
//               <Navigate to={`/${user.role}`} />
//             ) : (
//               <Login setUser={setUser} />
//             )
//           }
//         />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute user={user} allowedRoles={["admin"]}>
//               <AdminLayout onLogout={handleLogout} />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminDashboard />} />
//           <Route path="add-post" element={<AddNewPost />} />

//           {/* <Route path="summary" element={<Summary />} />  */}
//           <Route path="accounts" element={<Accounts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="orders/:orderId" element={<OrderDetail />} />

//           <Route path="users/:userId" element={<UserDetail />} />
//           <Route path="users/create" element={<UserForm />} />
//           <Route path="users/:userId/edit" element={<UserForm />} />
//           {/* <Route path="settings" element={<Settings />} /> */}
//         </Route>
//         <Route
//           path="/user"
//           element={
//             <ProtectedRoute user={user} allowedRoles={["user"]}>
//               <UserDashboard onLogout={handleLogout} />
//             </ProtectedRoute>
//           }
//         />
//         {/* <Route
//           path="/user"
//           element={
//             <ProtectedRoute user={user} allowedRoles={["user"]}>
//               <Dashboard user={user} onLogout={handleLogout} />
//             </ProtectedRoute>
//           }
//         /> */}
//         <Route path="/user-dashboard" element={<Dashboard />} />
//         <Route path="/my-orders" element={<MyOrders />} />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import GuestHome from "./components/GuestHome";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./layouts/AdminLayout";
import AddNewPost from "./components/admin/AddNewPost";
import Accounts from "./components/admin/Accounts";
import UserDetail from "./components/admin/UserDetail";
import UserForm from "./components/admin/UserForm";
import AdminOrders from "./components/admin/AdminOrders";
import MyOrders from "./components/MyOrders";
import OrderDetail from "./components/admin/OrderDetail";
import EditPost from "./components/admin/EditPost";
import PostDetails from "./components/admin/PostDetails";
import AdminSummary from "./components/admin/AdminSummary";
import { RefreshProvider } from "./context/RefreshContext";

export default function App() {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available

    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get(
            `${baseUrl}/api/protected/current-user`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data) {
            // Normalize user data structure
            const userData = {
              id:
                response.data._id ||
                response.data.id ||
                response.data.user?._id ||
                response.data.user?.id,
              username: response.data.username || response.data.user?.username,
              role: response.data.role || response.data.user?.role,
              email: response.data.email || response.data.user?.email,
            };
            setUser(userData);
            // Store updated user data
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <RefreshProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<GuestHome />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={`/${user.role}`} />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminLayout onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="add-post" element={<AddNewPost />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="posts/:postId" element={<PostDetails />} />
            <Route path="posts/edit/:postId" element={<EditPost />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route path="users/create" element={<UserForm />} />
            <Route path="users/:userId/edit" element={<UserForm />} />
            <Route path="summary" element={<AdminSummary />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute user={user} allowedRoles={["user"]}>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute user={user} allowedRoles={["user"]}>
                <UserDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute user={user} allowedRoles={["user"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </RefreshProvider>
      <Footer user={user} onLogout={handleLogout} />
    </>
  );
}

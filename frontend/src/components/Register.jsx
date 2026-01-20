/* eslint-disable no-unused-vars */



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";

// function Register({ setUser }) { // Add setUser as prop
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     role: "user",
//     acceptTerms: false,
//   });

//   const [profileImage, setProfileImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setProfileImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const data = new FormData();
//     data.append("username", formData.username);
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     data.append("phoneNumber", formData.phoneNumber);
//     data.append("role", formData.role);
//     if (profileImage) {
//       data.append("profileImage", profileImage);
//     }
    
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/register`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("User registered successfully! Redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Registration failed");
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       setIsLoading(true);
//       console.log("Google token received, calling backend...");
      
//       const res = await axios.post(`${baseUrl}/api/auth/google`, {
//         token: credentialResponse.credential,
//       });

//       console.log("Backend response:", res.data);

//       // Store token and user data
//       localStorage.setItem("token", res.data.token);
      
//       const userData = {
//         id: res.data.user.id || res.data.user._id,
//         username: res.data.user.username,
//         role: res.data.user.role,
//         email: res.data.user.email,
//         profileImage: res.data.user.profileImage,
//         provider: res.data.user.provider || "google",
//       };

//       localStorage.setItem("user", JSON.stringify(userData));
      
//       // Update the user state in parent component (App.jsx)
//       if (setUser) {
//         setUser(userData);
//       }
      
//       toast.success("Registration with Google successful!");
      
//       // Redirect based on role
//       setTimeout(() => {
//         if (userData.role === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/user");
//         }
//       }, 1000);
      
//     } catch (err) {
//       console.error("Google auth error:", err);
//       if (err.response?.data?.errors) {
//         toast.error(err.response.data.errors.join(', '));
//       } else {
//         toast.error(err.response?.data?.msg || "Google registration failed");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     toast.error("Google Sign-Up failed. Please try again.");
//   };

//    const login = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: handleGoogleError,
//   });

//   return (
//     <GoogleOAuthProvider clientId={googleClientId}>
//       <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />

//         <div className="absolute top-4 right-4">
//           <button
//             onClick={() => navigate("/")}
//             className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
//           >
//             Home
//           </button>
//         </div>

//         <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
//               <span className="border-b-2 border-blue-500">Re</span>gistration
//             </h2>

//             {/* Google Sign-Up First */}
    

//             <form onSubmit={handleSubmit}>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Enter your user name"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Create password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   placeholder="phone number (e.g., +1234567890)"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                   pattern="^\+[1-9]\d{1,14}$"
//                   title="Please enter a valid international phone number with country code"
//                 />

//                 <div className="mt-3">
//                   <label className="block text-sm text-gray-600 mb-1">Role</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="user">User</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm text-gray-600 mb-1">
//                     Profile Image (Optional)
//                   </label>
//                   <input
//                     type="file"
//                     name="profileImage"
//                     onChange={handleFileChange}
//                     accept="image/*"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     name="acceptTerms"
//                     checked={formData.acceptTerms}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     required
//                   />
//                   <label
//                     htmlFor="terms"
//                     className="ml-2 block text-sm text-gray-500"
//                   >
//                     I accept all terms & conditions
//                   </label>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   Register Now
//                 </button>
//               </div>
//             </form>

//                     <div className="mb-6">

                      
//               <div className="flex items-center my-4">
//                 <div className="flex-grow border-t border-gray-300"></div>
//                 <div className="mx-4 text-gray-500">OR</div>
//                 <div className="flex-grow border-t border-gray-300"></div>
//               </div>
//               <div className="w-full">
//                 <button
//       onClick={() => login()}
//       disabled={isLoading}
//       className="w-full flex items-center justify-center gap-3
//                  rounded-2xl bg-white py-3
//                  border-0 outline-none
//                  text-gray-700 hover:bg-gray-50
//                  disabled:opacity-50 disabled:cursor-not-allowed
//                  transition"
//     >
//       <img
//         src="https://developers.google.com/identity/images/g-logo.png"
//         alt="Google"
//         className="w-5 h-5"
//       />
//       Sign up with Google
//     </button>
//                 {/* <GoogleLogin
//                   onSuccess={handleGoogleSuccess}
//                   onError={handleGoogleError}
//                   // useOneTap
//                   // theme="filled_blue"
//                   // size="large"
//                   // width="100%"
//                   // text="signup_with"
//                   // shape="rectangular"
//                   disabled={isLoading}
//                 /> */}
//                 {isLoading && (
//                   <div className="text-center mt-2 text-blue-500">
//                     Processing...
//                   </div>
//                 )}
//               </div>

//             </div>

//             <div className="mt-6 text-center text-gray-600 text-sm">
//               Already have an account?
//               <a href="/login" className="text-blue-500 ml-1 hover:underline">
//                 Login now
//               </a>
//             </div>
//           </div>

//           <div className="mt-8 md:mt-0 md:ml-10 text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               REGISTER
//               <br />
//               NOW WITH US
//             </h1>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// export default Register;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
    acceptTerms: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Debug: Log environment variables
  useEffect(() => {
    console.log("Google Client ID exists:", !!googleClientId);
    console.log("Base URL:", baseUrl);
  }, []);

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
    
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("role", formData.role);
    if (profileImage) {
      data.append("profileImage", profileImage);
    }
    
    try {
      const res = await axios.post(`${baseUrl}/api/auth/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("User registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential response:", credentialResponse);
      
      if (!credentialResponse.credential) {
        console.error("No credential in response");
        toast.error("No Google token received. Please try again.");
        return;
      }

      console.log("Google token received, calling backend...");
      console.log("Token length:", credentialResponse.credential.length);
      console.log("Token first 50 chars:", credentialResponse.credential.substring(0, 50) + "...");

      setIsLoading(true);
      
      const res = await axios.post(`${baseUrl}/api/auth/google`, {
        token: credentialResponse.credential,
      });

      console.log("Backend response:", res.data);

      // Store token and user data
      localStorage.setItem("token", res.data.token);
      
      const userData = {
        id: res.data.user.id || res.data.user._id,
        username: res.data.user.username,
        role: res.data.user.role,
        email: res.data.user.email,
        profileImage: res.data.user.profileImage,
        provider: res.data.user.provider || "google",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      
      // Update the user state in parent component (App.jsx)
      if (setUser) {
        setUser(userData);
      }
      
      toast.success("Registration with Google successful!");
      
      // Redirect based on role
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }, 1000);
      
    } catch (err) {
      console.error("Google auth error details:", err);
      console.error("Error response:", err.response?.data);
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (err.response?.data?.msg === "Google token is required") {
          toast.error("Google authentication failed. Token was empty or invalid.");
        } else if (err.response?.data?.msg === "Invalid Google token") {
          toast.error("Invalid Google token. Please try again.");
        } else if (err.response?.data?.msg?.includes("already registered")) {
          toast.error("This email is already registered. Please login instead.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error(err.response?.data?.msg || "Registration failed");
        }
      } else {
        toast.error("Google authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google login error:", error);
    toast.error("Google Sign-Up failed. Please try again.");
  };



  //Alternative: Direct Google Login hook
  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("Code response:", codeResponse);
      handleGoogleSuccess({ credential: codeResponse.access_token });
    },
    onError: handleGoogleError,
    flow: 'implicit',
  });

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
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

        <div className="absolute top-4 right-4">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
          >
            Home
          </button>
        </div>

        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
              <span className="border-b-2 border-blue-500">Re</span>gistration
            </h2>



            {/* Google Sign-Up First */}



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
                    Profile Image (Optional)
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

                        < div className="mb-6">

<div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="mx-4 text-gray-500">OR</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="w-full flex flex-col items-center border-0 outline-none gap-1">
                  <style jsx>{`
                    [data-testid="google-login-button"],
                    div[role="button"] {
                     border: none !important;
                  }
    
                 `}</style>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isLoading}
              />
              {isLoading && (
               <div className="text-center text-blue-500">
                       Processing Google authentication...
               </div>
              )}
             </div>

             
        
            </div>

            <div className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?
              <a href="/login" className="text-blue-500 ml-1 hover:underline">
                Login now
              </a>
            </div>
          </div>

          <div className="mt-8 md:mt-0 md:ml-10 text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              REGISTER
              <br />
              NOW WITH US
            </h1>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Register;




// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Register() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     role: "user",
//     acceptTerms: false,
//   });

//   const [profileImage, setProfileImage] = useState(null);

//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setProfileImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);

//     const data = new FormData();
//     data.append("username", formData.username);
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     data.append("phoneNumber", formData.phoneNumber);
//     data.append("role", formData.role);
//     if (profileImage) {
//       data.append("profileImage", profileImage); // Append image file
//     }
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/register`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("User registered successfully! Redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       {/* Home button */}
//       <div className="absolute top-4 right-4">
//         <button
//           onClick={() => navigate("/")}
//           className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
//         >
//           Home
//         </button>
//       </div>

//       {/* Main content */}
//       <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
//         {/* Registration form */}
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
//             <span className="border-b-2 border-blue-500">Re</span>gistration
//           </h2>

//           <form onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Enter your user name"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Create password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />

//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="phone number (e.g., +1234567890)"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 pattern="^\+[1-9]\d{1,14}$"
//                 title="Please enter a valid international phone number with country code"
//               />

//               <div className="mt-3">
//                 <label className="block text-sm text-gray-600 mb-1">Role</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="mt-4">
//                 <label className="block text-sm text-gray-600 mb-1">
//                   Profile Image
//                 </label>
//                 <input
//                   type="file"
//                   name="profileImage"
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   name="acceptTerms"
//                   checked={formData.acceptTerms}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   required
//                 />
//                 <label
//                   htmlFor="terms"
//                   className="ml-2 block text-sm text-gray-500"
//                 >
//                   I accept all terms & conditions
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Register Now
//               </button>
//             </div>
//           </form>

//           <div className="mt-6 text-center text-gray-600 text-sm">
//             Already have an account?
//             <a href="/login" className="text-blue-500 ml-1 hover:underline">
//               Login now
//             </a>
//           </div>
//         </div>

//         {/* Register now text */}
//         <div className="mt-8 md:mt-0 md:ml-10 text-white text-center md:text-left">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//             REGISTER
//             <br />
//             NOW WITH US
//             <br />
//           </h1>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

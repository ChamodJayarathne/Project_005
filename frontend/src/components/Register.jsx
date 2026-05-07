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

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Root ── */
  .auth-root {
    min-height: 100vh;
    width: 100%;
    background: #0a0a14;
    background-image:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,60,255,0.25) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0,200,255,0.15) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 60% 30%, rgba(255,60,140,0.08) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
    padding: 80px 16px 40px;
  }
  .auth-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E");
    pointer-events: none;
  }

  /* ── Orbs ── */
  .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; animation: floatOrb 8s ease-in-out infinite; }
  .orb-1 { width: 400px; height: 400px; background: rgba(99,60,255,0.18); top: -100px; left: -100px; animation-delay: 0s; }
  .orb-2 { width: 300px; height: 300px; background: rgba(0,200,255,0.12); bottom: -80px; right: -80px; animation-delay: -4s; }
  .orb-3 { width: 200px; height: 200px; background: rgba(255,100,180,0.1); top: 40%; right: 20%; animation-delay: -2s; }
  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-30px) scale(1.05); }
  }

  /* ── Home / Nav button ── */
  .auth-nav-btn {
    position: fixed;
    top: 16px;
    right: 165px;
    z-index: 200;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.85);
    padding: 7px 18px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: all 0.25s ease;
    text-decoration: none;
  }
  .auth-nav-btn:hover {
    background: rgba(255,255,255,0.13);
    border-color: rgba(255,255,255,0.25);
    color: #fff;
    transform: translateY(-1px);
  }

  /* ── Layout ── */
  .auth-layout {
    display: flex;
    align-items: center;
    gap: 64px;
    width: 100%;
    max-width: 980px;
    position: relative;
    z-index: 10;
    justify-content: center;
  }

  /* ── Hero (desktop only) ── */
  .auth-hero { flex: 1; display: none; min-width: 0; }

  .auth-hero-label {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(150,120,255,0.9);
    font-weight: 500;
    margin-bottom: 16px;
  }
  .auth-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(34px, 4vw, 58px);
    font-weight: 800;
    line-height: 1.05;
    color: #fff;
    margin: 0 0 20px 0;
  }
  .auth-hero-title span {
    background: linear-gradient(135deg, #a78bfa, #38bdf8, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-hero-sub { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.7; max-width: 300px; }

  /* ── Card ── */
  .auth-card {
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 36px 32px;
    backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,60,255,0.06);
  }

  /* ── Card header ── */
  .auth-card-eyebrow {
    font-size: 11px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(167,139,250,0.8);
    font-weight: 500;
    margin-bottom: 8px;
  }
  .auth-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 24px 0;
  }

  /* ── Inputs ── */
  .auth-input {
    width: 100%;
    padding: 12px 15px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }
  .auth-input::placeholder { color: rgba(255,255,255,0.3); }
  .auth-input:focus {
    border-color: rgba(167,139,250,0.6);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
  }
  .auth-input option { background: #1a1a2e; color: #fff; }

  .auth-label {
    display: block;
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    margin-bottom: 6px;
    letter-spacing: 0.3px;
  }

  /* ── Submit button ── */
  .auth-submit-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #7c3aed, #6366f1);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 24px rgba(124,58,237,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .auth-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,58,237,0.5); }
  .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  /* ── Spinner ── */
  .auth-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: authSpin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes authSpin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
  .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .auth-divider-text { font-size: 12px; color: rgba(255,255,255,0.25); letter-spacing: 1px; text-transform: uppercase; }

  /* ── Google wrapper ── */
  .auth-google-wrapper {
    display: flex;
    justify-content: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 6px;
    overflow: hidden;
    transition: all 0.2s;
  }
  .auth-google-wrapper:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }

  /* ── Footer row ── */
  .auth-footer-row { text-align: center; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.35); }
  .auth-footer-link { color: rgba(167,139,250,0.9); text-decoration: none; font-weight: 500; transition: color 0.2s; cursor: pointer; }
  .auth-footer-link:hover { color: #c4b5fd; }

  /* ── Checkbox row ── */
  .auth-checkbox-row { display: flex; align-items: center; gap: 8px; }
  .auth-checkbox-row input[type="checkbox"] { accent-color: #a78bfa; width: 15px; height: 15px; cursor: pointer; flex-shrink: 0; }
  .auth-checkbox-label { font-size: 13px; color: rgba(255,255,255,0.45); cursor: pointer; }

  /* ── Field spacing ── */
  .auth-space-y > * + * { margin-top: 12px; }

  /* ══════════════════════════════════════════
     TABLET  (≥768px) — show hero, side-by-side
     ══════════════════════════════════════════ */
  @media (min-width: 768px) {
    .auth-root   { padding: 60px 24px; }
    .auth-hero   { display: block; }
    .auth-layout { justify-content: flex-start; }
    .auth-card   { max-width: 440px; }
    .auth-nav-btn { top: 16px; right: 32px; }
  }

  /* ══════════════════════════════════════════
     MOBILE  (<640px)
     ══════════════════════════════════════════ */
  @media (max-width: 639px) {
    .auth-root   { padding: 72px 12px 36px; align-items: flex-start; }
    .auth-layout { gap: 0; }
    .auth-card   {
      padding: 24px 18px;
      border-radius: 18px;
      max-width: 100%;
    }
    .auth-card-title  { font-size: 21px; margin-bottom: 18px; }
    .auth-input       { padding: 12px 13px; font-size: 15px; }
    .auth-submit-btn  { padding: 13px; font-size: 14px; }
    .auth-space-y > * + * { margin-top: 10px; }
    .auth-nav-btn     { top: 12px; right: 12px; padding: 6px 14px; font-size: 12px; }
    .auth-footer-row  { font-size: 12px; }
  }

  /* ══════════════════════════════════════════
     XS  (<400px)
     ══════════════════════════════════════════ */
  @media (max-width: 399px) {
    .auth-root        { padding: 68px 10px 28px; }
    .auth-card        { padding: 20px 14px; border-radius: 14px; }
    .auth-card-title  { font-size: 19px; }
    .auth-input       { padding: 11px 12px; font-size: 14px; border-radius: 10px; }
    .auth-submit-btn  { padding: 12px; font-size: 13px; }
    .auth-space-y > * + * { margin-top: 9px; }
    .auth-nav-btn     { top: 10px; right: 10px; padding: 5px 12px; font-size: 11px; }
    .auth-checkbox-label { font-size: 12px; }
    .auth-footer-row  { font-size: 12px; margin-top: 16px; }
    .auth-divider     { margin: 14px 0; }
  }
`;

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", phoneNumber: "", role: "user", acceptTerms: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    console.log("Google Client ID exists:", !!googleClientId);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => setProfileImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("role", formData.role);
    if (profileImage) data.append("profileImage", profileImage);
    try {
      await axios.post(`${baseUrl}/api/auth/register`, data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) { toast.error("No Google token received."); return; }
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/auth/google`, { token: credentialResponse.credential });
      localStorage.setItem("token", res.data.token);
      const userData = {
        id: res.data.user.id || res.data.user._id,
        username: res.data.user.username, role: res.data.user.role,
        email: res.data.user.email, profileImage: res.data.user.profileImage,
        provider: res.data.user.provider || "google",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      if (setUser) setUser(userData);
      toast.success("Registration with Google successful!");
      setTimeout(() => navigate(userData.role === "admin" ? "/admin" : "/user"), 1000);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.msg?.includes("already registered")) {
        toast.error("This email is already registered. Please login instead.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(err.response?.data?.msg || "Google authentication failed.");
      }
    } finally { setIsLoading(false); }
  };

  const handleGoogleError = () => toast.error("Google Sign-Up failed. Please try again.");

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleSuccess({ credential: codeResponse.access_token }),
    onError: handleGoogleError,
    flow: 'implicit',
  });

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <style>{sharedStyles}</style>
      <div className="auth-root">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        <button className="auth-nav-btn" onClick={() => navigate("/")}>Home</button>

        <div className="auth-layout">
          {/* Hero */}
          <div className="auth-hero">
            <p className="auth-hero-label">Join us today</p>
            <h1 className="auth-hero-title">Register<br /><span>Now With Us</span></h1>
            <p className="auth-hero-sub">Create your account and start your journey with us in seconds.</p>
          </div>

          {/* Card */}
          <div className="auth-card">
            <p className="auth-card-eyebrow">Create Account</p>
            <h2 className="auth-card-title">Registration</h2>

            <form onSubmit={handleSubmit}>
              <div className="auth-space-y">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="auth-input" />
                <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required className="auth-input" />
                <input type="password" name="password" placeholder="Create password" value={formData.password} onChange={handleChange} required className="auth-input" />
                <input type="tel" name="phoneNumber" placeholder="Phone number (e.g. +1234567890)" value={formData.phoneNumber} onChange={handleChange} required pattern="^\+[1-9]\d{1,14}$" title="Enter a valid international number with country code" className="auth-input" />

                <div>
                  <label className="auth-label">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} required className="auth-input">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="auth-label">Profile Image (Optional)</label>
                  <input type="file" name="profileImage" onChange={handleFileChange} accept="image/*" className="auth-input" style={{ paddingTop: '10px' }} />
                </div>

                <div className="auth-checkbox-row">
                  <input type="checkbox" id="terms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} required />
                  <label htmlFor="terms" className="auth-checkbox-label">I accept all terms &amp; conditions</label>
                </div>

                <button type="submit" disabled={isLoading} className="auth-submit-btn">
                  {isLoading ? (
                    <><span className="auth-spinner" /> Processing...</>
                  ) : "Register Now"}
                </button>
              </div>
            </form>

            <div className="auth-divider">
              <div className="auth-divider-line" /><span className="auth-divider-text">or</span><div className="auth-divider-line" />
            </div>

            <div className="auth-google-wrapper">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="filled_black" shape="rectangular" width="360" disabled={isLoading} />
            </div>
            {isLoading && <p style={{ textAlign: 'center', color: 'rgba(167,139,250,0.8)', fontSize: 13, marginTop: 10 }}>Processing Google authentication...</p>}

            <div className="auth-footer-row">
              Already have an account?{" "}
              <a href="/login" className="auth-footer-link">Login now</a>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" theme="dark" toastStyle={{ background: "rgba(20,20,35,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }} />
    </GoogleOAuthProvider>
  );
}

export default Register;

////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";

// function Register({ setUser }) {
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

//   // Debug: Log environment variables
//   useEffect(() => {
//     console.log("Google Client ID exists:", !!googleClientId);
//     console.log("Base URL:", baseUrl);
//   }, []);

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
//       console.log("Google credential response:", credentialResponse);
      
//       if (!credentialResponse.credential) {
//         console.error("No credential in response");
//         toast.error("No Google token received. Please try again.");
//         return;
//       }

//       console.log("Google token received, calling backend...");
//       console.log("Token length:", credentialResponse.credential.length);
//       console.log("Token first 50 chars:", credentialResponse.credential.substring(0, 50) + "...");

//       setIsLoading(true);
      
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
//       console.error("Google auth error details:", err);
//       console.error("Error response:", err.response?.data);
      
//       // Handle specific error cases
//       if (err.response?.status === 400) {
//         if (err.response?.data?.msg === "Google token is required") {
//           toast.error("Google authentication failed. Token was empty or invalid.");
//         } else if (err.response?.data?.msg === "Invalid Google token") {
//           toast.error("Invalid Google token. Please try again.");
//         } else if (err.response?.data?.msg?.includes("already registered")) {
//           toast.error("This email is already registered. Please login instead.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else {
//           toast.error(err.response?.data?.msg || "Registration failed");
//         }
//       } else {
//         toast.error("Google authentication failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleError = (error) => {
//     console.error("Google login error:", error);
//     toast.error("Google Sign-Up failed. Please try again.");
//   };



//   //Alternative: Direct Google Login hook
//   const googleLogin = useGoogleLogin({
//     onSuccess: (codeResponse) => {
//       console.log("Code response:", codeResponse);
//       handleGoogleSuccess({ credential: codeResponse.access_token });
//     },
//     onError: handleGoogleError,
//     flow: 'implicit',
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

//                         < div className="mb-6">

// <div className="flex items-center my-4">
//                 <div className="flex-grow border-t border-gray-300"></div>
//                 <div className="mx-4 text-gray-500">OR</div>
//                 <div className="flex-grow border-t border-gray-300"></div>
//               </div>

//               <div className="w-full flex flex-col items-center border-0 outline-none gap-1">
//                   <style jsx>{`
//                     [data-testid="google-login-button"],
//                     div[role="button"] {
//                      border: none !important;
//                   }
    
//                  `}</style>
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
//                 disabled={isLoading}
//               />
//               {isLoading && (
//                <div className="text-center text-blue-500">
//                        Processing Google authentication...
//                </div>
//               )}
//              </div>

             
        
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
//////////////////////////////////



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

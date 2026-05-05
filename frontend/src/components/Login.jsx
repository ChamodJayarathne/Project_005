

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";

// function LoginPage({ setUser }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/login`, {
//         username,
//         password,
//       });

//       // Store token and user data
//       localStorage.setItem("token", res.data.token);

//       // Ensure consistent user data structure
//       const userData = {
//         id: res.data.user.id || res.data.user._id,
//         username: res.data.user.username,
//         role: res.data.user.role,
//         email: res.data.user.email,
//         profileImage: res.data.user.profileImage,
//         provider: res.data.user.provider || "local",
//       };

//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);

//       // Redirect based on role
//       if (userData.role === "admin") {
//         navigate("/admin");
//         toast.success("Admin Login successfully!");
//       } else {
//         navigate("/user");
//         toast.success("User Login successfully!");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Login failed");
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/google`, {
//         token: credentialResponse.credential,
//       });

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
//       setUser(userData);

//       // Redirect based on role
//       if (userData.role === "admin") {
//         navigate("/admin");
//         toast.success("Admin Login with Google successfully!");
//       } else {
//         navigate("/user");
//         toast.success("User Login with Google successfully!");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Google login failed");
//     }
//   };

//     const handleGoogleError = () => {
//     toast.error("Google Sign-In failed. Please try again.");

//   };

//     const login = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: handleGoogleError,
//     })



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

//         {/* Home button */}
//         <div className="absolute top-4 right-4">
//           <button
//             onClick={() => navigate("/")}
//             className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
//           >
//             Home
//           </button>
//         </div>

//         <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
//           <div className="mt-8 md:mt-0 mb-5 lg:hidden md:ml-10 text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <div>LOGIN NOW</div>
//             </h1>
//           </div>

//           {/* Registration form */}
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
//               <span className="border-b-2 border-blue-500">Lo</span>gin
//             </h2>

//             <form onSubmit={submitHandler}>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="remember"
//                       className="mr-2"
//                       required
//                     />
//                     <label htmlFor="remember" className="text-gray-500">
//                       Remember me
//                     </label>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-blue-500 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   Login
//                 </button>

//                 {/* Divider */}
//                 <div className="flex items-center my-4">
//                   <div className="flex-grow border-t border-gray-300"></div>
//                   <div className="mx-4 text-gray-500">OR</div>
//                   <div className="flex-grow border-t border-gray-300"></div>
//                 </div>

//                 {/* Google Sign-In Button */}

//                  <button
//       onClick={() => login()}
//       className="w-full flex items-center justify-center gap-3
//                  rounded-2xl bg-white py-3
//                  border border-transparent
//                  text-gray-700 hover:bg-gray-50
//                  transition"
//     >
//       <img
//         src="https://developers.google.com/identity/images/g-logo.png"
//         alt="Google"
//         className="w-5 h-5"
//       />
//       Continue with Google
//     </button>
       
//                   {/* <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     // useOneTap
//                     // theme="filled_blue"
//                     // size="large"
//                     // width="100%"
//                     // text="signin_with"
//                     // shape="rectangular"
// className="w-full border-none outline-none shadow-none"
//                   /> */}
           
//               </div>
//             </form>

//             <div className="mt-6 text-center text-gray-600 text-sm">
//               Not a member?
//               <a href="/register" className="text-blue-500 ml-1 hover:underline">
//                 Register now
//               </a>
//             </div>
//           </div>

//           {/* Register now text */}
//           <div className="mt-8 md:mt-0 md:ml-10 md:block hidden text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <div>LOGIN NOW</div>
//             </h1>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// export default LoginPage;

// components/Login.jsx


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      const userData = {
        id: res.data.user.id || res.data.user._id,
        username: res.data.user.username,
        role: res.data.user.role,
        email: res.data.user.email,
        profileImage: res.data.user.profileImage,
        provider: res.data.user.provider || "local",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      if (userData.role === "admin") {
        navigate("/admin");
        toast.success("Admin Login successfully!");
      } else {
        navigate("/user");
        toast.success("User Login successfully!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Login failed";
      if (err.response?.status === 403 && err.response?.data?.msg?.includes("disabled")) {
        toast.error("Your account is disabled. Please contact administrator.");
      } else if (err.response?.status === 400 && err.response?.data?.msg === "Please use Google Sign-In for this account") {
        toast.error("This account uses Google Sign-In. Please use Google to login.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      if (!credentialResponse.credential) {
        toast.error("No Google token received");
        return;
      }
      const res = await axios.post(`${baseUrl}/api/auth/google`, { token: credentialResponse.credential });
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
      setUser(userData);
      if (userData.role === "admin") {
        navigate("/admin");
        toast.success("Admin Login with Google successfully!");
      } else {
        navigate("/user");
        toast.success("User Login with Google successfully!");
      }
    } catch (err) {
      console.error("Google login error:", err);
      if (err.response?.status === 400 && err.response?.data?.msg === "Please use Google Sign-In for this account") {
        toast.error("This email is registered with Google. Please use Google Sign-In.");
      } else if (err.response?.status === 409) {
        toast.error("This email is already registered. Please login with your password or reset password.");
      } else {
        toast.error(err.response?.data?.msg || "Google login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In failed. Please try again.");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          width: 100%;
          background: #0a0a14;
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99, 60, 255, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0, 200, 255, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 30%, rgba(255, 60, 140, 0.08) 0%, transparent 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: rgba(99, 60, 255, 0.18);
          top: -100px; left: -100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: rgba(0, 200, 255, 0.12);
          bottom: -80px; right: -80px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: rgba(255, 100, 180, 0.1);
          top: 40%; right: 20%;
          animation-delay: -2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Home button */
        .home-btn {
          position: fixed;
          top: 20px;
          right: 24px;
          z-index: 100;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          padding: 8px 22px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-block;
        }
        .home-btn:hover {
          background: rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.25);
          color: #fff;
          transform: translateY(-1px);
        }

        /* Layout */
        .login-layout {
          display: flex;
          align-items: center;
          gap: 64px;
          width: 100%;
          max-width: 960px;
          padding: 40px 24px;
          position: relative;
          z-index: 10;
        }

        /* Hero text */
        .hero-text {
          flex: 1;
          display: none;
        }
        @media (min-width: 768px) {
          .hero-text { display: block; }
        }
        .hero-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(150, 120, 255, 0.9);
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 800;
          line-height: 1.05;
          color: #fff;
          margin: 0 0 20px 0;
        }
        .hero-title span {
          background: linear-gradient(135deg, #a78bfa, #38bdf8, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          max-width: 300px;
        }

        /* Card */
        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 40px 36px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 80px rgba(0,0,0,0.5),
            0 0 60px rgba(99, 60, 255, 0.06);
        }

        .card-header {
          margin-bottom: 32px;
        }
        .card-eyebrow {
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(167, 139, 250, 0.8);
          font-weight: 500;
          margin-bottom: 8px;
        }
        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        /* Inputs */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
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
        .input-field::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .input-field:focus {
          border-color: rgba(167, 139, 250, 0.6);
          background: rgba(255,255,255,0.09);
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
        }

        /* Row */
        .options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
        }
        .remember-label input[type="checkbox"] {
          accent-color: #a78bfa;
          width: 15px;
          height: 15px;
        }
        .forgot-link {
          font-size: 13px;
          color: rgba(167, 139, 250, 0.85);
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover {
          color: #c4b5fd;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 14px;
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
          box-shadow: 0 4px 24px rgba(124, 58, 237, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.5);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Google button wrapper */
        .google-wrapper {
          display: flex;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 6px;
          transition: all 0.2s;
        }
        .google-wrapper:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
        }

        /* Register link */
        .register-row {
          text-align: center;
          margin-top: 28px;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }
        .register-link {
          color: rgba(167, 139, 250, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .register-link:hover {
          color: #c4b5fd;
        }
      `}</style>

      <div className="login-root">
        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Home button */}
        <a onClick={() => navigate("/")} className="home-btn">Home</a>

        <div className="login-layout">
          {/* Hero Text */}
          <div className="hero-text">
            <p className="hero-label">Welcome back</p>
            <h1 className="hero-title">
              Login<br /><span>Now</span>
            </h1>
            <p className="hero-sub">Access your account and pick up right where you left off.</p>
          </div>

          {/* Card */}
          <div className="login-card">
            <div className="card-header">
              <p className="card-eyebrow">Account Access</p>
              <h2 className="card-title">Sign In</h2>
            </div>

            <form onSubmit={submitHandler}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div className="options-row">
                <label className="remember-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <span className="forgot-link" onClick={handleForgotPassword}>
                  Forgot password?
                </span>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <GoogleOAuthProvider clientId={googleClientId}>
              <div className="google-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="rectangular"
                  width="340"
                />
              </div>
            </GoogleOAuthProvider>

            <div className="register-row">
              Not a member?{" "}
              <Link to="/register" className="register-link">Register now</Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        theme="dark"
        toastStyle={{
          background: "rgba(20,20,35,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      />
    </>
  );
}

export default LoginPage;

//////////////////////

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// function LoginPage({ setUser }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/login`, {
//         username,
//         password,
//       });

//       // Store token and user data
//       localStorage.setItem("token", res.data.token);

//       const userData = {
//         id: res.data.user.id || res.data.user._id,
//         username: res.data.user.username,
//         role: res.data.user.role,
//         email: res.data.user.email,
//         profileImage: res.data.user.profileImage,
//         provider: res.data.user.provider || "local",
//       };

//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);

//       if (userData.role === "admin") {
//         navigate("/admin");
//         toast.success("Admin Login successfully!");
//       } else {
//         navigate("/user");
//         toast.success("User Login successfully!");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.msg || "Login failed";
      
//       // Handle specific error messages
//       if (err.response?.status === 403 && err.response?.data?.msg?.includes("disabled")) {
//         toast.error("Your account is disabled. Please contact administrator.");
//       } else if (err.response?.status === 400 && err.response?.data?.msg === "Please use Google Sign-In for this account") {
//         toast.error("This account uses Google Sign-In. Please use Google to login.");
//       } else {
//         toast.error(errorMsg);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setIsLoading(true);
    
//     try {
//       if (!credentialResponse.credential) {
//         toast.error("No Google token received");
//         return;
//       }

//       const res = await axios.post(`${baseUrl}/api/auth/google`, {
//         token: credentialResponse.credential,
//       });

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
//       setUser(userData);

//       if (userData.role === "admin") {
//         navigate("/admin");
//         toast.success("Admin Login with Google successfully!");
//       } else {
//         navigate("/user");
//         toast.success("User Login with Google successfully!");
//       }
//     } catch (err) {
//       console.error("Google login error:", err);
      
//       if (err.response?.status === 400 && err.response?.data?.msg === "Please use Google Sign-In for this account") {
//         toast.error("This email is registered with Google. Please use Google Sign-In.");
//       } else if (err.response?.status === 409) {
//         toast.error("This email is already registered. Please login with your password or reset password.");
//       } else {
//         toast.error(err.response?.data?.msg || "Google login failed");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     toast.error("Google Sign-In failed. Please try again.");
//   };

//   // Forgot password handler
//   const handleForgotPassword = () => {
//     navigate("/forgot-password");
//   };

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

//         {/* Home button */}
//         <div className="absolute top-4 right-4">
//           <button
//             onClick={() => navigate("/")}
//             className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
//           >
//             Home
//           </button>
//         </div>

//         <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
//           <div className="mt-8 md:mt-0 mb-5 lg:hidden md:ml-10 text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <div>LOGIN NOW</div>
//             </h1>
//           </div>

//           {/* Login form */}
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
//               <span className="border-b-2 border-blue-500">Lo</span>gin
//             </h2>

//             <form onSubmit={submitHandler}>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Username or Email"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="remember"
//                       className="mr-2"
//                     />
//                     <label htmlFor="remember" className="text-gray-500">
//                       Remember me
//                     </label>
//                   </div>
                  
//                   {/* Forgot Password Link */}
//                   <button
//                     type="button"
//                     onClick={handleForgotPassword}
//                     className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full ${
//                     isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
//                   } text-white py-3 rounded-lg transition-colors flex items-center justify-center`}
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Logging in...
//                     </>
//                   ) : (
//                     'Login'
//                   )}
//                 </button>

//                 {/* Divider */}
//                 <div className="flex items-center my-4">
//                   <div className="flex-grow border-t border-gray-300"></div>
//                   <div className="mx-4 text-gray-500">OR</div>
//                   <div className="flex-grow border-t border-gray-300"></div>
//                 </div>

//                 {/* Google Sign-In Button */}
//                 <div className="w-full">
//                   <div className="w-full flex flex-col items-center border-0 outline-none gap-1">
//                     <GoogleLogin
//                       onSuccess={handleGoogleSuccess}
//                       onError={handleGoogleError}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </form>

//             <div className="mt-6 text-center text-gray-600 text-sm">
//               Not a member?
//               <Link to="/register" className="text-blue-500 ml-1 hover:underline">
//                 Register now
//               </Link>
//             </div>
//           </div>

//           {/* Login now text */}
//           <div className="mt-8 md:mt-0 md:ml-10 md:block hidden text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <div>LOGIN NOW</div>
//             </h1>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// export default LoginPage;
//////////////////////////////

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// function LoginPage({ setUser }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;
//   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/login`, {
//         username,
//         password,
//       });

//       // Store token and user data
//       localStorage.setItem("token", res.data.token);

//       // Ensure consistent user data structure
//       const userData = {
//         id: res.data.user.id || res.data.user._id,
//         username: res.data.user.username,
//         role: res.data.user.role,
//         email: res.data.user.email,
//         profileImage: res.data.user.profileImage,
//         provider: res.data.user.provider || "google",
//       };

//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);

//       // Redirect based on role
//       if (userData.role === "admin") {
//         navigate("/admin");
//         toast.success("Admin Login successfully!");
//       } else {
//         navigate("/user");
//         toast.success("User Login successfully!");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Login failed");
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       console.log("Google credential response:", credentialResponse);
      
//       if (!credentialResponse.credential) {
//         toast.error("No Google token received");
//         return;
//       }

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
//       setUser(userData);

//       // Redirect based on role
//       if (userData.role === "admin") {
//         navigate("/admin");
//         toast.success("Admin Login with Google successfully!");
//       } else {
//         navigate("/user");
//         toast.success("User Login with Google successfully!");
//       }
//     } catch (err) {
//       console.error("Google login error:", err);
//       console.error("Error response:", err.response?.data);
      
//       // Check if user exists and needs to login with password
//       if (err.response?.status === 400 && err.response?.data?.msg === "Please use Google Sign-In for this account") {
//         toast.error("This email is registered with Google. Please use Google Sign-In.");
//       } else if (err.response?.data?.msg === "Google token is required") {
//         toast.error("Google authentication failed. Please try again.");
//       } else {
//         toast.error(err.response?.data?.msg || "Google login failed");
//       }
//     }
//   };

//   const handleGoogleError = () => {
//     console.error("Google login failed");
//     toast.error("Google Sign-In failed. Please try again.");
//   };

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

//         {/* Home button */}
//         <div className="absolute top-4 right-4">
//           <button
//             onClick={() => navigate("/")}
//             className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
//           >
//             Home
//           </button>
//         </div>

//         <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
//           <div className="mt-8 md:mt-0 mb-5 lg:hidden md:ml-10 text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <div>LOGIN NOW</div>
//             </h1>
//           </div>

//           {/* Registration form */}
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
//               <span className="border-b-2 border-blue-500">Lo</span>gin
//             </h2>

//             <form onSubmit={submitHandler}>
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="remember"
//                       className="mr-2"
//                       required
//                     />
//                     <label htmlFor="remember" className="text-gray-500">
//                       Remember me
//                     </label>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-blue-500 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   Login
//                 </button>

//                 {/* Divider */}
//                 <div className="flex items-center my-4">
//                   <div className="flex-grow border-t border-gray-300"></div>
//                   <div className="mx-4 text-gray-500">OR</div>
//                   <div className="flex-grow border-t border-gray-300"></div>
//                 </div>

//                 {/* Google Sign-In Button */}
//                 <div className="w-full">
//                      <div className="w-full flex flex-col items-center border-0 outline-none gap-1">
//                   <style jsx>{`
//                     [data-testid="google-login-button"],
//                     div[role="button"] {
//                      border: none !important;
//                   }
    
//                  `}</style>
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     // theme="filled_blue"
//                     // size="large"
//                     // width="100%"
//                     // text="signin_with"
//                     // shape="rectangular"
//                   />
//                 </div>
//                  </div>
//               </div>
//             </form>

//             <div className="mt-6 text-center text-gray-600 text-sm">
//               Not a member?
//               <a href="/register" className="text-blue-500 ml-1 hover:underline">
//                 Register now
//               </a>
//             </div>
//           </div>

//           {/* Register now text */}
//           <div className="mt-8 md:mt-0 md:ml-10 md:block hidden text-white text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <div>LOGIN NOW</div>
//             </h1>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// export default LoginPage;


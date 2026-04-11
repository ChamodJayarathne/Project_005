

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
      const res = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });

      // Store token and user data
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
      
      // Handle specific error messages
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

      const res = await axios.post(`${baseUrl}/api/auth/google`, {
        token: credentialResponse.credential,
      });

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

  // Forgot password handler
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

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

        {/* Home button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-300 text-white px-6 py-2 rounded-full hover:bg-indigo-400 transition-colors"
          >
            Home
          </button>
        </div>

        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
          <div className="mt-8 md:mt-0 mb-5 lg:hidden md:ml-10 text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <div>LOGIN NOW</div>
            </h1>
          </div>

          {/* Login form */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
              <span className="border-b-2 border-blue-500">Lo</span>gin
            </h2>

            <form onSubmit={submitHandler}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="mr-2"
                    />
                    <label htmlFor="remember" className="text-gray-500">
                      Remember me
                    </label>
                  </div>
                  
                  {/* Forgot Password Link */}
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white py-3 rounded-lg transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <div className="mx-4 text-gray-500">OR</div>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Sign-In Button */}
                <div className="w-full">
                  <div className="w-full flex flex-col items-center border-0 outline-none gap-1">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">
              Not a member?
              <Link to="/register" className="text-blue-500 ml-1 hover:underline">
                Register now
              </Link>
            </div>
          </div>

          {/* Login now text */}
          <div className="mt-8 md:mt-0 md:ml-10 md:block hidden text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <div>LOGIN NOW</div>
            </h1>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;


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


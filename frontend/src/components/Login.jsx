import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });

      // Store token and user data
      localStorage.setItem("token", res.data.token);

      // Ensure consistent user data structure
      const userData = {
        id: res.data.user.id || res.data.user._id,
        username: res.data.user.username,
        role: res.data.user.role,
        email: res.data.user.email,
        profileImage: res.data.user.profileImage,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin");
        toast.success("Admin Login successfully!");
        console.log("Login response:", res.data);
      } else {
        navigate("/user");
        toast.success("User Login successfully!");
        console.log("Login response:", res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    // Main container with exact blue background
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
            {/* <div></div> */}
          </h1>
        </div>
        {/* Registration form */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-medium text-gray-700 mb-6 border-b pb-2">
            <span className="border-b-2 border-blue-500">Lo</span>gin
          </h2>

          <form onSubmit={submitHandler}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
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
                    className="mr-2 "
                    required
                  />
                  <label htmlFor="remember" className="text-gray-500">
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm">
            Not a member?
            <a href="/register" className="text-blue-500 ml-1 hover:underline">
              Register now
            </a>
          </div>
        </div>

        {/* Register now text */}
        <div className="mt-8 md:mt-0 md:ml-10 md:block hidden text-white text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <div>LOGIN NOW</div>
            {/* <div></div> */}
          </h1>
        </div>
      </div>

      {/* Content container */}
      <div className="flex-grow   hidden items-center justify-between px-6 py-8">
        <div className="bg-white  rounded-lg p-8 shadow-lg w-full max-w-md mx-auto md:mx-0 md:ml-16">
          <h2 className="text-2xl font-bold mb-8">Login</h2>

          {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

          <form onSubmit={submitHandler}>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-400"
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-400"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-500">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#6E62E6] to-[#AA5CFF] text-white font-medium text-lg"
            >
              Login
            </button>

            <div className="text-center mt-6 text-gray-500">
              Not a member?{" "}
              <a href="/register" className="text-blue-400 hover:underline">
                Signup now
              </a>
            </div>
          </form>
        </div>

        {/* Right side text */}
        <div className="hidden md:block md:flex-1">
          <div className="text-white text-7xl lg:text-8xl font-bold text-center md:text-right md:mr-16">
            <div>LOGIN NOW</div>
            {/* <div>NOW</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password`, {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.msg);
        setIsSubmitted(true);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to send reset link";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Back button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
        >
          ← Back to Login
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your registered email"
              />
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-semibold">{email}</span>.
              Please check your inbox and follow the instructions.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Resend Email
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-gray-600 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
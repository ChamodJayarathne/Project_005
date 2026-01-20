import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const id = params.get("id");
      const username = params.get("username");
      const role = params.get("role");
      const email = params.get("email");
      const profileImage = params.get("profileImage");

      if (token) {
        // Store token and user data
        localStorage.setItem("token", token);
        
        const userData = {
          id,
          username,
          role,
          email,
          profileImage,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        
        // Redirect based on role
        if (role === "admin") {
          navigate("/admin");
          toast.success("Admin login successful!");
        } else {
          navigate("/user");
          toast.success("Login successful!");
        }
      } else {
        navigate("/login");
        toast.error("Authentication failed");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
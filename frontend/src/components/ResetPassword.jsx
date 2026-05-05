// // components/ResetPassword.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function ResetPassword() {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isValidToken, setIsValidToken] = useState(null);
//   const [isResetting, setIsResetting] = useState(false);

//   const { token } = useParams();
//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   // Validate token on component mount
//   useEffect(() => {
//     const validateToken = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}/api/auth/reset-password/${token}`);
//         if (res.data.success) {
//           setIsValidToken(true);
//         }
//       } catch (err) {
//         setIsValidToken(false);
//         toast.error(err.response?.data?.msg || "Invalid or expired reset link");
//       }
//     };

//     if (token) {
//       validateToken();
//     }
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Validation
//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       setIsLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsResetting(true);
//       const res = await axios.post(`${baseUrl}/api/auth/reset-password/${token}`, {
//         password,
//         confirmPassword,
//       });

//       if (res.data.success) {
//         toast.success(res.data.msg);

//         // Redirect to login after 3 seconds
//         setTimeout(() => {
//           navigate("/login");
//         }, 3000);
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.msg || "Failed to reset password";
//       toast.error(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isValidToken === null) {
//     return (
//       <div className="min-h-screen bg-blue-600 flex items-center justify-center">
//         <div className="text-white text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
//           <p className="mt-4">Validating reset link...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isValidToken) {
//     return (
//       <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">Invalid Reset Link</h3>
//           <p className="text-gray-600 mb-6">
//             This password reset link is invalid or has expired.
//             Please request a new reset link.
//           </p>
//           <button
//             onClick={() => navigate("/forgot-password")}
//             className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Request New Reset Link
//           </button>
//           <div className="mt-4">
//             <Link to="/login" className="text-blue-500 hover:underline">
//               Back to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Your Password</h2>

//         {isResetting ? (
//           <div className="text-center py-8">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">Password Reset Successful!</h3>
//             <p className="text-gray-600 mb-4">
//               Your password has been reset successfully. Redirecting to login page...
//             </p>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="password">
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   minLength="6"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter new password (min. 6 characters)"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
//                   Confirm New Password
//                 </label>
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Confirm new password"
//                 />
//               </div>

//               <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
//                 <p className="font-semibold mb-1">Password requirements:</p>
//                 <ul className="list-disc pl-5 space-y-1">
//                   <li>At least 6 characters long</li>
//                   <li>Use a combination of letters and numbers</li>
//                   <li>Consider using special characters for extra security</li>
//                 </ul>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full ${
//                   isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
//                 } text-white py-3 rounded-lg transition-colors flex items-center justify-center`}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Resetting Password...
//                   </>
//                 ) : (
//                   'Reset Password'
//                 )}
//               </button>
//             </div>
//           </form>
//         )}

//         <div className="mt-6 text-center text-gray-600 text-sm">
//           Remember your password?{" "}
//           <Link to="/login" className="text-blue-500 hover:underline">
//             Login here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResetPassword;


// components/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

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
    overflow: hidden;
    padding: 40px 24px;
    box-sizing: border-box;
  }
  .auth-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; animation: floatOrb 8s ease-in-out infinite; }
  .orb-1 { width: 400px; height: 400px; background: rgba(99,60,255,0.18); top: -100px; left: -100px; }
  .orb-2 { width: 300px; height: 300px; background: rgba(0,200,255,0.12); bottom: -80px; right: -80px; animation-delay: -4s; }
  .orb-3 { width: 200px; height: 200px; background: rgba(255,100,180,0.1); top: 40%; right: 20%; animation-delay: -2s; }
  @keyframes floatOrb { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }

  .auth-card {
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 40px 36px;
    backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,60,255,0.06);
    position: relative;
    z-index: 10;
  }

  .auth-card-eyebrow { font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(167,139,250,0.8); font-weight: 500; margin-bottom: 8px; }
  .auth-card-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 28px 0; }

  .auth-label { display: block; font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 6px; letter-spacing: 0.3px; }
  .auth-input {
    width: 100%;
    padding: 13px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    margin-bottom: 16px;
  }
  .auth-input::placeholder { color: rgba(255,255,255,0.3); }
  .auth-input:focus { border-color: rgba(167,139,250,0.6); background: rgba(255,255,255,0.09); box-shadow: 0 0 0 3px rgba(167,139,250,0.1); }

  .auth-hint-box {
    background: rgba(167,139,250,0.07);
    border: 1px solid rgba(167,139,250,0.15);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 20px;
  }
  .auth-hint-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; color: rgba(167,139,250,0.8); margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
  .auth-hint-list { list-style: none; padding: 0; margin: 0; }
  .auth-hint-list li { font-size: 13px; color: rgba(255,255,255,0.35); padding: 2px 0; display: flex; align-items: center; gap: 8px; }
  .auth-hint-list li::before { content: '·'; color: rgba(167,139,250,0.5); font-size: 18px; line-height: 1; }

  .auth-submit-btn {
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
    box-shadow: 0 4px 24px rgba(124,58,237,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .auth-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,58,237,0.5); }
  .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .auth-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: authSpin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes authSpin { to { transform: rotate(360deg); } }

  .auth-success-icon {
    width: 64px; height: 64px;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .auth-error-icon {
    width: 64px; height: 64px;
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .auth-progress-bar {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.1);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 16px;
  }
  .auth-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #38bdf8);
    border-radius: 99px;
    animation: progressFill 3s linear forwards;
  }
  @keyframes progressFill { from { width: 0%; } to { width: 100%; } }

  .auth-loading-root {
    min-height: 100vh;
    background: #0a0a14;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    flex-direction: column;
    gap: 20px;
  }
  .auth-loading-spinner {
    width: 44px; height: 44px;
    border: 3px solid rgba(167,139,250,0.2);
    border-top-color: #a78bfa;
    border-radius: 50%;
    animation: authSpin 0.8s linear infinite;
  }

  .auth-footer-row { text-align: center; margin-top: 28px; font-size: 13px; color: rgba(255,255,255,0.35); }
  .auth-footer-link { color: rgba(167,139,250,0.9); text-decoration: none; font-weight: 500; transition: color 0.2s; }
  .auth-footer-link:hover { color: #c4b5fd; }
`;

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/auth/reset-password/${token}`);
        if (res.data.success) setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
        toast.error(err.response?.data?.msg || "Invalid or expired reset link");
      }
    };
    if (token) validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); setIsLoading(false); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); setIsLoading(false); return; }
    try {
      setIsResetting(true);
      const res = await axios.post(`${baseUrl}/api/auth/reset-password/${token}`, { password, confirmPassword });
      if (res.data.success) {
        toast.success(res.data.msg);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to reset password");
      setIsResetting(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Validating token state
  if (isValidToken === null) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="auth-loading-root">
          <div className="auth-loading-spinner" />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Validating reset link...</p>
        </div>
      </>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="auth-root">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="auth-error-icon">
              <svg width="28" height="28" fill="none" stroke="#f87171" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="auth-card-eyebrow" style={{ textAlign: 'center' }}>Link Expired</p>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Invalid Reset Link</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button onClick={() => navigate("/forgot-password")} className="auth-submit-btn" style={{ marginBottom: 16 }}>
              Request New Reset Link
            </button>
            <div className="auth-footer-row" style={{ marginTop: 12 }}>
              <Link to="/login" className="auth-footer-link">Back to Login</Link>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" theme="dark" toastStyle={{ background: "rgba(20,20,35,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }} />
      </>
    );
  }

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="auth-root">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        <div className="auth-card">
          {isResetting ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div className="auth-success-icon">
                <svg width="28" height="28" fill="none" stroke="#34d399" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="auth-card-eyebrow" style={{ textAlign: 'center' }}>All Done</p>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Password Reset!</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 24 }}>
                Your password has been reset successfully. Redirecting you to login...
              </p>
              <div className="auth-progress-bar">
                <div className="auth-progress-fill" />
              </div>
            </div>
          ) : (
            <>
              <p className="auth-card-eyebrow">Security</p>
              <h2 className="auth-card-title">Reset Password</h2>

              <form onSubmit={handleSubmit}>
                <label className="auth-label" htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="auth-input"
                  placeholder="Enter new password (min. 6 characters)"
                />

                <label className="auth-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Confirm new password"
                />

                <div className="auth-hint-box">
                  <p className="auth-hint-title">Requirements</p>
                  <ul className="auth-hint-list">
                    <li>At least 6 characters long</li>
                    <li>Mix of letters and numbers</li>
                    <li>Special characters for extra security</li>
                  </ul>
                </div>

                <button type="submit" disabled={isLoading} className="auth-submit-btn">
                  {isLoading ? (
                    <><span className="auth-spinner" /> Resetting Password...</>
                  ) : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <div className="auth-footer-row">
            Remember your password?{" "}
            <Link to="/login" className="auth-footer-link">Login here</Link>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" theme="dark" toastStyle={{ background: "rgba(20,20,35,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }} />
    </>
  );
}

export default ResetPassword;
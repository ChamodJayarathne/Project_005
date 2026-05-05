// // components/ForgotPassword.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await axios.post(`${baseUrl}/api/auth/forgot-password`, {
//         email,
//       });

//       if (res.data.success) {
//         toast.success(res.data.msg);
//         setIsSubmitted(true);
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.msg || "Failed to send reset link";
//       toast.error(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//       {/* Back button */}
//       <div className="absolute top-4 left-4">
//         <button
//           onClick={() => navigate("/login")}
//           className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
//         >
//           ← Back to Login
//         </button>
//       </div>

//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
//         <p className="text-gray-600 mb-6">
//           Enter your email address and we'll send you a link to reset your password.
//         </p>

//         {!isSubmitted ? (
//           <form onSubmit={handleSubmit}>
//             <div className="mb-6">
//               <label className="block text-gray-700 mb-2" htmlFor="email">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your registered email"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full ${
//                 isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
//               } text-white py-3 rounded-lg transition-colors flex items-center justify-center`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Sending...
//                 </>
//               ) : (
//                 'Send Reset Link'
//               )}
//             </button>
//           </form>
//         ) : (
//           <div className="text-center py-8">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
//             <p className="text-gray-600 mb-6">
//               We've sent a password reset link to <span className="font-semibold">{email}</span>.
//               Please check your inbox and follow the instructions.
//             </p>
//             <div className="space-y-3">
//               <button
//                 onClick={() => setIsSubmitted(false)}
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Resend Email
//               </button>
//               <button
//                 onClick={() => navigate("/login")}
//                 className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg hover:bg-blue-50 transition-colors"
//               >
//                 Back to Login
//               </button>
//             </div>
//           </div>
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

// export default ForgotPassword;


// components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

  .auth-back-btn {
    position: fixed;
    top: 20px;
    left: 24px;
    z-index: 100;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.85);
    padding: 8px 18px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .auth-back-btn:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.25); color: #fff; transform: translateY(-1px); }

  .auth-card {
    width: 100%;
    max-width: 420px;
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
  .auth-card-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 10px 0; }
  .auth-card-desc { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.6; margin-bottom: 28px; }

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
    margin-bottom: 20px;
  }
  .auth-input::placeholder { color: rgba(255,255,255,0.3); }
  .auth-input:focus { border-color: rgba(167,139,250,0.6); background: rgba(255,255,255,0.09); box-shadow: 0 0 0 3px rgba(167,139,250,0.1); }

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

  .auth-outline-btn {
    width: 100%;
    padding: 13px;
    background: transparent;
    border: 1px solid rgba(167,139,250,0.4);
    border-radius: 12px;
    color: rgba(167,139,250,0.9);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    margin-top: 12px;
  }
  .auth-outline-btn:hover { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.7); }

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
    width: 60px; height: 60px;
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .auth-footer-row { text-align: center; margin-top: 28px; font-size: 13px; color: rgba(255,255,255,0.35); }
  .auth-footer-link { color: rgba(167,139,250,0.9); text-decoration: none; font-weight: 500; transition: color 0.2s; }
  .auth-footer-link:hover { color: #c4b5fd; }
`;

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
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password`, { email });
      if (res.data.success) {
        toast.success(res.data.msg);
        setIsSubmitted(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="auth-root">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        {/* <button className="auth-back-btn" onClick={() => navigate("/login")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Login
        </button> */}

        <div className="auth-card">
          {!isSubmitted ? (
            <>
              <p className="auth-card-eyebrow">Account Recovery</p>
              <h2 className="auth-card-title">Forgot Password?</h2>
              <p className="auth-card-desc">Enter your email address and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit}>
                <label className="auth-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter your registered email"
                />
                <button type="submit" disabled={isLoading} className="auth-submit-btn">
                  {isLoading ? (
                    <><span className="auth-spinner" /> Sending...</>
                  ) : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div className="auth-success-icon">
                <svg width="28" height="28" fill="none" stroke="#34d399" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Check Your Email</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 24 }}>
                We've sent a password reset link to <strong style={{ color: 'rgba(167,139,250,0.9)' }}>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="auth-submit-btn">Resend Email</button>
              <button onClick={() => navigate("/login")} className="auth-outline-btn">Back to Login</button>
            </div>
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

export default ForgotPassword;
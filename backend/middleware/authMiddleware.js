// const jwt = require("jsonwebtoken");

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       const authHeader = req.header("Authorization");
//       if (!authHeader)
//         return res.status(401).json({ msg: "No token provided" });

//       const token = authHeader.split(" ")[1]; 
//       if (!token) return res.status(401).json({ msg: "Token format invalid" });

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ msg: "Access denied" });
//       }

//       next();
//     } catch (error) {
  
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({
//           msg: "Token expired",
//           expiredAt: error.expiredAt,
//         });
//       }
//       if (error.name === "JsonWebTokenError") {
//         return res.status(401).json({ msg: "Invalid token" });
//       }
//       res.status(500).json({ msg: "Authentication failed" });
//     }
//   };
// };

// const checkUserActive = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }
    
//     if (!user.isActive) {
//       return res.status(403).json({ 
//         msg: "Your account is disabled. Please contact administrator." 
//       });
//     }
    
//     next();
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// module.exports = [authMiddleware,checkUserActive];



const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Don't forget to import User

// Main authentication middleware function
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader)
        return res.status(401).json({ msg: "No token provided" });

      const token = authHeader.split(" ")[1]; 
      if (!token) return res.status(401).json({ msg: "Token format invalid" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          msg: "Token expired",
          expiredAt: error.expiredAt,
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ msg: "Invalid token" });
      }
      res.status(500).json({ msg: "Authentication failed" });
    }
  };
};

// Separate middleware to check if user is active
const checkUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ 
        msg: "Your account is disabled. Please contact administrator." 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Export as separate functions, not as array
module.exports = {
  authMiddleware,
  checkUserActive
};


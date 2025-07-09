const jwt = require("jsonwebtoken");

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

module.exports = authMiddleware;


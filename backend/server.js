const dotenv = require("dotenv").config();
// dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const cron = require("node-cron");
const orderController = require("./controllers/orderController");
// const session = require("express-session");
// const passport = require("./config/passport");

const app = express();

// Session configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "djhdadfadadvfagh",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "development",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// // Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());


app.use(cors());

app.use(
  cors({
    // origin: process.env.FRONTEND_BASE_URL,
    origin: "http://localhost:5173" || process.env.FRONTEND_BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);


// Google OAuth Routes
// app.get(
//   "/api/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );

// app.get(
//   "/api/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${process.env.FRONTEND_BASE_URL}/login?error=auth_failed`,
//     session: false,
//   }),
//   (req, res) => {
//     try {
//       const user = req.user;
      
//       // Generate JWT token
//       const token = jwt.sign(
//         { id: user._id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       // Redirect to frontend with token
//       res.redirect(
//         `${process.env.FRONTEND_BASE_URL}/auth/callback?token=${token}&id=${user._id}&username=${user.username}&role=${user.role}&email=${user.email}&profileImage=${user.profileImage || ''}`
//       );
//     } catch (error) {
//       res.redirect(`${process.env.FRONTEND_BASE_URL}/login?error=token_generation_failed`);
//     }
//   }
// );

app.listen(5000, () => console.log("Server running on port 5000"));

cron.schedule("0 * * * *", () => {
  orderController.cleanExpiredOrders();
});

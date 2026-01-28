// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   changePassword,
//   googleAuth, 
//     toggleUserStatus,
//   //   googleAuthCallback,
//   // checkGoogleAuthStatus,
// } = require("../controllers/authController");
// const authenticate = require("../middleware/authMiddleware");
// const upload = require("../middleware/multer");
// const passport = require("passport");
// const router = express.Router();

// router.post("/register", upload.single("profileImage"), registerUser);
// router.post("/login", loginUser);
// router.post("/google", googleAuth);

// // Google OAuth routes
// // router.get(
// //   "/google",
// //   passport.authenticate("google", {
// //     scope: ["profile", "email"],
// //     prompt: "select_account",
// //   })
// // );

// // router.get(
// //   "/google/callback",
// //   passport.authenticate("google", {
// //     failureRedirect: "http://localhost:5173/login?error=auth_failed",
// //     session: false,
// //   }),
// //   googleAuthCallback
// // );

// // router.get("/google/status", checkGoogleAuthStatus);


// router.get("/users", authenticate(["admin"]), getAllUsers);
// router.get("/users/:id", authenticate(["admin", "users"]), getUserById);
// router.put("/users/:id", authenticate(["admin"]), updateUser);
// router.delete("/users/:id", authenticate(["admin"]), deleteUser);

// router.patch("/users/:id/toggle-status", authenticate(["admin"]), toggleUserStatus);
// // router.post('/change-password', authenticate(['user', 'admin']), changePassword);
// router.post(
//   "/users/:id/change-password",
//   authenticate(["admin"]),
//   changePassword
// );

// module.exports = router;


const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  googleAuth,
  toggleUserStatus,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Destructure here too
const upload = require("../middleware/multer");
const router = express.Router();

// Public routes
router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Protected routes (admin only)
router.get("/users", authMiddleware(["admin"]), getAllUsers);
router.get("/users/:id", authMiddleware(["admin"]), getUserById);
router.put("/users/:id", authMiddleware(["admin"]), updateUser);
router.delete("/users/:id", authMiddleware(["admin"]), deleteUser);

router.patch(
  "/users/:id/toggle-status", 
  authMiddleware(["admin"]), 
  toggleUserStatus
);

router.post(
  "/users/:id/change-password",
  authMiddleware(["admin"]),
  changePassword
);

module.exports = router;
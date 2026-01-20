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
  //   googleAuthCallback,
  // checkGoogleAuthStatus,
} = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const passport = require("passport");
const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Google OAuth routes
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:5173/login?error=auth_failed",
//     session: false,
//   }),
//   googleAuthCallback
// );

// router.get("/google/status", checkGoogleAuthStatus);


router.get("/users", authenticate(["admin"]), getAllUsers);
router.get("/users/:id", authenticate(["admin", "users"]), getUserById);
router.put("/users/:id", authenticate(["admin"]), updateUser);
router.delete("/users/:id", authenticate(["admin"]), deleteUser);
// router.post('/change-password', authenticate(['user', 'admin']), changePassword);
router.post(
  "/users/:id/change-password",
  authenticate(["admin"]),
  changePassword
);

module.exports = router;

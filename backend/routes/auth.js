const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);

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

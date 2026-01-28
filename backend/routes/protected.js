// const express = require("express");
// const authenticate = require("../middleware/authMiddleware");
// const router = express.Router();
// const postController = require("../controllers/postController");
// const authController = require("../controllers/authController");
// const orderController = require("../controllers/orderController");
// const multer = require("multer");
// const path = require("path");
// const Post = require("../models/Post");
// const User = require("../models/User");

// const upload = require("../middleware/multer");

// // Configure file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // const upload = multer({ storage });

// router.get("/admin-data", authenticate, (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ msg: "Access denied" });
//   }
//   res.json({ message: "Welcome to the admin dashboard!" });
// });

// router.get("/current-user", authenticate, authController.getCurrentUser);

// // Create new post
// router.post(
//   "/posts",
//   authenticate(["admin"]),
//   upload.single("image"),
//   postController.createPost
// );

// // Get all posts
// router.get(
//   "/posts",
//   authenticate(["admin", "user"]),
//   postController.getAllPosts
// );

// router.get("/admin/posts", authenticate(["admin"]), async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

// router.get("/user-data", authenticate, (req, res) => {
//   if (req.user.role !== "user") {
//     return res.status(403).json({ msg: "Access denied" });
//   }
//   res.json({ message: "Welcome to your user dashboard!" });
// });

// // Order routes
// router.post("/orders", authenticate(["user"]), orderController.createOrder);

// router.get(
//   "/admin/orders",
//   authenticate(["admin"]),
//   orderController.getAdminOrders
// );
// router.put(
//   "/orders/:id/status",
//   authenticate(["admin"]),
//   orderController.updateOrderStatus
// );

// router.get(
//   "/user/orders",
//   authenticate(["user"]),
//   orderController.getUserOrders
// );

// // User gets active posts
// router.get(
//   "/posts/active",
//   authenticate(["user"]),
//   postController.getActivePosts
// );

// router.get(
//   "/posts/available",
//   authenticate(["user", "admin"]),
//   postController.getAvailablePosts
// );

// router.post(
//   "/orders/:id/approve",
//   authenticate(["admin"]),
//   orderController.approveOrder
// );

// router.delete(
//   "/orders/:id",
//   authenticate(["admin"]),
//   orderController.deleteOrder
// );

// router.get(
//   "/posts/user/:userId",
//   authenticate(["admin"]),
//   postController.getPostsByUser
// );

// // Add this route with your other post routes
// router.get(
//   "/posts/:postId",
//   authenticate(["admin"]),
//   postController.getPostById
// );

// router.put(
//   "/posts/:id",
//   authenticate(["admin"]),
//   upload.single("image"),
//   postController.updatePost
// );

// router.delete(
//   "/posts/:postId",
//   authenticate(["admin"]),
//   postController.deletePost
// );

// router.get(
//   "/orders/user/:userId",
//   authenticate(["admin"]),
//   orderController.getOrdersByUser
// );

// router.get("/orders/:id", authenticate(["admin"]), orderController.getOrder);

// router.put(
//   "/orders/:id/process-payment",
//   authenticate(["admin"]),
//   orderController.processPayment
// );

// router.put("/orders/:id", authenticate(["admin"]), orderController.updateOrder);

// router.put("/orders/:id/details", authenticate(["admin"]), orderController.updateOrderDetails);

// router.get("/profile", authenticate, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json({
//       success: true,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         phoneNumber: user.phoneNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

// router.get("/test-auth", authenticate, (req, res) => {
//   res.json({
//     message: "Authentication working!",
//     user: req.user,
//     timestamp: new Date().toISOString(),
//   });
// });

// // Get all users (admin only)
// router.get("/admin/users", authenticate(["admin"]), async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

// router.get(
//   "/orders/profit/summary",
//   authenticate(["user"]),
//   orderController.getUserProfitSummary
// );

// // router.post('/test-email', orderController.testEmail);
// // router.post('/direct-email-test', orderController.directEmailTest);

// module.exports = router;


const express = require("express");
const { authMiddleware, checkUserActive } = require("../middleware/authMiddleware"); // Destructure imports
const router = express.Router();
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const upload = require("../middleware/multer");
const Post = require("../models/Post");
const User = require("../models/User");

// Admin routes
router.get("/admin-data", authMiddleware(), (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }
  res.json({ message: "Welcome to the admin dashboard!" });
});

// User routes
router.get("/user-data", authMiddleware(), (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ msg: "Access denied" });
  }
  res.json({ message: "Welcome to your user dashboard!" });
});

// Current user (works for both admin and user)
router.get("/current-user", authMiddleware(), authController.getCurrentUser);

// Post routes
router.post(
  "/posts",
  authMiddleware(["admin"]), // Note: Use authMiddleware with array parameter
  upload.single("image"),
  postController.createPost
);

router.get(
  "/posts",
  authMiddleware(["admin", "user"]),
  postController.getAllPosts
);

router.get(
  "/admin/posts", 
  authMiddleware(["admin"]), 
  async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
);

router.get(
  "/posts/active",
  authMiddleware(["user"]),
  postController.getActivePosts
);

// Available posts with user active check
router.get(
  "/posts/available",
  authMiddleware(["user", "admin"]),
  checkUserActive, // Add this as separate middleware
  postController.getAvailablePosts
);

// Fix post visibility (admin only)
router.post(
  "/posts/fix-visibility",
  authMiddleware(["admin"]),
  postController.fixPostVisibility
);

// Order routes
router.post(
  "/orders", 
  authMiddleware(["user"]), 
  orderController.createOrder
);

router.get(
  "/admin/orders",
  authMiddleware(["admin"]),
  orderController.getAdminOrders
);

router.put(
  "/orders/:id/status",
  authMiddleware(["admin"]),
  orderController.updateOrderStatus
);

router.get(
  "/user/orders",
  authMiddleware(["user"]),
  orderController.getUserOrders
);

router.post(
  "/orders/:id/approve",
  authMiddleware(["admin"]),
  orderController.approveOrder
);

router.delete(
  "/orders/:id",
  authMiddleware(["admin"]),
  orderController.deleteOrder
);

// Other post routes
router.get(
  "/posts/user/:userId",
  authMiddleware(["admin"]),
  postController.getPostsByUser
);

router.get(
  "/posts/:postId",
  authMiddleware(["admin"]),
  postController.getPostById
);

router.put(
  "/posts/:id",
  authMiddleware(["admin"]),
  upload.single("image"),
  postController.updatePost
);

router.delete(
  "/posts/:postId",
  authMiddleware(["admin"]),
  postController.deletePost
);

// Other order routes
router.get(
  "/orders/user/:userId",
  authMiddleware(["admin"]),
  orderController.getOrdersByUser
);

router.get(
  "/orders/:id",
  authMiddleware(["admin"]),
  orderController.getOrder
);

router.put(
  "/orders/:id/process-payment",
  authMiddleware(["admin"]),
  orderController.processPayment
);

router.put(
  "/orders/:id",
  authMiddleware(["admin"]),
  orderController.updateOrderWithPayment
);

router.put(
  "/orders/:id/details",
  authMiddleware(["admin"]),
  orderController.updateOrderDetails
);

// Profile route
router.get("/profile", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Test route
router.get("/test-auth", authMiddleware(), (req, res) => {
  res.json({
    message: "Authentication working!",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Get all users (admin only)
router.get("/admin/users", authMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Profit summary
router.get(
  "/orders/profit/summary",
  authMiddleware(["user"]),
  orderController.getUserProfitSummary
);

module.exports = router;


// const express = require("express");
// const authenticate = require("../middleware/authMiddleware");
// const   checkUserActive = require("../middleware/authMiddleware")
// const router = express.Router();
// const postController = require("../controllers/postController");
// const authController = require("../controllers/authController");
// const orderController = require("../controllers/orderController");
// const upload = require("../middleware/multer");
// const Post = require("../models/Post");
// const User = require("../models/User");

// router.get("/admin-data", authenticate, (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ msg: "Access denied" });
//   }
//   res.json({ message: "Welcome to the admin dashboard!" });
// });

// router.get("/current-user", authenticate, authController.getCurrentUser);

// // Create new post
// router.post(
//   "/posts",
//   authenticate(["admin"]),
//   upload.single("image"),
//   postController.createPost
// );

// // Get all posts
// router.get(
//   "/posts",
//   authenticate(["admin", "user"]),
//   postController.getAllPosts
// );

// router.get("/admin/posts", authenticate(["admin"]), async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

// router.get("/user-data", authenticate, (req, res) => {
//   if (req.user.role !== "user") {
//     return res.status(403).json({ msg: "Access denied" });
//   }
//   res.json({ message: "Welcome to your user dashboard!" });
// });

// // Order routes - FIXED: Use the regular function, not array middleware
// router.post("/orders", authenticate(["user"]), orderController.createOrder);

// router.get(
//   "/admin/orders",
//   authenticate(["admin"]),
//   orderController.getAdminOrders
// );

// router.put(
//   "/orders/:id/status",
//   authenticate(["admin"]),
//   orderController.updateOrderStatus
// );

// router.get(
//   "/user/orders",
//   authenticate(["user"]),
//   orderController.getUserOrders
// );

// // User gets active posts
// router.get(
//   "/posts/active",
//   authenticate(["user"]),
//   postController.getActivePosts
// );

// router.get(
//   "/posts/available",
//   authenticate(["user", "admin"]),
//     checkUserActive,
//   postController.getAvailablePosts
// );

// router.post(
//   "/posts/fix-visibility",
//   authenticate(["admin"]),
//   postController.fixPostVisibility
// )

// // router.get(
// //   "/posts/available",
// //   authenticate(["user"]),
// //   checkUserActive, // Add this middleware
// //   postController.getAvailablePosts
// // );

// router.post(
//   "/orders/:id/approve",
//   authenticate(["admin"]),
//   orderController.approveOrder
// );

// router.delete(
//   "/orders/:id",
//   authenticate(["admin"]),
//   orderController.deleteOrder
// );

// router.get(
//   "/posts/user/:userId",
//   authenticate(["admin"]),
//   postController.getPostsByUser
// );

// // Add this route with your other post routes
// router.get(
//   "/posts/:postId",
//   authenticate(["admin"]),
//   postController.getPostById
// );

// router.put(
//   "/posts/:id",
//   authenticate(["admin"]),
//   upload.single("image"),
//   postController.updatePost
// );

// router.delete(
//   "/posts/:postId",
//   authenticate(["admin"]),
//   postController.deletePost
// );

// router.get(
//   "/orders/user/:userId",
//   authenticate(["admin"]),
//   orderController.getOrdersByUser
// );

// router.get("/orders/:id", authenticate(["admin"]), orderController.getOrder);

// router.put(
//   "/orders/:id/process-payment",
//   authenticate(["admin"]),
//   orderController.processPayment
// );

// // Use the correct function name for updating order with payment
// router.put("/orders/:id", authenticate(["admin"]), orderController.updateOrderWithPayment);

// router.put("/orders/:id/details", authenticate(["admin"]), orderController.updateOrderDetails);

// router.get("/profile", authenticate, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json({
//       success: true,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//         phoneNumber: user.phoneNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

// router.get("/test-auth", authenticate, (req, res) => {
//   res.json({
//     message: "Authentication working!",
//     user: req.user,
//     timestamp: new Date().toISOString(),
//   });
// });

// // Get all users (admin only)
// router.get("/admin/users", authenticate(["admin"]), async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// });

// router.get(
//   "/orders/profit/summary",
//   authenticate(["user"]),
//   orderController.getUserProfitSummary
// );

// module.exports = router;
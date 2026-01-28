const Order = require("../models/Order");
const Post = require("../models/Post");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");

// Email sending function
// async function sendPostEmails(emails, post) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: emails.join(","),
//     subject: "New Product Available for Purchase",
//     html: `
//       <h1>New Product: ${post.productName}</h1>
//       <p>Full Amount: Rs.${post.fullAmount}</p>
//     <p>Unit Price: Rs.${post.unitPrice}</p>
//       <p>Expected Profit: Rs.${post.expectedProfit}</p>
//       <p>Time Line: ${post.timeLine}</p>
//       ${
//         post.image
//           ? `<img src="${process.env.FRONTEND_BASE_local_URL}/${post.image}" alt="${post.productName}" width="300">`
//           : ""
//       }
//       <p>Login to your account to purchase this item!</p>
//       <a href="${
//         process.env.FRONTEND_BASE_local_URL
//       }/api/auth/login">Go to the Dashboard</a>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Emails sent successfully");
//   } catch (err) {
//     console.error("Error sending emails:", err);
//     throw err;
//   }
// }


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

// In your postController.js file

// Email sending function with validation
async function sendPostEmails(emails, post) {
  // Check if there are any emails to send
  if (!emails || emails.length === 0) {
    console.log("No email recipients to send to. Skipping email sending.");
    return;
  }

  // Filter out any null or undefined emails
  const validEmails = emails.filter(email => 
    email && typeof email === 'string' && email.includes('@')
  );

  if (validEmails.length === 0) {
    console.log("No valid email addresses found. Skipping email sending.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: validEmails.join(","),
    subject: "New Product Available for Purchase",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4a86e8;">New Product Available: ${post.productName}</h1>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Product Details:</strong></p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Full Amount:</strong> Rs.${post.fullAmount.toLocaleString()}</li>
            <li style="margin-bottom: 8px;"><strong>Unit Price:</strong> Rs.${post.unitPrice.toLocaleString()}</li>
            <li style="margin-bottom: 8px;"><strong>Quantity:</strong> ${post.quantity}</li>
            <li style="margin-bottom: 8px;"><strong>Selling Unit Price:</strong> Rs.${post.sellingUnitPrice.toLocaleString()}</li>
            <li style="margin-bottom: 8px;"><strong>Expected Profit:</strong> Rs.${post.expectedProfit.toLocaleString()}</li>
            <li style="margin-bottom: 8px;"><strong>Time Line:</strong> ${post.timeLine}</li>
          </ul>
        </div>
        
        ${post.image ? 
          `<div style="text-align: center; margin: 20px 0;">
            <img src="${post.image}" alt="${post.productName}" style="max-width: 300px; border-radius: 8px; border: 1px solid #ddd;">
          </div>` 
          : ""
        }
        
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin-bottom: 10px;">Login to your account to invest in this opportunity!</p>
          <a href="${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/user" 
             style="display: inline-block; background-color: #4a86e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>This is an automated message from Wonder Choice Investment Platform.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Emails sent successfully to ${validEmails.length} recipients`);
  } catch (err) {
    console.error("Error sending emails:", err);
    // Don't throw the error - just log it and continue
    console.log("Continuing with post creation despite email error");
  }
}

exports.createPost = async (req, res) => {
  try {
    const { productName, unitPrice, quantity, sellingUnitPrice, expectedProfit, timeLine } =
      req.body;

    if (!productName || !unitPrice || !quantity || !sellingUnitPrice || !expectedProfit || !timeLine) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Calculate full amount
    const unitPriceNum = parseFloat(unitPrice);
    const quantityNum = parseInt(quantity);
    const fullAmount = unitPriceNum * quantityNum;

    let imageUrl = null;

    if (req.file) {
      try {
        const dataUri = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "post_images",
          transformation: { width: 800, height: 600, crop: "limit" },
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          msg: "Failed to upload image to Cloudinary",
          error: uploadError.message,
        });
      }
    }

    // Get ALL users except the current admin
    console.log(`\n=== Creating post by admin: ${req.user.id} ===`);
    
    const allUsers = await User.find({
      _id: { $ne: req.user.id },
      role: "user"
    }).select('_id email username isActive');

    console.log(`Found ${allUsers.length} total users`);

    // Filter active users
    const activeUsers = allUsers.filter(user => user.isActive === true);
    const activeUserIds = activeUsers.map(user => user._id);

    console.log(`Active users: ${activeUsers.length}`);
    console.log(`Inactive users: ${allUsers.length - activeUsers.length}`);

    // Create post with only active users in visibleTo
    const newPost = new Post({
      productName,
      unitPrice: unitPriceNum,
      quantity: quantityNum,
      fullAmount,
      sellingUnitPrice: parseFloat(sellingUnitPrice),
      expectedProfit: parseFloat(expectedProfit),
      timeLine,
      image: imageUrl,
      createdBy: req.user.id,
      visibleTo: activeUserIds, // Only active users can see
      sharedWith: activeUserIds, // Shared with active users
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      status: "active",
      investedUsers: []
    });

    console.log(`Saving post with ${activeUserIds.length} users in visibleTo`);

    // Save post
    await newPost.save();
    
    console.log(`✅ Post created successfully: ${newPost.productName}`);
    console.log(`Post ID: ${newPost._id}`);

    // Send emails only to active users
    const activeUserEmails = activeUsers
      .map((user) => user.email)
      .filter(email => email && email.includes('@'));
    
    if (activeUserEmails.length > 0) {
      sendPostEmails(activeUserEmails, newPost).catch(err => {
        console.error("Email sending failed:", err.message);
      });
      console.log(`📧 Emails sent to ${activeUserEmails.length} users`);
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
      stats: {
        totalActiveUsers: activeUsers.length,
        emailsSent: activeUserEmails.length
      }
    });
    
  } catch (error) {
    console.error("❌ Error in createPost:", error);
    
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
      return res.status(400).json({
        success: false,
        msg: "Post validation failed",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
};

// exports.createPost = async (req, res) => {
//   try {
//     const { productName, unitPrice, quantity, sellingUnitPrice, expectedProfit, timeLine } =
//       req.body;

//     if (!productName || !unitPrice || !quantity || !sellingUnitPrice || !expectedProfit || !timeLine) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     // Calculate full amount
//     const unitPriceNum = parseFloat(unitPrice);
//     const quantityNum = parseInt(quantity);
//     const fullAmount = unitPriceNum * quantityNum;

//     let imageUrl = null;

//     if (req.file) {
//       try {
//         const dataUri = `data:${
//           req.file.mimetype
//         };base64,${req.file.buffer.toString("base64")}`;
//         const result = await cloudinary.uploader.upload(dataUri, {
//           folder: "post_images",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         });
//         imageUrl = result.secure_url;
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           msg: "Failed to upload image to Cloudinary",
//           error: uploadError.message,
//         });
//       }
//     }

//     // Get ONLY ACTIVE users except the current admin
//     const users = await User.find({
//       _id: { $ne: req.user.id },
//       role: "user",
//       isActive: true, // Only include active users
//     });

//     console.log(`Found ${users.length} active users to share post with`);

//     const newPost = new Post({
//       productName,
//       unitPrice: unitPriceNum,
//       quantity: quantityNum,
//       fullAmount,
//       sellingUnitPrice,
//       expectedProfit,
//       timeLine,
//       image: imageUrl,
//       createdBy: req.user.id,
//       visibleTo: users.map((user) => user._id), // Only visible to active users
//       sharedWith: users.map((user) => user._id), // Shared with all active users
//       expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
//     });

//     await newPost.save();
//     console.log(`Post created successfully: ${newPost.productName}`);

//     // Send emails to all ACTIVE users (if any)
//     const userEmails = users.map((user) => user.email).filter(email => email);
    
//     console.log(`Attempting to send emails to ${userEmails.length} users`);
    
//     if (userEmails.length > 0) {
//       // Send emails asynchronously - don't wait for it to complete
//       sendPostEmails(userEmails, newPost).catch(err => {
//         console.error("Email sending failed, but post was created:", err.message);
//       });
      
//       console.log("Email sending initiated in background");
//     } else {
//       console.log("No users with email addresses to send notifications to");
//     }

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: newPost,
//       notifiedUsers: userEmails.length
//     });
    
//   } catch (error) {
//     console.error("Error in createPost:", error);
//     res.status(500).json({
//       success: false,
//       msg: error.message,
//       error: error.stack,
//     });
//   }
// };
// // Modified WhatsApp sending function


// exports.createPost = async (req, res) => {
//   try {
//     const { productName, unitPrice, quantity, sellingUnitPrice, expectedProfit, timeLine } =
//       req.body;

//     if (!productName || !unitPrice || !quantity || !sellingUnitPrice || !expectedProfit || !timeLine) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     // Calculate full amount
//     const unitPriceNum = parseFloat(unitPrice);
//     const quantityNum = parseInt(quantity);
//     const fullAmount = unitPriceNum * quantityNum;

//     let imageUrl = null;

//     if (req.file) {
//       try {
//         const dataUri = `data:${
//           req.file.mimetype
//         };base64,${req.file.buffer.toString("base64")}`;
//         const result = await cloudinary.uploader.upload(dataUri, {
//           folder: "post_images",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         });
//         imageUrl = result.secure_url;
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           msg: "Failed to upload image to Cloudinary",
//           error: uploadError.message,
//         });
//       }
//     }

//     // Get ALL users except the current admin first
//     const allUsers = await User.find({
//       _id: { $ne: req.user.id },
//       role: "user"
//     }).select('_id email username isActive');

//     console.log(`Total users found: ${allUsers.length}`);

//     // Separate active and inactive users
//     const activeUsers = allUsers.filter(user => user.isActive === true);
//     const inactiveUsers = allUsers.filter(user => user.isActive === false);

//     console.log(`Active users: ${activeUsers.length}`);
//     console.log(`Inactive users: ${inactiveUsers.length}`);

//     // Extract user IDs for active users only
//     const activeUserIds = activeUsers.map(user => user._id);
//     const inactiveUserIds = inactiveUsers.map(user => user._id);

//     // Create the post with ONLY active users
//     const newPost = new Post({
//       productName,
//       unitPrice: unitPriceNum,
//       quantity: quantityNum,
//       fullAmount,
//       sellingUnitPrice,
//       expectedProfit,
//       timeLine,
//       image: imageUrl,
//       createdBy: req.user.id,
//       visibleTo: activeUserIds, // Only active users
//       sharedWith: activeUserIds, // Only active users
//       expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
//     });

//     await newPost.save();
//     console.log(`Post created successfully: ${newPost.productName}`);
//     console.log(`Post visible to ${activeUserIds.length} active users`);

//     // Send emails ONLY to active users with emails
//     const activeUserEmails = activeUsers
//       .map((user) => user.email)
//       .filter(email => email && email.includes('@')); // Valid email check
    
//     console.log(`Attempting to send emails to ${activeUserEmails.length} active users`);
    
//     if (activeUserEmails.length > 0) {
//       // Send emails asynchronously
//       sendPostEmails(activeUserEmails, newPost).catch(err => {
//         console.error("Email sending failed, but post was created:", err.message);
//       });
      
//       console.log("Email sending initiated for active users");
//     } else {
//       console.log("No active users with valid email addresses");
//     }

//     // Log inactive users (for admin reference only)
//     if (inactiveUserIds.length > 0) {
//       console.log(`Post NOT visible to ${inactiveUserIds.length} inactive users:`);
//       inactiveUsers.forEach(user => {
//         console.log(`  - ${user.username} (${user.email})`);
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post: newPost,
//       stats: {
//         totalUsers: allUsers.length,
//         activeUsers: activeUsers.length,
//         inactiveUsers: inactiveUsers.length,
//         emailsSent: activeUserEmails.length
//       }
//     });
    
//   } catch (error) {
//     console.error("Error in createPost:", error);
//     res.status(500).json({
//       success: false,
//       msg: error.message,
//       error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

exports.getAdminData = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
};

// Get admin dashboard data
exports.getAdminData = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
};

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

// In your postController.js file - getAvailablePosts function
// exports.getAvailablePosts = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Check if user account is active
//     const user = await User.findById(userId);
//     if (!user || !user.isActive) {
//       return res.status(403).json({ 
//         error: "Your account is disabled. Please contact administrator." 
//       });
//     }

//     const posts = await Post.find({
//       status: "active",
//       expiresAt: { $gt: new Date() },
//       investedUsers: { $ne: userId },
//       visibleTo: userId,
//     }).populate("createdBy", "username");

//     res.json(posts);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// exports.getAvailablePosts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log(`\n=== getAvailablePosts called for user: ${userId} ===`);

//     // First, check if user account is active
//     const user = await User.findById(userId);
//     console.log(`User found: ${user ? 'Yes' : 'No'}, isActive: ${user?.isActive}`);
    
//     if (!user || !user.isActive) {
//       return res.status(403).json({ 
//         error: "Your account is disabled. Please contact administrator." 
//       });
//     }

//     // Find posts that:
//     // 1. Are active
//     // 2. Haven't expired
//     // 3. User hasn't invested in
//     // 4. User is in visibleTo array
//     const query = {
//       status: "active",
//       expiresAt: { $gt: new Date() },
//       investedUsers: { $ne: userId },
//       visibleTo: userId
//     };

//     console.log("Query for posts:", JSON.stringify(query, null, 2));
    
//     const posts = await Post.find(query)
//       .populate("createdBy", "username")
//       .sort({ createdAt: -1 }); // Newest first

//     console.log(`Found ${posts.length} available posts for user ${userId}`);
    
//     // Log each post for debugging
//     posts.forEach((post, index) => {
//       console.log(`Post ${index + 1}: ${post.productName}`);
//       console.log(`  - Visible to users: ${post.visibleTo?.length || 0}`);
//       console.log(`  - Expires at: ${post.expiresAt}`);
//       console.log(`  - Status: ${post.status}`);
//     });

//     res.json(posts);
//   } catch (error) {
//     console.error("Error in getAvailablePosts:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getAvailablePosts = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`\n=== getAvailablePosts called for user: ${userId} ===`);

    // Check user status first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isActive) {
      console.log(`User ${userId} is INACTIVE - returning empty posts array`);
      return res.json([]); // Return empty array for inactive users
    }

    console.log(`User ${userId} is ACTIVE - fetching available posts`);

    // Find posts that are:
    // 1. Active status
    // 2. Not expired
    // 3. User hasn't invested in
    // 4. User is in visibleTo array
    const now = new Date();
    
    const availablePosts = await Post.find({
      status: "active",
      expiresAt: { $gt: now },
      investedUsers: { $ne: userId },
      visibleTo: userId
    })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 })
    .lean(); // Use lean() for better performance

    console.log(`Found ${availablePosts.length} available posts for user ${userId}`);

    // Debug logging
    availablePosts.forEach((post, index) => {
      console.log(`Post ${index + 1}: ${post.productName} (ID: ${post._id})`);
    });

    res.json(availablePosts);
  } catch (error) {
    console.error("Error in getAvailablePosts:", error);
    res.status(500).json({ 
      error: "Server error",
      message: error.message 
    });
  }
};

// Utility function to fix post visibility for all users
exports.fixPostVisibility = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Get all users
    const allUsers = await User.find({ role: "user" }).select('_id isActive');
    const activeUserIds = allUsers.filter(user => user.isActive).map(u => u._id);
    const inactiveUserIds = allUsers.filter(user => !user.isActive).map(u => u._id);

    console.log(`Active users: ${activeUserIds.length}`);
    console.log(`Inactive users: ${inactiveUserIds.length}`);

    // Get all active posts
    const activePosts = await Post.find({ 
      status: "active",
      expiresAt: { $gt: new Date() }
    });

    let fixedCount = 0;
    let skippedCount = 0;

    // Update each post
    for (const post of activePosts) {
      // Remove inactive users from visibleTo
      const currentVisibleTo = post.visibleTo || [];
      const newVisibleTo = currentVisibleTo.filter(id => 
        activeUserIds.some(activeId => activeId.toString() === id.toString())
      );

      // Also remove from sharedWith
      const currentSharedWith = post.sharedWith || [];
      const newSharedWith = currentSharedWith.filter(id =>
        activeUserIds.some(activeId => activeId.toString() === id.toString())
      );

      // If there are changes, update the post
      if (newVisibleTo.length !== currentVisibleTo.length || 
          newSharedWith.length !== currentSharedWith.length) {
        post.visibleTo = newVisibleTo;
        post.sharedWith = newSharedWith;
        await post.save();
        fixedCount++;
        console.log(`Fixed post: ${post.productName}`);
      } else {
        skippedCount++;
      }
    }

    res.json({
      success: true,
      message: "Post visibility fixed",
      stats: {
        totalPosts: activePosts.length,
        fixed: fixedCount,
        skipped: skippedCount,
        activeUsers: activeUserIds.length,
        inactiveUsers: inactiveUserIds.length
      }
    });

  } catch (error) {
    console.error("Error fixing post visibility:", error);
    res.status(500).json({ error: error.message });
  }
};

// exports.getAvailablePosts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log(`\n=== getAvailablePosts called for user: ${userId} ===`);

//     // Check user status
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!user.isActive) {
//       console.log(`User ${userId} is INACTIVE`);
//       return res.status(403).json({ 
//         error: "Your account has been disabled. Please contact administrator." 
//       });
//     }

//     console.log(`User ${userId} is ACTIVE`);

//     // First, let's see ALL active posts
//     const allActivePosts = await Post.find({
//       status: "active",
//       expiresAt: { $gt: new Date() }
//     }).select('productName visibleTo expiresAt');

//     console.log(`Total active posts in system: ${allActivePosts.length}`);
    
//     // Check which posts this user can see
//     const availablePosts = await Post.find({
//       status: "active",
//       expiresAt: { $gt: new Date() },
//       investedUsers: { $ne: userId },
//       visibleTo: userId
//     })
//     .populate("createdBy", "username")
//     .sort({ createdAt: -1 });

//     console.log(`Posts available for user ${userId}: ${availablePosts.length}`);

//     // Debug: List each post
//     availablePosts.forEach((post, index) => {
//       console.log(`Post ${index + 1}: ${post.productName}`);
//       console.log(`  ID: ${post._id}`);
//       console.log(`  Expires: ${post.expiresAt}`);
//     });

//     // TEMPORARY: If no posts, return all active posts (for debugging)
//     if (availablePosts.length === 0 && allActivePosts.length > 0) {
//       console.log(`⚠️ WARNING: User ${userId} has 0 posts in visibleTo`);
//       console.log(`Checking all active posts for visibility issues...`);
      
//       allActivePosts.forEach((post, index) => {
//         const isVisible = post.visibleTo.includes(userId);
//         console.log(`Post ${index + 1}: ${post.productName} - Visible: ${isVisible}`);
//         console.log(`  Post visibleTo array: ${post.visibleTo.length} users`);
//       });
//     }

//     res.json(availablePosts);
//   } catch (error) {
//     console.error("Error in getAvailablePosts:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// exports.getAvailablePosts = [
//   checkUserActive, // Add this middleware
//   async (req, res) => {
//     try {
//       const userId = req.user.id;

//       const posts = await Post.find({
//         status: "active",
//         expiresAt: { $gt: new Date() },
//         investedUsers: { $ne: userId },
//         visibleTo: userId,
//       }).populate("createdBy", "username");

//       res.json(posts);
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   }
// ];


// In your getAvailablePosts controller - FIXED VERSION
// exports.getAvailablePosts = async (req, res) => {
//   try {
//     // const userId = req.user.id.toString(); // Ensure string format
//     const userId = req.user.id;

//     const posts = await Post.find({
//       status: "active",
//       expiresAt: { $gt: new Date() },
//       investedUsers: { $ne: userId }, // Exclude posts user already invested in
//       visibleTo: userId, // Only show posts where user is in visibleTo
//     }).populate("createdBy", "username");

//     // res.json(visiblePosts);
//     res.json(posts);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.createPost = async (req, res) => {
//   try {
//     const { productName, unitPrice, quantity, sellingUnitPrice, expectedProfit, timeLine } =
//       req.body;

//     if (!productName || !unitPrice || !quantity || !sellingUnitPrice || !expectedProfit || !timeLine) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     // Calculate full amount
//     const unitPriceNum = parseFloat(unitPrice);
//     const quantityNum = parseInt(quantity);
//     const fullAmount = unitPriceNum * quantityNum;

//     let imageUrl = null;

//     if (req.file) {
//       try {
//         const dataUri = `data:${
//           req.file.mimetype
//         };base64,${req.file.buffer.toString("base64")}`;
//         const result = await cloudinary.uploader.upload(dataUri, {
//           folder: "post_images",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         });
//         imageUrl = result.secure_url;
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           msg: "Failed to upload image to Cloudinary",
//           error: uploadError.message,
//         });
//       }
//     }

//     // Get ONLY ACTIVE users except the current admin
//     const users = await User.find({
//       _id: { $ne: req.user.id },
//       role: "user",
//       isActive: true, // Only include active users
//     });

//     const newPost = new Post({
//       productName,
//       unitPrice: unitPriceNum,
//       quantity: quantityNum,
//       fullAmount,
//       sellingUnitPrice,
//       expectedProfit,
//       timeLine,
//       image: imageUrl,
//       createdBy: req.user.id,
//       visibleTo: users.map((user) => user._id), // Only visible to active users
//       sharedWith: users.map((user) => user._id), // Shared with all active users
//       expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
//     });

//     await newPost.save();

//     // Send emails to all ACTIVE users
//     const userEmails = users.map((user) => user.email);
//     await sendPostEmails(userEmails, newPost);

//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error("Error in createPost:", error);
//     res.status(500).json({
//       msg: error.message,
//       error: error.stack,
//     });
//   }
// };

// exports.createPost = async (req, res) => {
//   try {
//     const { productName, unitPrice,quantity, sellingUnitPrice,  expectedProfit, timeLine } =
//       req.body;

//       //  const fullAmount = parseFloat(unitPrice) * parseFloat(quantity);
//           // Validate required fields
//     if (!productName || !unitPrice || !quantity || !sellingUnitPrice || !expectedProfit || !timeLine) {
//       return res.status(400).json({ msg: "All fields are required" });
//     }

//     // Calculate full amount
//     const unitPriceNum = parseFloat(unitPrice);
//     const quantityNum = parseInt(quantity);
//     const fullAmount = unitPriceNum * quantityNum;

//     let imageUrl = null;

//     if (req.file) {
//       try {
//         const dataUri = `data:${
//           req.file.mimetype
//         };base64,${req.file.buffer.toString("base64")}`;
//         const result = await cloudinary.uploader.upload(dataUri, {
//           folder: "post_images",
//           transformation: { width: 800, height: 600, crop: "limit" },
//         });
//         imageUrl = result.secure_url;
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           msg: "Failed to upload image to Cloudinary",
//           error: uploadError.message,
//         });
//       }
//     }

//     // Get ALL users except the current admin
//     const users = await User.find({
//       _id: { $ne: req.user.id }, // Exclude current admin
//       role: "user", // Only regular users
//     });

//     const newPost = new Post({
//       productName,
//      unitPrice: unitPriceNum,
//       quantity: quantityNum,
//        fullAmount,
//        sellingUnitPrice,
//       expectedProfit,
//       timeLine,
//       image: imageUrl,
//       createdBy: req.user.id,
//       visibleTo: users.map((user) => user._id), // Visible to all regular users
//       sharedWith: users.map((user) => user._id), // Shared with all regular users
//       // visibleTo: [],
//       // sharedWith: [],
//       expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
//     });

//     await newPost.save();
//     console.log(newPost);

//     // Send emails to all users
//     // const userEmails = users.map((user) => user.email);
//     // await sendPostEmails(userEmails, newPost);

//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error("Error in createPost:", error);
//     res.status(500).json({
//       msg: error.message,
//       error: error.stack,
//     });
//   }
// };

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "createdBy",
      "username email"
    );

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get active posts for users
exports.getActivePosts = async (req, res) => {
  try {
    const posts = await Post.find({
      expiresAt: { $gt: new Date() }, // Only posts not expired
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get posts by user ID
exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({
      createdBy: req.params.userId,
      status: "active", // Only show active posts
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const {
      productName,
      fullAmount,
      unitPrice,
      expectedProfit,
      timeLine,
      status,
      description,
    } = req.body;

    const updateData = {
      productName,
      fullAmount: parseFloat(fullAmount),
      unitPrice: parseFloat(unitPrice),
      expectedProfit: parseFloat(expectedProfit),
      timeLine,
      status,
      description,
    };

    // Handle image update if exists
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Add this to your post controller file (where your other post routes are)

// Delete post by ID
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Optional: Check if user is authorized to delete (admin or post creator)
    // For admin-only deletion:
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Unauthorized - Admin access required" });
    }

    // If the post has an image, delete it from Cloudinary first
    if (post.image) {
      try {
        // Extract public ID from Cloudinary URL
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`post_images/${publicId}`);
      } catch (cloudinaryErr) {
        console.error("Error deleting image from Cloudinary:", cloudinaryErr);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Optional: Delete related orders if needed
    // await Order.deleteMany({ post: postId });

    res.json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};

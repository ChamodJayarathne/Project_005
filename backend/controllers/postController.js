const Order = require("../models/Order");
const Post = require("../models/Post");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");

// Email sending function
async function sendPostEmails(emails, post) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(","),
    subject: "New Product Available for Purchase",
    html: `
      <h1>New Product: ${post.productName}</h1>
      <p>Full Amount: Rs.${post.fullAmount}</p>
    <p>Unit Price: Rs.${post.unitPrice}</p>
      <p>Expected Profit: Rs.${post.expectedProfit}</p>
      <p>Time Line: ${post.timeLine}</p>
      ${
        post.image
          ? `<img src="${process.env.FRONTEND_BASE_local_URL}/${post.image}" alt="${post.productName}" width="300">`
          : ""
      }
      <p>Login to your account to purchase this item!</p>
      <a href="${
        process.env.FRONTEND_BASE_local_URL
      }/api/auth/login">Go to the Dashboard</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Emails sent successfully");
  } catch (err) {
    console.error("Error sending emails:", err);
    throw err;
  }
}

// // Modified WhatsApp sending function

exports.getAdminData = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
};

// Get admin dashboard data
exports.getAdminData = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
};

// In your getAvailablePosts controller - FIXED VERSION
exports.getAvailablePosts = async (req, res) => {
  try {
    // const userId = req.user.id.toString(); // Ensure string format
    const userId = req.user.id;

    const posts = await Post.find({
      status: "active",
      expiresAt: { $gt: new Date() },
      investedUsers: { $ne: userId }, // Exclude posts user already invested in
      visibleTo: userId, // Only show posts where user is in visibleTo
    }).populate("createdBy", "username");

    // res.json(visiblePosts);
    res.json(posts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { productName, unitPrice,quantity, sellingUnitPrice,  expectedProfit, timeLine } =
      req.body;

      //  const fullAmount = parseFloat(unitPrice) * parseFloat(quantity);
          // Validate required fields
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
    const users = await User.find({
      _id: { $ne: req.user.id }, // Exclude current admin
      role: "user", // Only regular users
    });

    const newPost = new Post({
      productName,
     unitPrice: unitPriceNum,
      quantity: quantityNum,
       fullAmount,
       sellingUnitPrice,
      expectedProfit,
      timeLine,
      image: imageUrl,
      createdBy: req.user.id,
      visibleTo: users.map((user) => user._id), // Visible to all regular users
      sharedWith: users.map((user) => user._id), // Shared with all regular users
      // visibleTo: [],
      // sharedWith: [],
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    });

    await newPost.save();
    console.log(newPost);

    // Send emails to all users
    // const userEmails = users.map((user) => user.email);
    // await sendPostEmails(userEmails, newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({
      msg: error.message,
      error: error.stack,
    });
  }
};

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

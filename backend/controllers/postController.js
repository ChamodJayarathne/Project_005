const Order = require("../models/Order");
const Post = require("../models/Post");
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
    <p>Full Amount: Rs.${post.unitPrice}</p>
      <p>Expected Profit: Rs.$${post.expectedProfit}</p>
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

exports.getAvailablePosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all active posts not expired
    const activePosts = await Post.find({
      status: "active",
      expiresAt: { $gt: new Date() },
    }).populate("createdBy", "username");

    // Filter posts visible to current user
    const visiblePosts = activePosts.filter((post) => {
      const isCreator =
        post.createdBy &&
        post.createdBy._id &&
        post.createdBy._id.equals(userId);
      return (
        // User is in visibleTo array
        post.visibleTo.includes(userId) ||
        // User created the post (admin)
        isCreator
        // post.createdBy._id.equals(userId)
        //  ||
        // User has invested in this post
        // post.investedUsers.includes(userId)
      );
    });

    res.json(visiblePosts);
  } catch (error) {
    console.error("Error in getAvailablePosts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { productName, fullAmount, unitPrice, expectedProfit, timeLine } =
      req.body;

    const newPost = new Post({
      productName,
      fullAmount,
      unitPrice,
      expectedProfit,
      timeLine,
      image: req.file ? req.file.path : null,
      createdBy: req.user.id,
      visibleTo: [],
      sharedWith: [],
    });

    // Get users to share with (excluding admin)
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: req.user.id }, role: "user" },
      },
    ]).limit(8);

    // Update both sharedWith and visibleTo arrays
    newPost.sharedWith = users.map((user) => user._id);
    newPost.visibleTo = users.map((user) => user._id);

    await newPost.save();

    // Send emails
    const userEmails = users.map((user) => user.email);
    await sendPostEmails(userEmails, newPost);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ msg: error.message });
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

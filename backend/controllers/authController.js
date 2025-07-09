const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;

    // Add profile image handling
    const profileImage = req.file ? req.file.path : null;

    if (!username || !password || !email || !phoneNumber || !role) {
      return res.status(400).json({
        msg: "Please provide username, email, password,phoneNumber, and role",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid email address" });
    }

    // Phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid international phone number" });
    }

    // Prevent multiple admins
    if (role === "admin") {
      const adminExists = await User.exists({ role: "admin" });
      if (adminExists) {
        return res.status(400).json({
          msg: "Admin registration is disabled. Only one admin allowed",
        });
      }
    }

    // const existingUser = await User.findOne({ username, email });
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profileImage,
    });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide username and password" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Prevent creating new admins via update
    if (role === "admin" && user.role !== "admin") {
      const adminExists = await User.exists({
        role: "admin",
        _id: { $ne: user._id },
      });
      if (adminExists) {
        return res.status(400).json({
          msg: "Cannot assign admin role. Only one admin allowed in system",
        });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    console.log("Current user request received for ID:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      console.log("User not found for ID:", req.user.id);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Sending user data:", user);
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
};

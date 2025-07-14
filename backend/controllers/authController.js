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
      plainPassword: password,
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
// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id, "-password");
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     // For editing purposes, we might want to return an empty password field
//     const user = await User.findById(req.params.id, "-password");
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     // Return user data with empty password field for editing
//     res.json({
//       ...user.toObject(),
//       password: "", // Empty password field for editing
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id, "-password"); // Still exclude hashed password
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({
//       ...user.toObject(),
//       password: user.plainTextPassword || "", // ⚠️ INSECURE: Return plain text password
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     // const { username, email, password, role, phoneNumber } = req.body;
//     // const user = await User.findById(req.params.id);

//     // if (!user) return res.status(404).json({ msg: "User not found" });

//     const { username, email, password, role, phoneNumber } = req.body;
//     const user = await User.findById(req.params.id);

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     // Email format validation if email is being updated
//     if (email && email !== user.email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res
//           .status(400)
//           .json({ msg: "Please provide a valid email address" });
//       }
//     }

//     // Phone number validation if phoneNumber is being updated
//     if (phoneNumber && phoneNumber !== user.phoneNumber) {
//       const phoneRegex = /^\+[1-9]\d{1,14}$/;
//       if (!phoneRegex.test(phoneNumber)) {
//         return res
//           .status(400)
//           .json({ msg: "Please provide a valid international phone number" });
//       }
//     }

//     // Prevent creating new admins via update
//     if (role === "admin" && user.role !== "admin") {
//       const adminExists = await User.exists({
//         role: "admin",
//         _id: { $ne: user._id },
//       });
//       if (adminExists) {
//         return res.status(400).json({
//           msg: "Cannot assign admin role. Only one admin allowed in system",
//         });
//       }
//     }

//     // Check for existing username or email (excluding current user)
//     if (username || email) {
//       const existingUser = await User.findOne({
//         $or: [
//           ...(username ? [{ username }] : []),
//           ...(email ? [{ email }] : []),
//         ],
//         _id: { $ne: user._id },
//       });

//       if (existingUser) {
//         return res
//           .status(400)
//           .json({ msg: "Username or email already exists" });
//       }
//     }

//     user.username = username || user.username;
//     user.email = email || user.email;
//     user.role = role || user.role;
//     user.phoneNumber = phoneNumber || user.phoneNumber;

//     // Update password if provided
//     if (password && password.trim() !== "") {
//       const salt = await bcrypt.genSalt(8);
//       user.password = await bcrypt.hash(password, salt);
//       user.plainTextPassword = password; // ⚠️ INSECURE: Store plain text
//     }

//     await user.save();
//     res.json({ msg: "User updated successfully" });

//     // Update fields
//     // user.username = username || user.username;
//     // user.email = email || user.email;
//     // user.role = role || user.role;
//     // user.phoneNumber = phoneNumber || user.phoneNumber;

//     // // Hash password if provided
//     // if (password && password.trim() !== "") {
//     //   const salt = await bcrypt.genSalt(8);
//     //   user.password = await bcrypt.hash(password, salt);
//     // }

//     // await user.save();
//     // res.json({ msg: "User updated successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { username, email, password, role, phoneNumber } = req.body;
//     const user = await User.findById(req.params.id);

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     // Prevent creating new admins via update
//     if (role === "admin" && user.role !== "admin") {
//       const adminExists = await User.exists({
//         role: "admin",
//         _id: { $ne: user._id },
//       });
//       if (adminExists) {
//         return res.status(400).json({
//           msg: "Cannot assign admin role. Only one admin allowed in system",
//         });
//       }
//     }

//     user.username = username || user.username;
//     user.email = email || user.email;
//     user.password = password || user.password;
//     user.role = role || user.role;
//     user.phoneNumber = phoneNumber || user.phoneNumber;

//     await user.save();
//     res.json({ msg: "User updated successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id, "-password"); // Exclude hashed password
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({
//       ...user.toObject(),
//       password: user.plainPassword || "", // Return plain text password
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -plainPassword"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Modified updateUser function
const updateUser = async (req, res) => {
  try {
    const { username, email, password, role, phoneNumber } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Email format validation if email is being updated
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ msg: "Please provide a valid email address" });
      }
    }

    // Phone number validation if phoneNumber is being updated
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res
          .status(400)
          .json({ msg: "Please provide a valid international phone number" });
      }
    }

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

    // Check for existing username or email (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "Username or email already exists" });
      }
    }

    // Update user with password hashing if provided
    const updateData = { username, email, role, phoneNumber };

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(8);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ msg: "User updated successfully" });

    // // Update fields
    // user.username = username || user.username;
    // user.email = email || user.email;
    // user.role = role || user.role;
    // user.phoneNumber = phoneNumber || user.phoneNumber;
    // // user.updatedAt = new Date();

    // // Update password if provided
    // if (password && password.trim() !== "") {
    //   const salt = await bcrypt.genSalt(8);
    //   user.password = await bcrypt.hash(password, salt);
    //   user.plainPassword = password; // Store plain text password
    // }

    // await user.save();
    // res.json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id; // Changed from req.user.id to req.params.id for admin use

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Please provide both current and new password" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    // Update password
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const userId = req.user.id; // From auth middleware

//     if (!currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .json({ msg: "Please provide both current and new password" });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch)
//       return res.status(400).json({ msg: "Current password is incorrect" });

//     const salt = await bcrypt.genSalt(8);
//     user.password = await bcrypt.hash(newPassword, salt);
//     await user.save();

//     res.json({ msg: "Password updated successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

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
  changePassword,
  deleteUser,
  getCurrentUser,
};

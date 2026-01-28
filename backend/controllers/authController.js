const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const cloudinary = require("../config/cloudinary");

// Initialize Google OAuth client
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);



// Google OAuth Verification
// const verifyGoogleToken = async (token) => {
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: CLIENT_ID,
//     });
//     return ticket.getPayload();
//   } catch (error) {
//     console.error("Google token verification error:", error);
//     return null;
//   }
// };

const verifyGoogleToken = async (token) => {
  try {
    console.log("Verifying Google token, length:", token.length);
    
    if (!token || token.length < 100) {
      console.error("Token appears invalid, too short");
      return null;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    console.log("Token verified successfully for:", payload.email);
    return payload;
    
  } catch (error) {
    console.error("Google token verification error details:", {
      error: error.message,
      errorType: error.name,
      tokenSample: token?.substring(0, 50)
    });
    
    // Check specific error types
    if (error.message.includes('Token used too late')) {
      console.error("Token expired");
    } else if (error.message.includes('Wrong number of segments')) {
      console.error("Invalid token format");
    } else if (error.message.includes('invalid signature')) {
      console.error("Invalid token signature");
    }
    
    return null;
  }
};

// Google OAuth Login/Signup
// Google OAuth Login/Signup
// const googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     if (!token) {
//       return res.status(400).json({ msg: "Google token is required" });
//     }

//     // Verify Google token
//     const googleUser = await verifyGoogleToken(token);
    
//     if (!googleUser) {
//       return res.status(400).json({ msg: "Invalid Google token" });
//     }

//     const { sub: googleId, email, name, picture } = googleUser;

//     // Check if user exists with this Google ID
//     let user = await User.findOne({ googleId });

//     if (!user) {
//       // Check if user exists with this email (for existing users who want to link Google)
//       user = await User.findOne({ email });

//       if (user) {
//         // If user exists but doesn't have Google ID, link it
//         user.googleId = googleId;
//         user.provider = "google";
//         if (!user.profileImage && picture) {
//           user.profileImage = picture;
//         }
//         await user.save();
//       } else {
//         // Create new user for Google OAuth
//         // Generate a unique username from email
//         const baseUsername = email.split('@')[0];
//         let username = baseUsername;
//         let counter = 1;

//         // Ensure unique username
//         while (await User.findOne({ username })) {
//           username = `${baseUsername}${counter}`;
//           counter++;
//         }

//         user = new User({
//           username,
//           email,
//           googleId,
//           provider: "google",
//           profileImage: picture,
//           role: "user", // Default role for Google OAuth users
//           // Note: phoneNumber, password, and plainPassword are not required for Google users
//         });

//         await user.save();
//       }
//     }

//     // Generate JWT token
//     const jwtToken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token: jwtToken,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//         email: user.email,
//         profileImage: user.profileImage,
//         provider: user.provider,
//       },
//     });
//   } catch (error) {
//     console.error("Google auth error:", error);
    
//     // More specific error messages
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ 
//         msg: "Validation error", 
//         errors: messages 
//       });
//     }
    
//     res.status(500).json({ msg: error.message });
//   }
// };
// Google OAuth Login/Signup

// Google OAuth Login/Signup with better error handling
const googleAuth = async (req, res) => {
  try {
    console.log("=== GOOGLE AUTH REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Token received:", !!req.body.token);
    
    const { token } = req.body;
    
    // Validate token
    if (!token || token.trim() === "" || token === "undefined") {
      console.error("Token validation failed - token is empty or undefined");
      return res.status(400).json({ 
        msg: "Google token is required",
        debug: {
          tokenExists: !!token,
          tokenType: typeof token,
          tokenLength: token?.length,
          tokenSample: token?.substring(0, 20)
        }
      });
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(token);
    
    if (!googleUser) {
      console.error("Google token verification failed");
      return res.status(400).json({ 
        msg: "Invalid Google token",
        debug: { tokenLength: token.length }
      });
    }

    console.log("Google user verified successfully:", {
      email: googleUser.email,
      googleId: googleUser.sub,
      name: googleUser.name,
      emailVerified: googleUser.email_verified
    });

    const { sub: googleId, email, name, picture, email_verified } = googleUser;

    // Normalize email (lowercase)
    const normalizedEmail = email.toLowerCase();

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // User exists with this email
        if (user.provider === 'google') {
          // User already has Google account but different Google ID
          console.log("Google user found with different Google ID, updating...");
          user.googleId = googleId;
          if (!user.profileImage && picture) {
            user.profileImage = picture;
          }
          await user.save();
        } else if (user.provider === 'local') {
          // Local user exists with this email
          console.log("Local user found with same email:", user.email);
          return res.status(409).json({ 
            msg: `This email (${user.email}) is already registered as a local user. Please login with your password or use password reset.`,
            existingUser: {
              provider: user.provider,
              hasPassword: !!user.password
            }
          });
        }
      } else {
        // Create new Google user
        console.log("Creating new Google user for:", normalizedEmail);
        
        // Generate a unique username
        const baseUsername = normalizedEmail.split('@')[0];
        let username = baseUsername;
        let counter = 1;

        // Ensure unique username
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        user = new User({
          username,
          email: normalizedEmail,
          googleId,
          provider: "google",
          profileImage: picture,
          role: "user",
          emailVerified: email_verified || false,
          // No password or phoneNumber required for Google users
        });

        await user.save();
        console.log("New Google user created successfully:", user.email);
      }
    } else {
      console.log("Existing Google user found:", user.email);
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        provider: user.provider 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("JWT token generated successfully for:", user.email);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("=== GOOGLE AUTH ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.error("Validation errors:", messages);
      return res.status(400).json({ 
        msg: "User validation failed", 
        errors: messages,
        details: "Please check your User model schema"
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyValue);
      return res.status(409).json({ 
        msg: "User already exists with this email or username",
        duplicateField: Object.keys(error.keyValue)[0]
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      msg: "Internal server error during Google authentication",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// const googleAuth = async (req, res) => {
//   try {
//     console.log("Google auth request received");
//     console.log("Request body:", req.body);
    
//     const { token } = req.body;
    
//     if (!token || token.trim() === "") {
//       console.error("No token provided or empty token");
//       return res.status(400).json({ 
//         msg: "Google token is required",
//         receivedToken: !!token 
//       });
//     }

//     // Verify Google token
//     const googleUser = await verifyGoogleToken(token);
    
//     if (!googleUser) {
//       console.error("Invalid Google token");
//       return res.status(400).json({ msg: "Invalid Google token" });
//     }

//     console.log("Google user verified:", {
//       email: googleUser.email,
//       googleId: googleUser.sub,
//       name: googleUser.name
//     });

//     const { sub: googleId, email, name, picture } = googleUser;

//     // Check if user exists with this Google ID
//     let user = await User.findOne({ googleId });

//     if (!user) {
//       // Check if user exists with this email (for existing users who want to link Google)
//       user = await User.findOne({ email });

//       if (user) {
//         // If user exists but doesn't have Google ID, check if they're a local user
//         if (user.provider === 'local') {
//           console.log("Local user found with same email, cannot use Google OAuth");
//           return res.status(400).json({ 
//             msg: "This email is already registered. Please use email/password login or reset your password." 
//           });
//         }
        
//         // If it's already a Google user, update the Google ID if missing
//         user.googleId = googleId;
//         if (!user.profileImage && picture) {
//           user.profileImage = picture;
//         }
//         await user.save();
//       } else {
//         // Create new user for Google OAuth
//         // Generate a unique username from email
//         const baseUsername = email.split('@')[0];
//         let username = baseUsername;
//         let counter = 1;

//         // Ensure unique username
//         while (await User.findOne({ username })) {
//           username = `${baseUsername}${counter}`;
//           counter++;
//         }

//         user = new User({
//           username,
//           email,
//           googleId,
//           provider: "google",
//           profileImage: picture,
//           role: "user", // Default role for Google OAuth users
//           // Note: phoneNumber, password, and plainPassword are not required for Google users
//         });

//         await user.save();
//         console.log("New Google user created:", user.email);
//       }
//     }

//     // Generate JWT token
//     const jwtToken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     console.log("JWT token generated for user:", user.email);

//     res.json({
//       token: jwtToken,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//         email: user.email,
//         profileImage: user.profileImage,
//         provider: user.provider,
//       },
//     });
//   } catch (error) {
//     console.error("Google auth error:", error);
    
//     // More specific error messages
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ 
//         msg: "Validation error", 
//         errors: messages 
//       });
//     }
    
//     res.status(500).json({ msg: error.message });
//   }
// };

// const googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     if (!token) {
//       return res.status(400).json({ msg: "Google token is required" });
//     }

//     // Verify Google token
//     const googleUser = await verifyGoogleToken(token);
    
//     if (!googleUser) {
//       return res.status(400).json({ msg: "Invalid Google token" });
//     }

//     const { sub: googleId, email, name, picture } = googleUser;

//     // Check if user exists with this Google ID
//     let user = await User.findOne({ googleId });

//     if (!user) {
//       // Check if user exists with this email (for existing users who want to link Google)
//       user = await User.findOne({ email });

//       if (user) {
//         // If user exists but doesn't have Google ID, link it
//         user.googleId = googleId;
//         user.provider = "google";
//         if (!user.profileImage && picture) {
//           user.profileImage = picture;
//         }
//         await user.save();
//       } else {
//         // Create new user for Google OAuth
//         // Generate a unique username from email
//         const baseUsername = email.split('@')[0];
//         let username = baseUsername;
//         let counter = 1;

//         // Ensure unique username
//         while (await User.findOne({ username })) {
//           username = `${baseUsername}${counter}`;
//           counter++;
//         }

//         user = new User({
//           username,
//           email,
//           googleId,
//           provider: "google",
//           profileImage: picture,
//           role: "user", // Default role for Google OAuth users
//         });

//         await user.save();
//       }
//     }

//     // Generate JWT token
//     const jwtToken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token: jwtToken,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//         email: user.email,
//         profileImage: user.profileImage,
//         provider: user.provider,
//       },
//     });
//   } catch (error) {
//     console.error("Google auth error:", error);
//     res.status(500).json({ msg: error.message });
//   }
// };

// Modified registerUser function to handle Google OAuth users
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role, googleToken } = req.body;

    // If Google token is provided, handle Google OAuth registration
    if (googleToken) {
      return await googleAuth(req, res);
    }

    // Existing registration logic...
    let profileImageUrl = null;
    if (req.file) {
      // Convert buffer to data URI
      const dataUri = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "profile_images",
        transformation: { width: 500, height: 500, crop: "limit" },
      });

      profileImageUrl = result.secure_url;
    }

    if (!username || !password || !email || !phoneNumber || !role) {
      return res.status(400).json({
        msg: "Please provide username, email, password, phoneNumber, and role",
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
      profileImage: profileImageUrl,
      provider: "local",
    });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Modified loginUser function to also handle Google OAuth
// const loginUser = async (req, res) => {
//   try {
//     const { username, password, googleToken } = req.body;
    
//     // Handle Google OAuth login
//     if (googleToken) {
//       return await googleAuth(req, res);
//     }

//     // Existing login logic...
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ msg: "Please provide username and password" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     // Check if user is a Google OAuth user trying to use password
//     if (user.provider === "google") {
//       return res.status(400).json({ 
//         msg: "Please use Google Sign-In for this account" 
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//         email: user.email,
//         profileImage: user.profileImage,
//         provider: user.provider,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { username, password, googleToken } = req.body;
    
    // Handle Google OAuth login
    if (googleToken) {
      return await googleAuth(req, res);
    }

    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide username and password" });
    }

    const user = await User.findOne({ 
      $or: [
        { username },
        { email: username } // Allow login with email too
      ]
    });
    
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Check if user is a Google OAuth user trying to use password
    if (user.provider === "google") {
      return res.status(400).json({ 
        msg: "This account uses Google Sign-In. Please use Google to login." 
      });
    }

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
        provider: user.provider,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password, phoneNumber, role } = req.body;

//     let profileImageUrl = null;
//     if (req.file) {
//       // Convert buffer to data URI
//       const dataUri = `data:${
//         req.file.mimetype
//       };base64,${req.file.buffer.toString("base64")}`;

//       // Upload to Cloudinary
//       const result = await cloudinary.uploader.upload(dataUri, {
//         folder: "profile_images",
//         transformation: { width: 500, height: 500, crop: "limit" },
//       });

//       profileImageUrl = result.secure_url;
//     }

//     // // Add profile image handling
//     // const profileImage = req.file ? req.file.path : null;

//     if (!username || !password || !email || !phoneNumber || !role) {
//       return res.status(400).json({
//         msg: "Please provide username, email, password,phoneNumber, and role",
//       });
//     }

//     // Email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res
//         .status(400)
//         .json({ msg: "Please provide a valid email address" });
//     }

//     // Phone number validation
//     const phoneRegex = /^\+[1-9]\d{1,14}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       return res
//         .status(400)
//         .json({ msg: "Please provide a valid international phone number" });
//     }

//     // Prevent multiple admins
//     if (role === "admin") {
//       const adminExists = await User.exists({ role: "admin" });
//       if (adminExists) {
//         return res.status(400).json({
//           msg: "Admin registration is disabled. Only one admin allowed",
//         });
//       }
//     }

//     // const existingUser = await User.findOne({ username, email });
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(8);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       plainPassword: password,
//       phoneNumber,
//       role,
//       // profileImage,
//       profileImage: profileImageUrl,
//     });
//     await newUser.save();

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ msg: "Please provide username and password" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//         email: user.email,
//         profileImage: user.profileImage,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };




// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Select all fields except sensitive ones
    const users = await User.find({})
      .select('-password -plainPassword')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`Retrieved ${users.length} users`);
    
    // Log each user's isActive status for debugging
    users.forEach(user => {
      console.log(`User ${user.username} (${user._id}) - isActive: ${user.isActive}`);
    });
    
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: error.message });
  }
};


// Get all users (admin only)
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, "-password");
//     res.json(users);
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
// const updateUser = async (req, res) => {
//   try {
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

//     // Update user with password hashing if provided
//     const updateData = { username, email, role, phoneNumber };

//     if (password && password.trim() !== "") {
//       const salt = await bcrypt.genSalt(8);
//       updateData.password = await bcrypt.hash(password, salt);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json({ msg: "User updated successfully" });

    
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

const updateUser = async (req, res) => {
  try {
    const { username, email, password, role, phoneNumber, isActive } = req.body;
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

    // Update user data
    const updateData = { 
      username: username || user.username,
      email: email || user.email, 
      role: role || user.role, 
      phoneNumber: phoneNumber || user.phoneNumber
    };
    
    // Add isActive field if provided (allow setting to false)
    if (isActive !== undefined) {
      updateData.isActive = isActive;
      console.log(`Setting user ${user._id} isActive to: ${isActive}`);
    }

    // Handle password update
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(8);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Log the update for debugging
    console.log(`Updating user ${req.params.id} with data:`, updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log(`User updated successfully. New status: isActive = ${updatedUser.isActive}`);

    res.json({ 
      msg: "User updated successfully",
      user: updatedUser 
    });
    
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ 
      msg: error.message,
      details: error.errors || "Internal server error"
    });
  }
};

// const updateUser = async (req, res) => {
//   try {
//     const { username, email, password, role, phoneNumber, isActive } = req.body; // Added isActive
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

//     // Update user with password hashing if provided
//     const updateData = { username, email, role, phoneNumber };
    
//     // Add isActive field if provided
//     if (isActive !== undefined) {
//       updateData.isActive = isActive;
//     }

//     if (password && password.trim() !== "") {
//       const salt = await bcrypt.genSalt(8);
//       updateData.password = await bcrypt.hash(password, salt);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json({ msg: "User updated successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id; // Changed from req.user.id to req.params.id for admin use

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Please provide both current and new password" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password is incorrect" });

    // Update password
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
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
       isActive: user.isActive,
    });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Toggle user status (enable/disable)
const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;

    console.log(`Toggling user ${userId} status to: ${isActive}`);

    // Validate input
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ 
        msg: "Invalid status value. Must be true or false." 
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent disabling admin accounts
    if (user.role === 'admin' && !isActive) {
      return res.status(400).json({ 
        msg: "Cannot disable admin account" 
      });
    }

    // Update only the isActive field
    user.isActive = isActive;
    await user.save();

    console.log(`User ${userId} status updated to: ${user.isActive}`);

    res.json({
      success: true,
      msg: `Account ${isActive ? 'enabled' : 'disabled'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ 
      success: false,
      msg: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth, 
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
  getCurrentUser,
  toggleUserStatus
  //   googleAuthCallback,
  // checkGoogleAuthStatus,
};

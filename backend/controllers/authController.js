const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const cloudinary = require("../config/cloudinary");
const nodemailer = require("nodemailer");

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

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Password Reset - Request Reset Link
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email, provider: 'local' });
    
    if (!user) {
      return res.status(404).json({ 
        msg: "No account found with this email address" 
      });
    }

    // Check if user is Google OAuth user
    if (user.provider === 'google') {
      return res.status(400).json({ 
        msg: "This account uses Google Sign-In. Please use Google to login." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token and expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_BASE_local_URL}/reset-password/${resetToken}`;
    
    // Email content
    const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: 'Password Reset Request - Wonder Choice',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Password Reset Request</h2>
      <p>Hello ${user.username},</p>
      <p>You requested to reset your password. Click the button below to reset your password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        <strong>Or copy and paste this link in your browser:</strong><br>
        <a href="${resetUrl}" style="color: #4F46E5; word-break: break-all;">${resetUrl}</a>
      </p>
      
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4F46E5;">
        <p style="margin: 0; color: #666; font-size: 13px;">
          <strong>Note:</strong> If the button above doesn't work, make sure you're clicking it from the same device where you requested the password reset.
        </p>
      </div>
      
      <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Wonder Choice Team<br>
        <a href="https://www.wonder-choice.com" style="color: #4F46E5;">www.wonder-choice.com</a>
      </p>
    </div>
  `
};
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: user.email,
    //   subject: 'Password Reset Request - Wonder Choice',
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h2 style="color: #4F46E5;">Password Reset Request</h2>
    //       <p>Hello ${user.username},</p>
    //       <p>You requested to reset your password. Click the link below to reset your password:</p>
    //       <div style="text-align: center; margin: 30px 0;">
    //         <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
    //           Reset Password
    //         </a>
    //       </div>
    //       <p>This link will expire in 1 hour.</p>
    //       <p>If you didn't request this, please ignore this email.</p>
    //       <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
    //       <p style="color: #666; font-size: 12px;">
    //         Wonder Choice Team<br>
    //         <a href="https://www.wonder-choice.com" style="color: #4F46E5;">www.wonder-choice.com</a>
    //       </p>
    //     </div>
    //   `
    // };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      msg: "Password reset link sent to your email" 
    });
    
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ 
      msg: "Error sending reset email. Please try again later." 
    });
  }
};

// Password Reset - Validate Token
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid reset token" 
      });
    }

    // Hash token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid or expired reset token" 
      });
    }

    res.json({ 
      success: true, 
      msg: "Token is valid" 
    });
    
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ 
      success: false, 
      msg: "Error validating token" 
    });
  }
};

// Password Reset - Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    // Validate inputs
    if (!password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        msg: "Please provide password and confirm password" 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        msg: "Passwords do not match" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        msg: "Password must be at least 6 characters" 
      });
    }

    // Hash token to compare
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.plainPassword = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Successful - Wonder Choice',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Successful</h2>
          <p>Hello ${user.username},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
          <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Wonder Choice Team<br>
            <a href="https://www.wonder-choice.com" style="color: #4F46E5;">www.wonder-choice.com</a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      msg: "Password reset successfully. You can now login with your new password." 
    });
    
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      success: false, 
      msg: "Error resetting password" 
    });
  }
};

// Update existing functions to include email verification
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role, googleToken } = req.body;

    if (googleToken) {
      return await googleAuth(req, res);
    }

    let profileImageUrl = null;
    if (req.file) {
      const dataUri = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid email address" });
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid international phone number" });
    }

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
      emailVerified: true, // Set to true for local registration
    });
    await newUser.save();

    // Send welcome email
    const welcomeMailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Welcome to Wonder Choice!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to Wonder Choice!</h2>
          <p>Hello ${newUser.username},</p>
          <p>Thank you for registering with Wonder Choice. Your account has been successfully created.</p>
          <p>You can now login and start exploring our platform.</p>
          <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Wonder Choice Team<br>
            <a href="https://www.wonder-choice.com" style="color: #4F46E5;">www.wonder-choice.com</a>
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(welcomeMailOptions);
      console.log("Welcome email sent successfully to:", newUser.email);
    } catch (mailError) {
      console.error("Error sending welcome email:", mailError);
      // We don't want to return an error to the user if the registration was successful
      // but only the email failed.
    }

    res.status(201).json({ 
      success: true,
      msg: "User registered successfully. Check your email for welcome message!" 
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      msg: error.message 
    });
  }
};


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




// Modified registerUser function to handle Google OAuth users
// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password, phoneNumber, role, googleToken } = req.body;

//     // If Google token is provided, handle Google OAuth registration
//     if (googleToken) {
//       return await googleAuth(req, res);
//     }

//     // Existing registration logic...
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

//     if (!username || !password || !email || !phoneNumber || !role) {
//       return res.status(400).json({
//         msg: "Please provide username, email, password, phoneNumber, and role",
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
//       profileImage: profileImageUrl,
//       provider: "local",
//     });
//     await newUser.save();

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

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

// controllers/authController.js - getCurrentUser function
const getCurrentUser = async (req, res) => {
  try {
    console.log("Current user request received for ID:", req.user.id);

    // Select all fields except password, include profileImage
    const user = await User.findById(req.user.id).select("-password -plainPassword");

    if (!user) {
      console.log("User not found for ID:", req.user.id);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("User found, profileImage:", user.profileImage);

    // Return complete user data including profileImage
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      isActive: user.isActive,
      provider: user.provider,
      // Add any other fields you need
    });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// const getCurrentUser = async (req, res) => {
//   try {
//     console.log("Current user request received for ID:", req.user.id);

//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       console.log("User not found for ID:", req.user.id);
//       return res.status(404).json({ msg: "User not found" });
//     }

//     console.log("Sending user data:", user);
//     res.json({
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       phoneNumber: user.phoneNumber,
//       profileImage: user.profileImage,
//        isActive: user.isActive,
//     });
//   } catch (error) {
//     console.error("Current user error:", error);
//     res.status(500).json({ msg: error.message });
//   }
// };

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
  toggleUserStatus,
   requestPasswordReset,
  validateResetToken,
  resetPassword
  //   googleAuthCallback,
  // checkGoogleAuthStatus,
};

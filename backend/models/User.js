
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: function() {
      return this.provider === 'local';
    },
    unique: true,
    sparse: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  },
  plainPassword: { 
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /\d{10,15}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: function() {
      return this.provider === 'local';
    }
  },
  role: { 
    type: String, 
    enum: ["admin", "user"], 
    default: "user" 
  },
  profileImage: { 
    type: String 
  },
  googleId: { 
    type: String, 
    sparse: true 
  },
  provider: { 
    type: String, 
    enum: ["local", "google"], 
    default: "local"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Password reset fields
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: { 
//     type: String, 
//     required: function() {
//       return this.provider === 'local'; // Only required for local users
//     },
//     unique: true,
//     sparse: true 
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
//   password: { 
//     type: String,
//     required: function() {
//       return this.provider === 'local'; // Only required for local users
//     }
//   },
//   plainPassword: { 
//     type: String,
//     required: function() {
//       return this.provider === 'local'; // Only required for local users
//     }
//   },
//   phoneNumber: {
//     type: String,
//     validate: {
//       validator: function (v) {
//         // Only validate if phoneNumber is provided
//         if (!v) return true; // Allow empty for Google users
//         return /\d{10,15}/.test(v);
//       },
//       message: (props) => `${props.value} is not a valid phone number!`,
//     },
//     required: function() {
//       return this.provider === 'local'; // Only required for local users
//     }
//   },
//   role: { 
//     type: String, 
//     enum: ["admin", "user"], 
//     default: "user" 
//   },
//   profileImage: { 
//     type: String 
//   },
//   googleId: { 
//     type: String, 
//     sparse: true 
//   },
//   provider: { 
//     type: String, 
//     enum: ["local", "google"], 
//     default:  "local"
//   },
//   isActive: {
//     type: Boolean,
//     default: true // New field to track account status
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   },
// }, {
//   timestamps: true // Adds createdAt and updatedAt automatically
// });

// module.exports = mongoose.model("User", userSchema);



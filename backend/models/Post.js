// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   productName: { type: String, required: true },
  
//   unitPrice: { type: Number, required: true },
//   quantity:{type:Number, required:true},
//   fullAmount: { type: Number, required: true },
//    sellingUnitPrice: { type: Number, required: true },
//   expectedProfit: { type: Number, required: true },
//   timeLine: { type: String, required: true },
//   image: { type: String },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdAt: { type: Date, default: Date.now },
//   sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
//   },
//   status: { type: String, enum: ["active", "archived"], default: "active" },
//   visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   investedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// });

// module.exports = mongoose.model("Post", postSchema);

const mongoose = require("mongoose");

// In your Post model file, update the schema to remove validation:
const postSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  fullAmount: { type: Number, required: true },
  sellingUnitPrice: { type: Number, required: true },
  expectedProfit: { type: Number, required: true },
  timeLine: { type: String, required: true },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  sharedWith: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: [] 
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  status: { 
    type: String, 
    enum: ["active", "archived"], 
    default: "active" 
  },
  visibleTo: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: []  // Make it default to empty array
  }],
  investedUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: [] 
  }],
});

// Remove any pre-save middleware that modifies visibleTo
// postSchema.pre('save', function(next) {
//   // Remove any validation logic here
//   next();
// });

// Add indexes for better performance
postSchema.index({ status: 1, expiresAt: 1 });
postSchema.index({ visibleTo: 1 });
postSchema.index({ investedUsers: 1 });

module.exports = mongoose.model("Post", postSchema);
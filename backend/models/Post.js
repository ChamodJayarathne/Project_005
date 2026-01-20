const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  
  unitPrice: { type: Number, required: true },
  quantity:{type:Number, required:true},
  fullAmount: { type: Number, required: true },
   sellingUnitPrice: { type: Number, required: true },
  expectedProfit: { type: Number, required: true },
  timeLine: { type: String, required: true },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  status: { type: String, enum: ["active", "archived"], default: "active" },
  visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  investedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Post", postSchema);

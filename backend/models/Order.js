const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["fullAmount", "expectedProfit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    fullAmount: { type: Number, required: true, min: 0 },
    expectedProfit: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    timeLine: { type: String, required: true },
    adminNotes: String,
    originalFullAmount: { type: Number, required: true, min: 0 },
    originalExpectedProfit: { type: Number, required: true, min: 0 },
    paymentHistory: [PaymentHistorySchema],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total paid amount
OrderSchema.virtual("totalPaid").get(function () {
  return (
    this.originalFullAmount -
    this.fullAmount +
    (this.originalExpectedProfit - this.expectedProfit)
  );
});

// Virtual for payment progress (0-100)
OrderSchema.virtual("paymentProgress").get(function () {
  const totalAmount = this.originalFullAmount + this.originalExpectedProfit;
  if (totalAmount <= 0) return 100;
  return Math.round((this.totalPaid / totalAmount) * 100);
});

// Middleware to set original amounts before saving new orders
OrderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.originalFullAmount = this.fullAmount;
    this.originalExpectedProfit = this.expectedProfit;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);

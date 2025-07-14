const Order = require("../models/Order");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createOrder = async (req, res) => {
  try {
    console.log("Incoming order data:", req.body);

    // Destructure all required fields from the request body
    const { postId, productName, unitPrice, fullAmount, expectedProfit,timeLine } = req.body;

    // Validate required fields
    if (!postId || !productName || !fullAmount || unitPrice || !expectedProfit || timeLine) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: postId, productName, fullAmount, expectedProfit",
      });
    }

    // Create the new order
    const newOrder = new Order({
      productName,
      fullAmount: Number(fullAmount),
      expectedProfit: Number(expectedProfit),

      post: postId,
      //   postFullAmount: post.fullAmount,
      //   postExpectedProfit: post.expectedProfit,
      timeLine: timeLine,
      user: req.user.id,
      status: "pending",
      originalFullAmount: fullAmount,
      originalExpectedProfit: expectedProfit,
      paymentHistory: [],
    });

    // Save the order to database
    const savedOrder = await newOrder.save();

    // Update the associated post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { investedUsers: req.user.id },
        $pull: { visibleTo: req.user.id },
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      throw new Error("Associated post not found");
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
      updatedPost: updatedPost,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

exports.approveOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("post");

    // Update post visibility - remove all users except investor and admin
    if (order?.post) {
      await Post.findByIdAndUpdate(order.post._id, {
        $set: {
          visibleTo: [
            order.user,
            order.post.createdBy, // Admin (post creator)
          ],
        },
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("post", "productName");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "productName fullAmount expectedProfit unitPrice status createdAt updatedAt originalFullAmount originalExpectedProfit"
      );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get expired orders cleanup job
exports.cleanExpiredOrders = async () => {
  const result = await Order.deleteMany({
    status: "pending",
    expiresAt: { $lt: new Date() },
  });
  console.log(`Cleaned up ${result.deletedCount} expired orders`);
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .populate("post", "productName image");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("post", "productName image");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { payNow, status, adminNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const updateData = {
      status: status || order.status,
      adminNotes: adminNotes || order.adminNotes,
    };

    // Process payment if payNow is provided
    if (payNow && payNow > 0) {
      const paymentAmount = parseFloat(payNow);
      let newFullAmount = order.fullAmount;
      let newExpectedProfit = order.expectedProfit;
      let remainingPayment = paymentAmount;
      const newPaymentHistory = [...order.paymentHistory];
      let paymentDescription = [];

      // First deduct from fullAmount if any remains
      if (newFullAmount > 0) {
        const deductionFromFull = Math.min(remainingPayment, newFullAmount);
        newFullAmount -= deductionFromFull;
        remainingPayment -= deductionFromFull;

        if (deductionFromFull > 0) {
          newPaymentHistory.push({
            type: "fullAmount",
            amount: deductionFromFull,
            description: `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`,
          });
          paymentDescription.push(
            `Full Amount: -RS ${deductionFromFull.toLocaleString()}`
          );
        }
      }

      // Then deduct from expectedProfit if payment remains
      if (remainingPayment > 0 && newExpectedProfit > 0) {
        const deductionFromProfit = Math.min(
          remainingPayment,
          newExpectedProfit
        );
        newExpectedProfit -= deductionFromProfit;
        remainingPayment -= deductionFromProfit;

        if (deductionFromProfit > 0) {
          newPaymentHistory.push({
            type: "expectedProfit",
            amount: deductionFromProfit,
            description: `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`,
          });
          paymentDescription.push(
            `Expected Profit: -RS ${deductionFromProfit.toLocaleString()}`
          );
        }
      }

      // Update the amounts
      updateData.fullAmount = newFullAmount;
      updateData.expectedProfit = newExpectedProfit;
      updateData.paymentHistory = newPaymentHistory;

      // Check if there's any payment left that couldn't be applied
      if (remainingPayment > 0) {
        return res.status(400).json({
          success: false,
          msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
          paymentDetails: paymentDescription.join("\n"),
          remaining: {
            fullAmount: newFullAmount,
            expectedProfit: newExpectedProfit,
          },
        });
      }

      // Mark as completed if all amounts are paid
      if (newFullAmount <= 0 && newExpectedProfit <= 0) {
        updateData.status = "completed";
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment processed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { payNow, adminNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const paymentAmount = parseFloat(payNow);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ msg: "Invalid payment amount" });
    }

    let newFullAmount = order.fullAmount;
    let newExpectedProfit = order.expectedProfit;
    let remainingPayment = paymentAmount;
    const newPaymentHistory = [...order.paymentHistory];
    let paymentDescription = [];

    if (newFullAmount > 0) {
      const deductionFromFull = Math.min(remainingPayment, newFullAmount);
      newFullAmount -= deductionFromFull;
      remainingPayment -= deductionFromFull;

      if (deductionFromFull > 0) {
        newPaymentHistory.push({
          type: "fullAmount",
          amount: deductionFromFull,
          description: `Payment of RS ${deductionFromFull.toLocaleString()} deducted from Full Amount`,
        });
        paymentDescription.push(
          `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
        );
      }
    }

    if (remainingPayment > 0 && newExpectedProfit > 0) {
      const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
      newExpectedProfit -= deductionFromProfit;

      if (deductionFromProfit > 0) {
        newPaymentHistory.push({
          type: "expectedProfit",
          amount: deductionFromProfit,
          description: `Payment of RS ${deductionFromProfit.toLocaleString()} deducted from Expected Profit`,
        });
        paymentDescription.push(
          `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
        );
      }
    }

    // Check if there's any payment left that couldn't be applied
    if (remainingPayment > 0) {
      return res.status(400).json({
        msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
        fullAmount: newFullAmount,
        expectedProfit: newExpectedProfit,
      });
    }

    // Update order status if fully paid
    const newStatus =
      newFullAmount <= 0 && newExpectedProfit <= 0 ? "completed" : order.status;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        fullAmount: newFullAmount,
        expectedProfit: newExpectedProfit,
        paymentHistory: newPaymentHistory,
        status: newStatus,
        adminNotes: adminNotes || order.adminNotes,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: paymentDescription.join("\n"),
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Add this to your orderController.js
exports.getUserProfitSummary = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .select(
        "fullAmount expectedProfit originalFullAmount originalExpectedProfit status"
      )
      .lean();

    const summary = orders.reduce(
      (acc, order) => {
        const paidFull = order.originalFullAmount - order.fullAmount;
        const paidProfit = order.originalExpectedProfit - order.expectedProfit;
        const totalPaid = paidProfit;

        acc.totalOrders += 1;
        acc.totalPaid += totalPaid;
        acc.totalRemaining += order.expectedProfit;

        if (order.status === "completed") {
          acc.completedOrders += 1;
        } else if (order.status === "approved") {
          acc.activeOrders += 1;
        }

        return acc;
      },
      {
        totalOrders: 0,
        completedOrders: 0,
        activeOrders: 0,
        totalPaid: 0,
        totalRemaining: 0,
      }
    );

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate profit summary",
      error: error.message,
    });
  }
};

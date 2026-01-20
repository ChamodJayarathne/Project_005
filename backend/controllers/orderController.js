// // const Order = require("../models/Order");
// // const Post = require("../models/Post");
// // const User = require("../models/User");
// // const nodemailer = require("nodemailer");

// // // Configure email transporter
// // // const transporter = nodemailer.createTransport({
// // //   service: "gmail",
// // //   host: "smtp.gmail.com",
// // //   port: 587,
// // //   secure: false,
// // //   auth: {
// // //     user: process.env.EMAIL_USER,
// // //     pass: process.env.EMAIL_PASS,
// // //   },
// // //   tls: {
// // //     rejectUnauthorized: false,
// // //   },
// // // });

// // // // Verify transporter at startup
// // // transporter.verify((error) => {
// // //   if (error) {
// // //     console.error("SMTP Connection Error:", error);
// // //   } else {
// // //     console.log("SMTP Connection Ready");
// // //   }
// // // });

// // // Configure email transporter (same as in your postController)
// // // const transporter = nodemailer.createTransport({
// // //   service: "gmail",
// // //   host: "smtp.gmail.com",
// // //   port: 587,
// // //   secure: false,
// // //   auth: {
// // //     user: process.env.EMAIL_USER,
// // //     pass: process.env.EMAIL_PASS,
// // //   },
// // //   tls: {
// // //     rejectUnauthorized: false,
// // //   },
// // // });

// // // // Email sending function specifically for payments
// // // async function sendPaymentEmail(userEmail, order, paymentDetails) {
// // //   const mailOptions = {
// // //     from: `"Wonder Choice" <${process.env.EMAIL_USER}>`,
// // //     to: userEmail,
// // //     subject: `Payment Confirmation - Order #${order._id}`,
// // //     html: `
// // //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// // //         <h2 style="color: #4a86e8;">Payment Confirmation</h2>
// // //         <p>Dear ${order.user.username},</p>

// // //         <h3 style="color: #4a86e8;">Order Details</h3>
// // //         <p><strong>Product:</strong> ${order.productName}</p>
// // //         <p><strong>Order ID:</strong> ${order._id}</p>

// // //         <h3 style="color: #4a86e8;">Payment Information</h3>
// // //         <table style="width: 100%; border-collapse: collapse;">
// // //           <tr>
// // //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Amount</strong></td>
// // //             <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${paymentDetails.amount.toLocaleString()}</td>
// // //           </tr>
// // //           <tr>
// // //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Date</strong></td>
// // //             <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
// // //           </tr>
// // //           <tr>
// // //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Method</strong></td>
// // //             <td style="padding: 8px; border: 1px solid #ddd;">Bank Transfer</td>
// // //           </tr>
// // //         </table>

// // //         <h3 style="color: #4a86e8;">Current Status</h3>
// // //         <p><strong>Full Amount Paid:</strong> Rs. ${(
// // //           order.originalFullAmount - order.fullAmount
// // //         ).toLocaleString()}</p>
// // //         <p><strong>Expected Profit Paid:</strong> Rs. ${(
// // //           order.originalExpectedProfit - order.expectedProfit
// // //         ).toLocaleString()}</p>
// // //         <p><strong>Remaining Balance:</strong> Rs. ${(
// // //           order.fullAmount + order.expectedProfit
// // //         ).toLocaleString()}</p>

// // //         <p style="margin-top: 20px;">Thank you for your payment!</p>
// // //         <p>Best regards,<br>The Wonder Choice Team</p>
// // //       </div>
// // //     `,
// // //   };

// // //   try {
// // //     await transporter.sendMail(mailOptions);
// // //     console.log(`Payment confirmation email sent to ${userEmail}`);
// // //   } catch (error) {
// // //     console.error("Error sending payment email:", error);
// // //     throw error;
// // //   }
// // // }

// // // exports.processPayment = async (req, res) => {
// // //   try {
// // //     const { payNow, adminNotes } = req.body;
// // //     const order = await Order.findById(req.params.id).populate(
// // //       "user",
// // //       "username email"
// // //     );

// // //     if (!order) {
// // //       return res.status(404).json({ msg: "Order not found" });
// // //     }

// // //     const paymentAmount = parseFloat(payNow);
// // //     if (isNaN(paymentAmount)) {
// // //       return res.status(400).json({ msg: "Invalid payment amount" });
// // //     }

// // //     // Your existing payment processing logic here...
// // //     let newFullAmount = order.fullAmount;
// // //     let newExpectedProfit = order.expectedProfit;
// // //     let remainingPayment = paymentAmount;
// // //     const newPaymentHistory = [...order.paymentHistory];
// // //     let paymentDescription = [];

// // //     // Process payment against full amount first
// // //     if (newFullAmount > 0) {
// // //       const deductionFromFull = Math.min(remainingPayment, newFullAmount);
// // //       newFullAmount -= deductionFromFull;
// // //       remainingPayment -= deductionFromFull;

// // //       if (deductionFromFull > 0) {
// // //         newPaymentHistory.push({
// // //           type: "fullAmount",
// // //           amount: deductionFromFull,
// // //           description: `Payment of RS ${deductionFromFull.toLocaleString()} applied to Full Amount`,
// // //           date: new Date(),
// // //         });
// // //         paymentDescription.push(
// // //           `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
// // //         );
// // //       }
// // //     }

// // //     // Process remaining payment against expected profit
// // //     if (remainingPayment > 0 && newExpectedProfit > 0) {
// // //       const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
// // //       newExpectedProfit -= deductionFromProfit;
// // //       remainingPayment -= deductionFromProfit;

// // //       if (deductionFromProfit > 0) {
// // //         newPaymentHistory.push({
// // //           type: "expectedProfit",
// // //           amount: deductionFromProfit,
// // //           description: `Payment of RS ${deductionFromProfit.toLocaleString()} applied to Expected Profit`,
// // //           date: new Date(),
// // //         });
// // //         paymentDescription.push(
// // //           `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
// // //         );
// // //       }
// // //     }

// // //     if (remainingPayment > 0) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
// // //         paymentDetails: paymentDescription.join("\n"),
// // //         remaining: {
// // //           fullAmount: newFullAmount,
// // //           expectedProfit: newExpectedProfit,
// // //         },
// // //       });
// // //     }

// // //     const newStatus =
// // //       newFullAmount <= 0 && newExpectedProfit <= 0 ? "completed" : order.status;

// // //     const updatedOrder = await Order.findByIdAndUpdate(
// // //       req.params.id,
// // //       {
// // //         fullAmount: newFullAmount,
// // //         expectedProfit: newExpectedProfit,
// // //         paymentHistory: newPaymentHistory,
// // //         status: newStatus,
// // //         adminNotes: adminNotes || order.adminNotes,
// // //       },
// // //       { new: true }
// // //     ).populate("user", "username email"); // ✅ Ensure user is populated

// // //     // ✅ Enhanced email sending with better error handling
// // //     if (updatedOrder.user?.email) {
// // //       try {
// // //         console.log(
// // //           `📧 Attempting to send email to: ${updatedOrder.user.email}`
// // //         );

// // //         await sendPaymentEmail(updatedOrder.user.email, updatedOrder, {
// // //           amount: paymentAmount,
// // //           date: new Date(),
// // //         });

// // //         console.log(
// // //           `✅ Payment confirmation email sent successfully to ${updatedOrder.user.email}`
// // //         );
// // //       } catch (emailError) {
// // //         console.error(
// // //           `❌ Failed to send payment email to ${updatedOrder.user.email}:`,
// // //           emailError.message
// // //         );
// // //         console.error("Full email error details:", emailError);
// // //         // Continue with response even if email fails
// // //       }
// // //     } else {
// // //       console.log("⚠️ No user email found, skipping email notification");
// // //     }

// // //     res.json({
// // //       success: true,
// // //       message: "Payment processed successfully",
// // //       paymentDetails: paymentDescription.join("\n"),
// // //       order: updatedOrder,
// // //     });
// // //   } catch (error) {
// // //     console.error("Payment processing error:", error);
// // //     res.status(500).json({
// // //       success: false,
// // //       msg: error.message,
// // //     });
// // //   }
// // // };

// // // Configure email transporter
// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   host: "smtp.gmail.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// //   tls: {
// //     rejectUnauthorized: false,
// //   },
// // });

// // // Verify transporter at startup
// // transporter.verify((error, success) => {
// //   if (error) {
// //     console.error("❌ SMTP Connection Error:", error);
// //   } else {
// //     console.log("✅ SMTP Connection Ready");
// //   }
// // });
// // async function sendPaymentEmail(userEmail, order, paymentDetails) {
// //   console.log("📧 Starting email send process...");
// //   console.log("📧 Target email:", userEmail);
// //   console.log("📧 Order ID:", order._id);

// //   const mailOptions = {
// //     from: `"Wonder Choice" <${process.env.EMAIL_USER}>`,
// //     to: userEmail,
// //     subject: `Payment Confirmation - Order #${order._id}`,
// //     html: `
// //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //         <h2 style="color: #4a86e8;">Payment Confirmation</h2>
// //         <p>Dear ${order.user?.username || "Customer"},</p>

// //         <h3 style="color: #4a86e8;">Order Details</h3>
// //         <p><strong>Product:</strong> ${order.productName}</p>
// //         <p><strong>Order ID:</strong> ${order._id}</p>

// //         <h3 style="color: #4a86e8;">Payment Information</h3>
// //         <table style="width: 100%; border-collapse: collapse;">
// //           <tr>
// //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Amount</strong></td>
// //             <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${paymentDetails.amount.toLocaleString()}</td>
// //           </tr>
// //           <tr>
// //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Date</strong></td>
// //             <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
// //           </tr>
// //           <tr>
// //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Method</strong></td>
// //             <td style="padding: 8px; border: 1px solid #ddd;">Bank Transfer</td>
// //           </tr>
// //         </table>

// //         <h3 style="color: #4a86e8;">Current Status</h3>
// //         <p><strong>Full Amount Paid:</strong> Rs. ${(
// //           order.originalFullAmount - order.fullAmount
// //         ).toLocaleString()}</p>
// //         <p><strong>Expected Profit Paid:</strong> Rs. ${(
// //           order.originalExpectedProfit - order.expectedProfit
// //         ).toLocaleString()}</p>
// //         <p><strong>Remaining Balance:</strong> Rs. ${(
// //           order.fullAmount + order.expectedProfit
// //         ).toLocaleString()}</p>

// //         <p style="margin-top: 20px;">Thank you for your payment!</p>
// //         <p>Best regards,<br>The Wonder Choice Team</p>
// //       </div>
// //     `,
// //   };

// //   try {
// //     console.log("📤 Attempting to send email...");
// //     const result = await transporter.sendMail(mailOptions);
// //     console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);
// //     return result;
// //   } catch (error) {
// //     console.error("❌ Error sending payment email:", error);
// //     throw error;
// //   }
// // }

// // exports.processPayment = async (req, res) => {
// //   console.log("🚀 processPayment function started");

// //   try {
// //     const { payNow, adminNotes } = req.body;
// //     console.log("📝 Request data:", { payNow, adminNotes });

// //     // Find order with populated user data
// //     const order = await Order.findById(req.params.id).populate(
// //       "user",
// //       "username email"
// //     );
// //     console.log("📦 Order found:", !!order);
// //     console.log("👤 User data:", order?.user);

// //     if (!order) {
// //       return res.status(404).json({ msg: "Order not found" });
// //     }

// //     // STORE USER DATA EARLY - before any updates
// //     const userEmail = order.user?.email;
// //     const userName = order.user?.username;
// //     const userId = order.user?._id;

// //     console.log("💾 Stored user data:");
// //     console.log("- Email:", userEmail);
// //     console.log("- Username:", userName);
// //     console.log("- User ID:", userId);

// //     const paymentAmount = parseFloat(payNow);
// //     console.log("💰 Payment amount:", paymentAmount);

// //     if (isNaN(paymentAmount)) {
// //       return res.status(400).json({ msg: "Invalid payment amount" });
// //     }

// //     let newFullAmount = order.fullAmount;
// //     let newExpectedProfit = order.expectedProfit;
// //     let remainingPayment = paymentAmount;
// //     const newPaymentHistory = [...order.paymentHistory];
// //     let paymentDescription = [];

// //     console.log("💳 Processing payment...");
// //     console.log("Current fullAmount:", newFullAmount);
// //     console.log("Current expectedProfit:", newExpectedProfit);

// //     // Process payment against full amount first
// //     if (newFullAmount > 0) {
// //       const deductionFromFull = Math.min(remainingPayment, newFullAmount);
// //       newFullAmount -= deductionFromFull;
// //       remainingPayment -= deductionFromFull;

// //       if (deductionFromFull > 0) {
// //         newPaymentHistory.push({
// //           type: "fullAmount",
// //           amount: deductionFromFull,
// //           description: `Payment of RS ${deductionFromFull.toLocaleString()} applied to Full Amount`,
// //           date: new Date(),
// //         });
// //         paymentDescription.push(
// //           `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
// //         );
// //         console.log(`✅ Deducted ${deductionFromFull} from Full Amount`);
// //       }
// //     }

// //     // Process remaining payment against expected profit
// //     if (remainingPayment > 0 && newExpectedProfit > 0) {
// //       const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
// //       newExpectedProfit -= deductionFromProfit;
// //       remainingPayment -= deductionFromProfit;

// //       if (deductionFromProfit > 0) {
// //         newPaymentHistory.push({
// //           type: "expectedProfit",
// //           amount: deductionFromProfit,
// //           description: `Payment of RS ${deductionFromProfit.toLocaleString()} applied to Expected Profit`,
// //           date: new Date(),
// //         });
// //         paymentDescription.push(
// //           `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
// //         );
// //         console.log(`✅ Deducted ${deductionFromProfit} from Expected Profit`);
// //       }
// //     }

// //     // Check if there's any unapplied payment
// //     if (remainingPayment > 0) {
// //       console.log(
// //         `⚠️ Remaining payment that couldn't be applied: ${remainingPayment}`
// //       );
// //       return res.status(400).json({
// //         success: false,
// //         msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
// //         paymentDetails: paymentDescription.join("\n"),
// //         remaining: {
// //           fullAmount: newFullAmount,
// //           expectedProfit: newExpectedProfit,
// //         },
// //       });
// //     }

// //     // Update order status
// //     const newStatus =
// //       newFullAmount <= 0 && newExpectedProfit <= 0 ? "completed" : order.status;
// //     console.log("📊 New status:", newStatus);

// //     // Update the order in database
// //     const updatedOrder = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         fullAmount: newFullAmount,
// //         expectedProfit: newExpectedProfit,
// //         paymentHistory: newPaymentHistory,
// //         status: newStatus,
// //         adminNotes: adminNotes || order.adminNotes,
// //       },
// //       { new: true }
// //     );

// //     console.log("💾 Order updated successfully");

// //     // SEND EMAIL USING STORED USER DATA
// //     console.log("📧 Starting email process...");
// //     console.log("📧 Using stored email:", userEmail);

// //     if (userEmail) {
// //       console.log("✅ Email address available, sending email...");

// //       try {
// //         // Create order object for email with user data
// //         const orderForEmail = {
// //           ...updatedOrder.toObject(),
// //           user: {
// //             username: userName,
// //             email: userEmail,
// //             _id: userId,
// //           },
// //         };

// //         console.log("📧 Order for email prepared:", orderForEmail._id);
// //         console.log("📧 User data for email:", orderForEmail.user);

// //         await sendPaymentEmail(userEmail, orderForEmail, {
// //           amount: paymentAmount,
// //           date: new Date(),
// //         });

// //         console.log("✅ Email sent successfully!");
// //       } catch (emailError) {
// //         console.error("❌ Email sending failed:", emailError.message);
// //         console.error("❌ Email error stack:", emailError.stack);
// //         // Continue with response even if email fails
// //       }
// //     } else {
// //       console.log("❌ NO EMAIL AVAILABLE - Cannot send email");
// //       console.log("❌ This means the user record doesn't have an email field");

// //       // Try to fetch user directly
// //       try {
// //         const userDirect = await User.findById(order.user);
// //         console.log("🔍 Direct user fetch result:", userDirect);
// //       } catch (err) {
// //         console.log("❌ Direct user fetch failed:", err.message);
// //       }
// //     }

// //     console.log("✅ Payment processing completed successfully");

// //     // POPULATE USER DATA FOR RESPONSE
// //     const finalOrder = await Order.findById(updatedOrder._id).populate(
// //       "user",
// //       "username email"
// //     );

// //     res.json({
// //       success: true,
// //       message: "Payment processed successfully",
// //       paymentDetails: paymentDescription.join("\n"),
// //       order: finalOrder,
// //     });
// //   } catch (error) {
// //     console.error("❌ Payment processing error:", error);
// //     res.status(500).json({
// //       success: false,
// //       msg: error.message,
// //     });
// //   }
// // };

// // Email sending function
// // async function sendPaymentEmail(userEmail, order, paymentDetails) {
// //   console.log("📧 Starting email send process...");
// //   console.log("📧 Target email:", userEmail);
// //   console.log("📧 Order ID:", order._id);

// //   const mailOptions = {
// //     from: `"Wonder Choice" <${process.env.EMAIL_USER}>`,
// //     to: userEmail,
// //     subject: `Payment Confirmation - Order #${order._id}`,
// //     html: `
// //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //         <h2 style="color: #4a86e8;">Payment Confirmation</h2>
// //         <p>Dear ${order.user?.username || 'Customer'},</p>

// //         <h3 style="color: #4a86e8;">Order Details</h3>
// //         <p><strong>Product:</strong> ${order.productName}</p>
// //         <p><strong>Order ID:</strong> ${order._id}</p>

// //         <h3 style="color: #4a86e8;">Payment Information</h3>
// //         <table style="width: 100%; border-collapse: collapse;">
// //           <tr>
// //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Amount</strong></td>
// //             <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${paymentDetails.amount.toLocaleString()}</td>
// //           </tr>
// //           <tr>
// //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Date</strong></td>
// //             <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
// //           </tr>
// //           <tr>
// //             <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Method</strong></td>
// //             <td style="padding: 8px; border: 1px solid #ddd;">Bank Transfer</td>
// //           </tr>
// //         </table>

// //         <h3 style="color: #4a86e8;">Current Status</h3>
// //         <p><strong>Full Amount Paid:</strong> Rs. ${(order.originalFullAmount - order.fullAmount).toLocaleString()}</p>
// //         <p><strong>Expected Profit Paid:</strong> Rs. ${(order.originalExpectedProfit - order.expectedProfit).toLocaleString()}</p>
// //         <p><strong>Remaining Balance:</strong> Rs. ${(order.fullAmount + order.expectedProfit).toLocaleString()}</p>

// //         <p style="margin-top: 20px;">Thank you for your payment!</p>
// //         <p>Best regards,<br>The Wonder Choice Team</p>
// //       </div>
// //     `,
// //   };

// //   try {
// //     console.log("📤 Attempting to send email...");
// //     const result = await transporter.sendMail(mailOptions);
// //     console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);
// //     return result;
// //   } catch (error) {
// //     console.error("❌ Error sending payment email:", error);
// //     throw error;
// //   }
// // }

// // exports.processPayment = async (req, res) => {
// //   console.log("🚀 processPayment function started");

// //   try {
// //     const { payNow, adminNotes } = req.body;
// //     console.log("📝 Request data:", { payNow, adminNotes });

// //     // Find order with populated user data
// //     const order = await Order.findById(req.params.id).populate("user", "username email");
// //     console.log("📦 Order found:", !!order);
// //     console.log("👤 User data:", order?.user);

// //     if (!order) {
// //       return res.status(404).json({ msg: "Order not found" });
// //     }

// //     const paymentAmount = parseFloat(payNow);
// //     console.log("💰 Payment amount:", paymentAmount);

// //     if (isNaN(paymentAmount)) {
// //       return res.status(400).json({ msg: "Invalid payment amount" });
// //     }

// //     let newFullAmount = order.fullAmount;
// //     let newExpectedProfit = order.expectedProfit;
// //     let remainingPayment = paymentAmount;
// //     const newPaymentHistory = [...order.paymentHistory];
// //     let paymentDescription = [];

// //     console.log("💳 Processing payment...");
// //     console.log("Current fullAmount:", newFullAmount);
// //     console.log("Current expectedProfit:", newExpectedProfit);

// //     // Process payment against full amount first
// //     if (newFullAmount > 0) {
// //       const deductionFromFull = Math.min(remainingPayment, newFullAmount);
// //       newFullAmount -= deductionFromFull;
// //       remainingPayment -= deductionFromFull;

// //       if (deductionFromFull > 0) {
// //         newPaymentHistory.push({
// //           type: "fullAmount",
// //           amount: deductionFromFull,
// //           description: `Payment of RS ${deductionFromFull.toLocaleString()} applied to Full Amount`,
// //           date: new Date(),
// //         });
// //         paymentDescription.push(
// //           `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
// //         );
// //         console.log(`✅ Deducted ${deductionFromFull} from Full Amount`);
// //       }
// //     }

// //     // Process remaining payment against expected profit
// //     if (remainingPayment > 0 && newExpectedProfit > 0) {
// //       const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
// //       newExpectedProfit -= deductionFromProfit;
// //       remainingPayment -= deductionFromProfit;

// //       if (deductionFromProfit > 0) {
// //         newPaymentHistory.push({
// //           type: "expectedProfit",
// //           amount: deductionFromProfit,
// //           description: `Payment of RS ${deductionFromProfit.toLocaleString()} applied to Expected Profit`,
// //           date: new Date(),
// //         });
// //         paymentDescription.push(
// //           `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
// //         );
// //         console.log(`✅ Deducted ${deductionFromProfit} from Expected Profit`);
// //       }
// //     }

// //     // Check if there's any unapplied payment
// //     if (remainingPayment > 0) {
// //       console.log(`⚠️ Remaining payment that couldn't be applied: ${remainingPayment}`);
// //       return res.status(400).json({
// //         success: false,
// //         msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
// //         paymentDetails: paymentDescription.join("\n"),
// //         remaining: {
// //           fullAmount: newFullAmount,
// //           expectedProfit: newExpectedProfit,
// //         },
// //       });
// //     }

// //     // Update order status
// //     const newStatus = newFullAmount <= 0 && newExpectedProfit <= 0 ? "completed" : order.status;
// //     console.log("📊 New status:", newStatus);

// //     // Update the order in database
// //     const updatedOrder = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         fullAmount: newFullAmount,
// //         expectedProfit: newExpectedProfit,
// //         paymentHistory: newPaymentHistory,
// //         status: newStatus,
// //         adminNotes: adminNotes || order.adminNotes,
// //       },
// //       { new: true }
// //     ).populate("user", "username email");

// //     console.log("💾 Order updated successfully");
// //     console.log("📧 Checking email conditions...");
// //     console.log("- updatedOrder exists:", !!updatedOrder);
// //     console.log("- user exists:", !!updatedOrder?.user);
// //     console.log("- email exists:", !!updatedOrder?.user?.email);
// //     console.log("- email value:", updatedOrder?.user?.email);

// //     // Send email confirmation
// //     if (updatedOrder?.user?.email) {
// //       console.log("✅ Email conditions met, sending email...");

// //       try {
// //         await sendPaymentEmail(updatedOrder.user.email, updatedOrder, {
// //           amount: paymentAmount,
// //           date: new Date(),
// //         });
// //         console.log("✅ Email sent successfully!");
// //       } catch (emailError) {
// //         console.error("❌ Email sending failed:", emailError.message);
// //         console.error("Full email error:", emailError);
// //         // Continue with response even if email fails
// //       }
// //     } else {
// //       console.log("❌ Cannot send email - missing user email");
// //       console.log("Debug info:");
// //       console.log("- updatedOrder:", !!updatedOrder);
// //       console.log("- updatedOrder.user:", updatedOrder?.user);
// //       console.log("- updatedOrder.user.email:", updatedOrder?.user?.email);
// //     }

// //     console.log("✅ Payment processing completed successfully");

// //     res.json({
// //       success: true,
// //       message: "Payment processed successfully",
// //       paymentDetails: paymentDescription.join("\n"),
// //       order: updatedOrder,
// //     });

// //   } catch (error) {
// //     console.error("❌ Payment processing error:", error);
// //     res.status(500).json({
// //       success: false,
// //       msg: error.message,
// //     });
// //   }
// // };

// const Order = require("../models/Order");
// const Post = require("../models/Post");
// const User = require("../models/User");
// const nodemailer = require("nodemailer");

// // Configure email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // SIMPLIFIED EMAIL FUNCTION - NO COMPLEX DATA
// async function sendSimplePaymentEmail(
//   email,
//   orderId,
//   amount,
//   productName,
//   username
// ) {
//   console.log("📧 SIMPLE EMAIL FUNCTION CALLED");
//   console.log("📧 Email:", email);
//   console.log("📧 Order ID:", orderId);
//   console.log("📧 Amount:", amount);
//   console.log("📧 Product:", productName);
//   console.log("📧 Username:", username);

//   const mailOptions = {
//     from: `"Wonder Choice" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `Payment Confirmation - Order #${orderId}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//         <h2 style="color: #4a86e8;">Payment Confirmation</h2>
//         <p>Dear ${username || "Customer"},</p>

//         <h3 style="color: #4a86e8;">Payment Details</h3>
//         <p><strong>Order ID:</strong> ${orderId}</p>
//         <p><strong>Product:</strong> ${productName}</p>
//         <p><strong>Payment Amount:</strong> Rs. ${amount?.toLocaleString()}</p>
//         <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>

//         <p style="margin-top: 20px;">Thank you for your payment!</p>
//         <p>Best regards,<br>The Wonder Choice Team</p>
//       </div>
//     `,
//   };

//   try {
//     console.log("📤 SENDING EMAIL NOW...");
//     const result = await transporter.sendMail(mailOptions);
//     console.log(`✅ EMAIL SENT! Message ID: ${result.messageId}`);
//     return result;
//   } catch (error) {
//     console.error("❌ EMAIL FAILED:", error);
//     console.error("❌ Error message:", error.message);
//     console.error("❌ Error code:", error.code);
//     throw error;
//   }
// }

// exports.processPayment = async (req, res) => {
//   console.log("🚀 PAYMENT PROCESSING STARTED");
//   console.log("🔹 Order ID:", req.params.id);
//   console.log("🔹 Request Body:", JSON.stringify(req.body, null, 2));

//   try {
//     // STEP 1: GET ORDER WITH USER DATA
//     console.log("\n🔍 STEP 1: Finding order with user data...");
//     // const order = await Order.findById(req.params.id)
//     //   .populate({
//     //     path: "user",
//     //     select: "username email firstName lastName", // Add more fields if needed
//     //     model: "User"
//     //   })
//     //   .lean();
//         const order = await Order.findById(req.params.id)
//       .populate("user", "username email")

//     if (!order) {
//       console.log("❌ ERROR: Order not found");
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     // Enhanced user data logging
//     console.log("\n📦 ORDER DETAILS:");
//     console.log("----------------------------------------");
//     console.log(`Order ID: ${order._id}`);
//     console.log(`Product: ${order.productName}`);
//     console.log(`Status: ${order.status}`);
//     console.log("\n👤 USER DETAILS:");
//     if (order.user) {
//       console.log(`User ID: ${order.user._id}`);
//       console.log(`Email: ${order.user.email || '[No Email]'}`);
//       console.log(`Username: ${order.user.username || '[No Username]'}`);
//       if (order.user.firstName || order.user.lastName) {
//         console.log(`Name: ${order.user.firstName || ''} ${order.user.lastName || ''}`.trim());
//       }
//     } else {
//       console.log("⚠️ No user associated with this order");
//     }
//     console.log("----------------------------------------");

//     // STEP 2: VALIDATE PAYMENT
//     const paymentAmount = parseFloat(req.body.payNow);
//     if (isNaN(paymentAmount)) {
//       console.log(`❌ Invalid payment amount: ${req.body.payNow}`);
//       return res.status(400).json({ msg: "Invalid payment amount" });
//     }
//     console.log(`\n💰 Payment amount validated: RS ${paymentAmount.toLocaleString()}`);

//     // [Rest of your payment processing logic...]

//     // STEP 6: EMAIL VERIFICATION
//     console.log("\n📧 EMAIL VERIFICATION:");
//     if (order.user?.email) {
//       console.log(`✅ Valid email found: ${order.user.email}`);
//       console.log(`Attempting to send payment confirmation to: ${order.user.email}`);

//       try {
//         const emailResult = await sendSimplePaymentEmail(
//           order.user.email,
//           order._id.toString(),
//           paymentAmount,
//           order.productName,
//           order.user.username || "Customer"
//         );

//         console.log(`✅ Email sent successfully! Message ID: ${emailResult.messageId}`);
//       } catch (emailError) {
//         console.error("❌ Email sending failed:");
//         console.error("Error:", emailError.message);
//         console.error("Stack:", emailError.stack);
//       }
//     } else {
//       console.log("❌ No email address available for this order's user");
//       console.log("User object:", order.user);
//     }

//     // [Rest of your response logic...]

//   } catch (error) {
//     console.error("\n💥 CRITICAL ERROR IN PROCESS PAYMENT:");
//     console.error("Error:", error.message);
//     console.error("Stack:", error.stack);
//     res.status(500).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };

// // exports.processPayment = async (req, res) => {
// //   console.log("🚀 BULLETPROOF PAYMENT FUNCTION STARTED");

// //   try {
// //     const { payNow, adminNotes } = req.body;
// //     console.log("📝 Request data:", {
// //       payNow,
// //       adminNotes,
// //       orderId: req.params.id,
// //     });

// //     // STEP 1: GET ORDER WITH USER DATA
// //     console.log("🔍 STEP 1: Finding order...");
// //     // const order = await Order.findById(req.params.id).populate(
// //     //   "user",
// //     //   "username email"
// //     // );
// //     const order = await Order.findById(req.params.id)
// //       .populate({
// //         path: "user",
// //         select: "username email",
// //         model: "User", // Explicitly specify the model
// //       })
// //       .lean(); // Add .lean() if you're not modifying the document

// //     if (!order) {
// //       console.log("❌ Order not found");
// //       return res.status(404).json({ msg: "Order not found" });
// //     }

// //     console.log("📦 Order found:", {
// //       id: order._id,
// //       productName: order.productName,
// //       userId: order.user?._id,
// //       userEmail: order.user?.email,
// //       userName: order.user?.username,
// //     });

// //     // STEP 2: VALIDATE PAYMENT
// //     const paymentAmount = parseFloat(payNow);
// //     if (isNaN(paymentAmount)) {
// //       return res.status(400).json({ msg: "Invalid payment amount" });
// //     }
// //     console.log("💰 Payment amount validated:", paymentAmount);

// //     // STEP 3: EXTRACT USER DATA IMMEDIATELY
// //     // const USER_EMAIL = order.user?.email;
// //     // const USER_NAME = order.user?.username;
// //     // const ORDER_ID = order._id;
// //     // const PRODUCT_NAME = order.productName;
// //     const USER_EMAIL = order.user?.email;
// //     const USER_NAME = order.user?.username;
// //     const ORDER_ID = order._id.toString(); // Convert to string
// //     const PRODUCT_NAME = order.productName;

// //     console.log("💾 USER DATA EXTRACTED:");
// //     console.log("- Email:", USER_EMAIL);
// //     console.log("- Name:", USER_NAME);
// //     console.log("- Order ID:", ORDER_ID);
// //     console.log("- Product:", PRODUCT_NAME);

// //     // STEP 4: PROCESS PAYMENT (your existing logic)
// //     let newFullAmount = order.fullAmount;
// //     let newExpectedProfit = order.expectedProfit;
// //     let remainingPayment = paymentAmount;
// //     const newPaymentHistory = [...order.paymentHistory];
// //     let paymentDescription = [];

// //     console.log("💳 Processing payment...");

// //     // Process payment against full amount first
// //     if (newFullAmount > 0) {
// //       const deductionFromFull = Math.min(remainingPayment, newFullAmount);
// //       newFullAmount -= deductionFromFull;
// //       remainingPayment -= deductionFromFull;

// //       if (deductionFromFull > 0) {
// //         newPaymentHistory.push({
// //           type: "fullAmount",
// //           amount: deductionFromFull,
// //           description: `Payment of RS ${deductionFromFull.toLocaleString()} applied to Full Amount`,
// //           date: new Date(),
// //         });
// //         paymentDescription.push(
// //           `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
// //         );
// //       }
// //     }

// //     // Process remaining payment against expected profit
// //     if (remainingPayment > 0 && newExpectedProfit > 0) {
// //       const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
// //       newExpectedProfit -= deductionFromProfit;
// //       remainingPayment -= deductionFromProfit;

// //       if (deductionFromProfit > 0) {
// //         newPaymentHistory.push({
// //           type: "expectedProfit",
// //           amount: deductionFromProfit,
// //           description: `Payment of RS ${deductionFromProfit.toLocaleString()} applied to Expected Profit`,
// //           date: new Date(),
// //         });
// //         paymentDescription.push(
// //           `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
// //         );
// //       }
// //     }

// //     if (remainingPayment > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
// //         paymentDetails: paymentDescription.join("\n"),
// //         remaining: {
// //           fullAmount: newFullAmount,
// //           expectedProfit: newExpectedProfit,
// //         },
// //       });
// //     }

// //     // STEP 5: UPDATE ORDER
// //     console.log("💾 Updating order in database...");
// //     const newStatus =
// //       newFullAmount <= 0 && newExpectedProfit <= 0 ? "completed" : order.status;

// //     const updatedOrder = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         fullAmount: newFullAmount,
// //         expectedProfit: newExpectedProfit,
// //         paymentHistory: newPaymentHistory,
// //         status: newStatus,
// //         adminNotes: adminNotes || order.adminNotes,
// //       },
// //       { new: true }
// //     );

// //     console.log("✅ Order updated successfully");

// //     // STEP 6: SEND EMAIL - USING EXTRACTED DATA
// //     // console.log("📧 STEP 6: SENDING EMAIL...");
// //     // console.log("📧 Will send email to:", USER_EMAIL);
// //     // console.log("📧 FINAL EMAIL PARAMETERS CHECK:");
// //     // console.log("- Email:", typeof USER_EMAIL, USER_EMAIL);
// //     // console.log("- Order ID:", typeof ORDER_ID, ORDER_ID);
// //     // console.log("- Amount:", typeof paymentAmount, paymentAmount);
// //     // console.log("- Product:", typeof PRODUCT_NAME, PRODUCT_NAME);
// //     // console.log("- Username:", typeof USER_NAME, USER_NAME);
// //     console.log("📧 PRE-EMAIL VERIFICATION:");
// //     console.log("User object:", order.user);
// //     console.log("User email exists:", !!USER_EMAIL);
// //     console.log("User email valid:", USER_EMAIL && USER_EMAIL.includes("@"));
// //     console.log("Payment amount:", paymentAmount);

// //     if (USER_EMAIL) {
// //       try {
// //         console.log("Attempting to send email to:", USER_EMAIL);
// //         const emailResult = await sendSimplePaymentEmail(
// //           USER_EMAIL,
// //           ORDER_ID.toString(), // Ensure it's a string
// //           paymentAmount,
// //           PRODUCT_NAME,
// //           USER_NAME || "Customer" // Fallback name
// //         ).catch((emailError) => {
// //           console.error("Email sending failed:", emailError);
// //           return null;
// //         });

// //         if (emailResult) {
// //           console.log("Email sent successfully:", emailResult.messageId);
// //         }
// //       } catch (error) {
// //         console.error("Critical email error:", error);
// //       }
// //     } else {
// //       console.error("Cannot send email - no user email available");
// //     }

// //     // if (USER_EMAIL) {
// //     //   console.log("✅ EMAIL ADDRESS FOUND - PROCEEDING WITH EMAIL");

// //     //   try {
// //     //     console.log("📧 Calling sendSimplePaymentEmail...");

// //     //     await sendSimplePaymentEmail(
// //     //       USER_EMAIL,
// //     //       ORDER_ID,
// //     //       paymentAmount,
// //     //       PRODUCT_NAME,
// //     //       USER_NAME
// //     //     );

// //     //     console.log("🎉 EMAIL SENT SUCCESSFULLY!");
// //     //   } catch (emailError) {
// //     //     console.error("💥 EMAIL SENDING FAILED:");
// //     //     console.error("- Error message:", emailError.message);
// //     //     console.error("- Error code:", emailError.code);
// //     //     console.error("- Full error:", emailError);

// //     //     // Log the exact email details that failed
// //     //     console.error("- Failed email details:", {
// //     //       to: USER_EMAIL,
// //     //       orderId: ORDER_ID,
// //     //       amount: paymentAmount,
// //     //     });
// //     //   }
// //     // } else {
// //     //   console.log("❌ NO EMAIL ADDRESS - CANNOT SEND EMAIL");
// //     //   console.log("❌ USER_EMAIL value:", USER_EMAIL);
// //     //   console.log("❌ Original order.user:", order.user);
// //     // }

// //     // STEP 7: SEND RESPONSE
// //     console.log("📤 Sending response...");

// //     res.json({
// //       success: true,
// //       message: "Payment processed successfully",
// //       paymentDetails: paymentDescription.join("\n"),
// //       order: updatedOrder,
// //       emailSent: !!USER_EMAIL, // Include email status in response
// //     });
// //   } catch (error) {
// //     console.error("💥 PAYMENT PROCESSING ERROR:", error);
// //     res.status(500).json({
// //       success: false,
// //       msg: error.message,
// //     });
// //   }
// // };

// // DIRECT EMAIL TEST FUNCTION
// exports.directEmailTest = async (req, res) => {
//   try {
//     console.log("🧪 DIRECT EMAIL TEST");

//     const { email, orderId, amount } = req.body;

//     await sendSimplePaymentEmail(
//       email || "test@example.com",
//       orderId || "TEST123",
//       amount || 1000,
//       "Test Product",
//       "Test User"
//     );

//     res.json({ success: true, message: "Direct email test sent" });
//   } catch (error) {
//     console.error("Direct email test failed:", error);
//     res.json({ success: false, error: error.message });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     console.log("Incoming order data:", req.body);

//     // Destructure all required fields from the request body
//     const {
//       postId,
//       productName,
//       unitPrice,
//       fullAmount,
//       expectedProfit,
//       timeLine,
//     } = req.body;

//     // Validate required fields
//     if (
//       !postId ||
//       !productName ||
//       !fullAmount ||
//       !unitPrice ||
//       !expectedProfit ||
//       !timeLine
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "All fields are required: postId, productName, unitPrice fullAmount, expectedProfit, timeLine",
//       });
//     }

//     // Create the new order
//     const newOrder = new Order({
//       productName,
//       fullAmount: Number(fullAmount),
//       expectedProfit: Number(expectedProfit),
//       unitPrice: Number(unitPrice),
//       post: postId,
//       //   postFullAmount: post.fullAmount,
//       //   postExpectedProfit: post.expectedProfit,
//       timeLine,
//       user: req.user.id,
//       status: "pending",
//       originalFullAmount: fullAmount,
//       originalExpectedProfit: expectedProfit,
//       paymentHistory: [],
//     });

//     // Save the order to database
//     const savedOrder = await newOrder.save();

//     // Update the associated post
//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $addToSet: {
//           investedUsers: req.user.id,
//           // Remove user from visibleTo if they shouldn't see it anymore
//           // Or keep them if they should still see invested posts
//         },
//         $pull: { visibleTo: req.user.id }, // Remove user from visibleTo
//       },
//       { new: true }
//     );

//     if (!updatedPost) {
//       throw new Error("Associated post not found");
//     }

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder,
//       updatedPost: updatedPost,
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create order",
//       error: error.message,
//     });
//   }
// };

// exports.approveOrder = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status: "approved" },
//       { new: true }
//     ).populate("post");

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     // Update post visibility - remove all users except investor and admin
//     if (order?.post) {
//       await Post.findByIdAndUpdate(order.post._id, {
//         $set: {
//           visibleTo: [
//             order.user,
//             order.post.createdBy, // Admin (post creator)
//           ],
//         },
//         // $addToSet: {
//         //   investedUsers: order.user, // Add user to investedUsers
//         // }
//       });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// exports.getAdminOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "username email")
//       .populate("post", "productName");
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     // Verify the requesting user is admin
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ msg: "Admin privileges required" });
//     }

//     const { status } = req.body;
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status, updatedAt: Date.now() },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     res.json({
//       success: true,
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ msg: error.message });
//   }
// };

// exports.getUserOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let query = { user: req.user.id };

//     if (status) {
//       query.status = status;
//     }

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .select(
//         "productName fullAmount expectedProfit unitPrice status createdAt updatedAt originalFullAmount originalExpectedProfit timeLine"
//       );

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// // Get expired orders cleanup job
// exports.cleanExpiredOrders = async () => {
//   const result = await Order.deleteMany({
//     status: "pending",
//     expiresAt: { $lt: new Date() },
//   });
//   console.log(`Cleaned up ${result.deletedCount} expired orders`);
// };

// // Get orders by user ID
// exports.getOrdersByUser = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       user: req.params.userId,
//     })
//       .sort({ createdAt: -1 })
//       .populate("post", "productName image");

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// // Update order
// exports.updateOrder = async (req, res) => {
//   try {
//     const { status, adminNotes } = req.body;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//         adminNotes,
//         updatedAt: Date.now(),
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     res.json({
//       success: true,
//       order: updatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// // Get single order
// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "username email")
//       .populate("post", "productName image");

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// exports.updateOrder = async (req, res) => {
//   try {
//     const { payNow, status, adminNotes } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     const updateData = {
//       status: status || order.status,
//       adminNotes: adminNotes || order.adminNotes,
//     };

//     // Process payment if payNow is provided
//     if (payNow && payNow > 0) {
//       const paymentAmount = parseFloat(payNow);
//       let newFullAmount = order.fullAmount;
//       let newExpectedProfit = order.expectedProfit;
//       let remainingPayment = paymentAmount;
//       const newPaymentHistory = [...order.paymentHistory];
//       let paymentDescription = [];

//       // First deduct from fullAmount if any remains
//       if (newFullAmount > 0) {
//         const deductionFromFull = Math.min(remainingPayment, newFullAmount);
//         newFullAmount -= deductionFromFull;
//         remainingPayment -= deductionFromFull;

//         if (deductionFromFull > 0) {
//           newPaymentHistory.push({
//             type: "fullAmount",
//             amount: deductionFromFull,
//             description: `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`,
//           });
//           paymentDescription.push(
//             `Full Amount: -RS ${deductionFromFull.toLocaleString()}`
//           );
//         }
//       }

//       // Then deduct from expectedProfit if payment remains
//       if (remainingPayment > 0 && newExpectedProfit > 0) {
//         const deductionFromProfit = Math.min(
//           remainingPayment,
//           newExpectedProfit
//         );
//         newExpectedProfit -= deductionFromProfit;
//         remainingPayment -= deductionFromProfit;

//         if (deductionFromProfit > 0) {
//           newPaymentHistory.push({
//             type: "expectedProfit",
//             amount: deductionFromProfit,
//             description: `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`,
//           });
//           paymentDescription.push(
//             `Expected Profit: -RS ${deductionFromProfit.toLocaleString()}`
//           );
//         }
//       }

//       // Update the amounts
//       updateData.fullAmount = newFullAmount;
//       updateData.expectedProfit = newExpectedProfit;
//       updateData.paymentHistory = newPaymentHistory;

//       // Check if there's any payment left that couldn't be applied
//       if (remainingPayment > 0) {
//         return res.status(400).json({
//           success: false,
//           msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
//           paymentDetails: paymentDescription.join("\n"),
//           remaining: {
//             fullAmount: newFullAmount,
//             expectedProfit: newExpectedProfit,
//           },
//         });
//       }

//       // Mark as completed if all amounts are paid
//       if (newFullAmount <= 0 && newExpectedProfit <= 0) {
//         updateData.status = "completed";
//       }
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Payment processed successfully",
//       order: updatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         status,
//         updatedAt: Date.now(),
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     res.json({
//       success: true,
//       order: updatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// exports.getUserProfitSummary = async (req, res) => {
//   try {
//     // Get both approved and completed orders
//     const orders = await Order.find({
//       user: req.user.id,
//       status: { $in: ["approved", "completed"] }, // Include both approved and completed orders
//     })
//       .select(
//         "fullAmount expectedProfit originalFullAmount originalExpectedProfit status paymentHistory"
//       )
//       .lean();

//     const summary = orders.reduce(
//       (acc, order) => {
//         if (order.status === "completed") {
//           // For completed orders, add the full original expected profit
//           acc.totalPaid += order.originalExpectedProfit;
//           acc.completedOrders += 1;
//         } else if (order.status === "approved") {
//           // For approved orders, calculate how much has been paid so far
//           const paidProfit =
//             order.originalExpectedProfit - order.expectedProfit;
//           acc.totalPaid += paidProfit;
//           acc.totalRemaining += order.expectedProfit;
//           acc.activeOrders += 1;
//         }

//         // Calculate payment history total if available
//         if (order.paymentHistory && order.paymentHistory.length > 0) {
//           const profitPayments = order.paymentHistory.filter(
//             (payment) => payment.type === "expectedProfit"
//           );
//           const paidFromHistory = profitPayments.reduce(
//             (sum, payment) => sum + payment.amount,
//             0
//           );
//           acc.totalPaidFromHistory =
//             (acc.totalPaidFromHistory || 0) + paidFromHistory;
//         }

//         acc.totalOrders += 1;
//         return acc;
//       },
//       {
//         totalOrders: 0,
//         completedOrders: 0,
//         activeOrders: 0,
//         totalPaid: 0,
//         totalRemaining: 0,
//         totalPaidFromHistory: 0, // Optional: track payments from history
//       }
//     );

//     // If you want to prioritize payment history data over calculated difference
//     // summary.totalPaid = summary.totalPaidFromHistory || summary.totalPaid;

//     res.json({
//       success: true,
//       data: {
//         totalPaid: summary.totalPaid,
//         totalRemaining: summary.totalRemaining,
//         totalOrders: summary.totalOrders,
//         completedOrders: summary.completedOrders,
//         activeOrders: summary.activeOrders,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to calculate profit summary",
//       error: error.message,
//     });
//   }
// };

// exports.deleteOrder = async (req, res) => {
//   try {
//     // Verify the requesting user is admin
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ msg: "Admin privileges required" });
//     }

//     const order = await Order.findByIdAndDelete(req.params.id);

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     res.json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

const Order = require("../models/Order");
const Post = require("../models/Post");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const getSafeOrderFields = (order) => {
  return {
    ...order,
    quantity: order.quantity || 1,
    sellingUnitPrice: order.sellingUnitPrice || order.unitPrice || 0
  };
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test the transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connection Ready");
  }
});

// Email sending function for payments
async function sendPaymentEmail(userEmail, order, paymentDetails) {
  const mailOptions = {
    from: `"Wonder Choice" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Payment Confirmation - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a86e8;">Payment Confirmation</h2>
        <p>Dear ${order.user?.username || "Customer"},</p>

        <h3 style="color: #4a86e8;">Order Details</h3>
        <p><strong>Product:</strong> ${order.productName}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>

        <h3 style="color: #4a86e8;">Payment Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Amount</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${paymentDetails.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Date</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Method</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">Bank Transfer</td>
          </tr>
        </table>

        <h3 style="color: #4a86e8;">Current Status</h3>
        <p><strong>Full Amount Paid:</strong> Rs. ${(
          order.originalFullAmount - order.fullAmount
        ).toLocaleString()}</p>
        <p><strong>Expected Profit Paid:</strong> Rs. ${(
          order.originalExpectedProfit - order.expectedProfit
        ).toLocaleString()}</p>
        <p><strong>Remaining Balance:</strong> Rs. ${(
          order.fullAmount + order.expectedProfit
        ).toLocaleString()}</p>

        <p style="margin-top: 20px;">Thank you for your payment!</p>
        <p>Best regards,<br>The Wonder Choice Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending payment email:", error);
    throw error;
  }
}

exports.processPayment = async (req, res) => {
  try {
    // const { payNow, adminNotes } = req.body;
    // const order = await Order.findById(req.params.id).populate(
    //   "user",
    //   "username email"
    // );

    // if (!order) {
    //   return res.status(404).json({ msg: "Order not found" });
    // }

    // const paymentAmount = parseFloat(payNow);
    // if (isNaN(paymentAmount) || paymentAmount <= 0) {
    //   return res.status(400).json({ msg: "Invalid payment amount" });
    // }

    const { payNow, adminNotes } = req.body;
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

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

    // Process payment against full amount first
    if (newFullAmount > 0) {
      const deductionFromFull = Math.min(remainingPayment, newFullAmount);
      newFullAmount -= deductionFromFull;
      remainingPayment -= deductionFromFull;

      if (deductionFromFull > 0) {
        newPaymentHistory.push({
          type: "fullAmount",
          amount: deductionFromFull,
          description: `Payment of RS ${deductionFromFull.toLocaleString()} applied to Full Amount`,
          date: new Date(),
        });
        paymentDescription.push(
          `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
        );
      }
    }

    // Process remaining payment against expected profit
    if (remainingPayment > 0 && newExpectedProfit > 0) {
      const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
      newExpectedProfit -= deductionFromProfit;
      remainingPayment -= deductionFromProfit;

      if (deductionFromProfit > 0) {
        newPaymentHistory.push({
          type: "expectedProfit",
          amount: deductionFromProfit,
          description: `Payment of RS ${deductionFromProfit.toLocaleString()} applied to Expected Profit`,
          date: new Date(),
        });
        paymentDescription.push(
          `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
        );
      }
    }

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
    ).populate("user", "username email");

        // Send email after successful payment processing
    if (updatedOrder.user?.email) {
      try {
        const mailOptions = {
          from: `"Wonder-Choice" <${process.env.EMAIL_USER}>`,
          to: updatedOrder.user.email,
          subject: `Payment Paid - Order #${updatedOrder._id}`,
          html: `
            <div>
              <h2>Payment Confirmation</h2>
              <p>Dear ${updatedOrder.user.username},</p>
              <p>We've paid your payment of <strong>RS ${paymentAmount.toFixed(2)}</strong> for order ${updatedOrder.productName}.</p>
              <h3>Payment Details:</h3>
              <p>Amount: RS ${paymentAmount.toFixed(2)}</p>
              <p>Date: ${new Date().toLocaleString()}</p>
              <p>Thank you for your business!</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Payment confirmation email sent to:', updatedOrder.user.email);
      } catch (emailError) {
        console.error('Failed to send payment email:', emailError);
        // Continue even if email fails
      }
    }

    res.json({
      success: true,
      message: `Payment processed successfully${updatedOrder.user?.email ? ' and email sent' : ''}`,
      order: updatedOrder,
    });


    // Send email confirmation
    // if (updatedOrder.user?.email) {
    //   try {
    //     await sendPaymentEmail(updatedOrder.user.email, updatedOrder, {
    //       amount: paymentAmount,
    //       date: new Date(),
    //     });
    //   } catch (emailError) {
    //     console.error("Failed to send payment email:", emailError);
    //     // Continue with response even if email fails
    //   }
    // }

    // res.json({
    //   success: true,
    //   message: "Payment processed successfully",
    //   paymentDetails: paymentDescription.join("\n"),
    //   order: updatedOrder,
    // });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log("Incoming order data:", req.body);

    // Destructure all required fields from the request body
    const {
      postId,
      productName,
      unitPrice,
      quantity,
      sellingUnitPrice,
      fullAmount,
      expectedProfit,
      timeLine,
    } = req.body;

    // Validate required fields
    if (
      !postId ||
      !productName ||
      !fullAmount ||
      !unitPrice ||
      !quantity ||
      !sellingUnitPrice ||
      !expectedProfit ||
      !timeLine
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: postId, productName, unitPrice, quantity, sellingUnitPrice, fullAmount, expectedProfit, timeLine",
      });
    }

    // Create the new order
    const newOrder = new Order({
      productName,
      fullAmount: Number(fullAmount),
      expectedProfit: Number(expectedProfit),
      unitPrice: Number(unitPrice),
      quantity:Number(quantity),
      sellingUnitPrice:Number(sellingUnitPrice),
      post: postId,
      //   postFullAmount: post.fullAmount,
      //   postExpectedProfit: post.expectedProfit,
      timeLine,
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
        $addToSet: {
          investedUsers: req.user.id,
          // Remove user from visibleTo if they shouldn't see it anymore
          // Or keep them if they should still see invested posts
        },
        $pull: { visibleTo: req.user.id }, // Remove user from visibleTo
      },
      { new: true }
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

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Update post visibility - remove all users except investor and admin
    if (order?.post) {
      await Post.findByIdAndUpdate(order.post._id, {
        $set: {
          visibleTo: [
            order.user,
            order.post.createdBy, // Admin (post creator)
          ],
        },
        // $addToSet: {
        //   investedUsers: order.user, // Add user to investedUsers
        // }
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// exports.getAdminOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "username email")
//       .populate("post", "productName");
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("post", "productName");

    // Apply default values to each order
    const safeOrders = orders.map(order => getSafeOrderFields(order.toObject()));
    
    res.json(safeOrders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    // Verify the requesting user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin privileges required" });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ msg: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .select(
        "productName fullAmount expectedProfit unitPrice quantity sellingUnitPrice status createdAt updatedAt originalFullAmount originalExpectedProfit timeLine"
      );

    // Apply default values to each order
    const safeOrders = orders.map(order => getSafeOrderFields(order.toObject()));
    
    res.json(safeOrders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// exports.getUserOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let query = { user: req.user.id };

//     if (status) {
//       query.status = status;
//     }

//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .select(
//         "productName fullAmount expectedProfit unitPrice quantity sellingUnitPrice status createdAt updatedAt originalFullAmount originalExpectedProfit timeLine"
//       );

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

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

    // Ensure default values for new fields
    const safeOrder = getSafeOrderFields(order.toObject());
    
    res.json(safeOrder);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "username email")
//       .populate("post", "productName image");

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

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

// Add this function to your orderController.js
exports.updateOrderDetails = async (req, res) => {
  try {
    const { quantity, sellingUnitPrice } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Update order details
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        quantity: quantity || order.quantity,
        sellingUnitPrice: sellingUnitPrice || order.sellingUnitPrice,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Order details updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order details:", error);
    res.status(500).json({ msg: error.message });
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

// exports.processPayment = async (req, res) => {
//   try {
//     const { payNow, adminNotes } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     const paymentAmount = parseFloat(payNow);
//     if (isNaN(paymentAmount) || paymentAmount <= 0) {
//       return res.status(400).json({ msg: "Invalid payment amount" });
//     }

//     let newFullAmount = order.fullAmount;
//     let newExpectedProfit = order.expectedProfit;
//     let remainingPayment = paymentAmount;
//     const newPaymentHistory = [...order.paymentHistory];
//     let paymentDescription = [];

//     if (newFullAmount > 0) {
//       const deductionFromFull = Math.min(remainingPayment, newFullAmount);
//       newFullAmount -= deductionFromFull;
//       remainingPayment -= deductionFromFull;

//       if (deductionFromFull > 0) {
//         newPaymentHistory.push({
//           type: "fullAmount",
//           amount: deductionFromFull,
//           description: `Payment of RS ${deductionFromFull.toLocaleString()} deducted from Full Amount`,
//         });
//         paymentDescription.push(
//           `Deducted RS ${deductionFromFull.toLocaleString()} from Full Amount`
//         );
//       }
//     }

//     if (remainingPayment > 0 && newExpectedProfit > 0) {
//       const deductionFromProfit = Math.min(remainingPayment, newExpectedProfit);
//       newExpectedProfit -= deductionFromProfit;

//       if (deductionFromProfit > 0) {
//         newPaymentHistory.push({
//           type: "expectedProfit",
//           amount: deductionFromProfit,
//           description: `Payment of RS ${deductionFromProfit.toLocaleString()} deducted from Expected Profit`,
//         });
//         paymentDescription.push(
//           `Deducted RS ${deductionFromProfit.toLocaleString()} from Expected Profit`
//         );
//       }
//     }

//     // Check if there's any payment left that couldn't be applied
//     if (remainingPayment > 0) {
//       return res.status(400).json({
//         msg: `Could not apply RS ${remainingPayment.toLocaleString()} - amounts fully paid`,
//         fullAmount: newFullAmount,
//         expectedProfit: newExpectedProfit,
//       });
//     }

//     // Update order status if fully paid
//     const newStatus =
//       newFullAmount <= 0 && newExpectedProfit <= 0 ? "completed" : order.status;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         fullAmount: newFullAmount,
//         expectedProfit: newExpectedProfit,
//         paymentHistory: newPaymentHistory,
//         status: newStatus,
//         adminNotes: adminNotes || order.adminNotes,
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: paymentDescription.join("\n"),
//       order: updatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

exports.getUserProfitSummary = async (req, res) => {
  try {
    // Get both approved and completed orders
    const orders = await Order.find({
      user: req.user.id,
      status: { $in: ["approved", "completed"] }, // Include both approved and completed orders
    })
      .select(
        "fullAmount expectedProfit originalFullAmount originalExpectedProfit status paymentHistory"
      )
      .lean();

    const summary = orders.reduce(
      (acc, order) => {
        if (order.status === "completed") {
          // For completed orders, add the full original expected profit
          acc.totalPaid += order.originalExpectedProfit;
          acc.completedOrders += 1;
        } else if (order.status === "approved") {
          // For approved orders, calculate how much has been paid so far
          const paidProfit =
            order.originalExpectedProfit - order.expectedProfit;
          acc.totalPaid += paidProfit;
          acc.totalRemaining += order.expectedProfit;
          acc.activeOrders += 1;
        }

        // Calculate payment history total if available
        if (order.paymentHistory && order.paymentHistory.length > 0) {
          const profitPayments = order.paymentHistory.filter(
            (payment) => payment.type === "expectedProfit"
          );
          const paidFromHistory = profitPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );
          acc.totalPaidFromHistory =
            (acc.totalPaidFromHistory || 0) + paidFromHistory;
        }

        acc.totalOrders += 1;
        return acc;
      },
      {
        totalOrders: 0,
        completedOrders: 0,
        activeOrders: 0,
        totalPaid: 0,
        totalRemaining: 0,
        totalPaidFromHistory: 0, // Optional: track payments from history
      }
    );

    // If you want to prioritize payment history data over calculated difference
    // summary.totalPaid = summary.totalPaidFromHistory || summary.totalPaid;

    res.json({
      success: true,
      data: {
        totalPaid: summary.totalPaid,
        totalRemaining: summary.totalRemaining,
        totalOrders: summary.totalOrders,
        completedOrders: summary.completedOrders,
        activeOrders: summary.activeOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate profit summary",
      error: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    // Verify the requesting user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin privileges required" });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

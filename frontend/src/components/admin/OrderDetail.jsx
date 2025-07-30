import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    adminNotes: "",
    payNow: "",
    fullAmount: 0,
    expectedProfit: 0,
    // unitPrice: 0,
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/protected/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(response.data);
        setFormData({
          status: response.data.status,
          adminNotes: response.data.adminNotes || "",
          payNow: "",
          fullAmount: response.data.fullAmount,
          expectedProfit: response.data.expectedProfit,
        });

        if (response.data.paymentHistory) {
          setPaymentHistory(response.data.paymentHistory);
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         `${baseUrl}/api/protected/orders/${orderId}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setOrder(response.data);
  //       setFormData({
  //         status: response.data.status,
  //         adminNotes: response.data.adminNotes || "",
  //         payNow: "",
  //         fullAmount: response.data.fullAmount,
  //         expectedProfit: response.data.expectedProfit,
  //       });

  //       if (response.data.paymentHistory) {
  //         setPaymentHistory(response.data.paymentHistory);
  //       }
  //     } catch (err) {
  //       setError(err.response?.data?.msg || "Failed to fetch order");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrder();
  // }, [orderId]);

  const handlePaymentChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setFormData({ ...formData, payNow: value });
    }
  };

  // const handlePaymentSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");
  //     const paymentAmount = parseFloat(formData.payNow);

  //     if (!paymentAmount || paymentAmount <= 0) {
  //       throw new Error("Please enter a valid payment amount");
  //     }

  //     const response = await axios.put(
  //       `${baseUrl}/api/protected/orders/${orderId}`,
  //       {
  //         payNow: paymentAmount,
  //         adminNotes: formData.adminNotes,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (response.data.success) {
  //       setOrder(response.data.order);
  //       setFormData({ payNow: "", adminNotes: "" });
  //       setIsEditing(false);
  //       alert(`${response.data.message}`);
  //     } else {
  //       const { msg, paymentDetails, remaining } = response.data;
  //       const confirmation = window.confirm(
  //         `${msg}\n\nApplied Payments:\n${paymentDetails}\n\n` +
  //           `Remaining:\nFull Amount: RS ${remaining.fullAmount.toLocaleString()}\n` +
  //           `Expected Profit: RS ${remaining.expectedProfit.toLocaleString()}\n\n` +
  //           `Do you want to proceed with the partial payment?`
  //       );

  //       if (confirmation) {
  //         const updatedResponse = await axios.get(
  //           `${baseUrl}/api/protected/orders/${orderId}`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         setOrder(updatedResponse.data);
  //         setFormData({ payNow: "", adminNotes: "" });
  //         setIsEditing(false);
  //         alert(
  //           "Partial payment processed successfully! An email has been sent to the user."
  //         );
  //       }
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.msg || err.message);
  //   }
  // };

  // const handlePaymentSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");
  //     const paymentAmount = parseFloat(formData.payNow);

  //     if (!paymentAmount || paymentAmount <= 0) {
  //       throw new Error("Please enter a valid payment amount");
  //     }

  //     // Show loading state
  //     setLoading(true);

  //     const response = await axios.put(
  //       `${baseUrl}/api/protected/orders/${orderId}`,
  //       {
  //         payNow: paymentAmount,
  //         adminNotes: formData.adminNotes,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (response.data.success) {
  //       setOrder(response.data.order);
  //       setFormData({ payNow: "", adminNotes: "" });
  //       setIsEditing(false);

  //       // Show success notification with email info
  //       alert(
  //         `Payment processed successfully! A confirmation email has been sent to ${
  //           order.user?.email || "the user"
  //         }.`
  //       );

  //       // Refresh the order data to get latest payment history
  //       const updatedResponse = await axios.get(
  //         `${baseUrl}/api/protected/orders/${orderId}`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setOrder(updatedResponse.data);
  //       if (updatedResponse.data.paymentHistory) {
  //         setPaymentHistory(updatedResponse.data.paymentHistory);
  //       }
  //     } else {
  //       const { msg, paymentDetails, remaining } = response.data;
  //       const confirmation = window.confirm(
  //         `${msg}\n\nApplied Payments:\n${paymentDetails}\n\n` +
  //           `Remaining:\nFull Amount: RS ${remaining.fullAmount.toLocaleString()}\n` +
  //           `Expected Profit: RS ${remaining.expectedProfit.toLocaleString()}\n\n` +
  //           `Do you want to proceed with the partial payment?`
  //       );

  //       if (confirmation) {
  //         const updatedResponse = await axios.get(
  //           `${baseUrl}/api/protected/orders/${orderId}`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         setOrder(updatedResponse.data);
  //         setFormData({ payNow: "", adminNotes: "" });
  //         setIsEditing(false);
  //         alert(
  //           `Partial payment processed successfully! A confirmation email has been sent to ${
  //             order.user?.email || "the user"
  //           }.`
  //         );
  //       }
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.msg || err.message);
  //     alert(`Payment processing failed: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const paymentAmount = parseFloat(formData.payNow);

      if (!paymentAmount || paymentAmount <= 0) {
        throw new Error("Please enter a valid payment amount");
      }

      const response = await axios.put(
        `${baseUrl}/api/protected/orders/${orderId}/process-payment`,
        {
          payNow: paymentAmount,
          adminNotes: formData.adminNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Payment processed! ${response.data.message}`);
        // Refresh order data
        const updatedResponse = await axios.get(
          `${baseUrl}/api/protected/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(updatedResponse.data);
        setIsEditing(false);
      }
    } catch (err) {
      alert(`Payment failed: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // const handlePaymentSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");
  //     const paymentAmount = parseFloat(formData.payNow);

  //     if (!paymentAmount || paymentAmount <= 0) {
  //       throw new Error("Please enter a valid payment amount");
  //     }

  //     const response = await axios.put(
  //       `${baseUrl}/api/protected/orders/${orderId}`,
  //       {
  //         payNow: paymentAmount,
  //         adminNotes: formData.adminNotes,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (response.data.success) {
  //       setOrder(response.data.order);
  //       setFormData({ payNow: "", adminNotes: "" });
  //       setIsEditing(false);
  //       alert(`${response.data.message}`);
  //       // Payment processed successfully!\n
  //     } else {
  //       const { msg, paymentDetails, remaining } = response.data;
  //       const confirmation = window.confirm(
  //         `${msg}\n\nApplied Payments:\n${paymentDetails}\n\n` +
  //           `Remaining:\nFull Amount: RS ${remaining.fullAmount.toLocaleString()}\n` +
  //           `Expected Profit: RS ${remaining.expectedProfit.toLocaleString()}\n\n` +
  //           `Do you want to proceed with the partial payment?`
  //       );

  //       if (confirmation) {
  //         const updatedResponse = await axios.get(
  //           `${baseUrl}/api/protected/orders/${orderId}`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //         setOrder(updatedResponse.data);
  //         setFormData({ payNow: "", adminNotes: "" });
  //         setIsEditing(false);
  //       }
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.msg || err.message);
  //   }
  // };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/api/protected/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const response = await axios.get(
        `${baseUrl}/api/protected/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(response.data);
      setFormData((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update status");
    }
  };

  const generatePDF = () => {
    if (!order) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`Order Details - #${order._id}`, 14, 20);

    // Add order information
    doc.setFontSize(12);
    doc.text(`Product Name: ${order.productName}`, 14, 35);
    doc.text(`Status: ${order.status.toUpperCase()}`, 14, 45);
    doc.text(`Created: ${new Date(order.createdAt).toLocaleString()}`, 14, 55);

    // Add payment summary
    doc.setFontSize(14);
    doc.text("Payment Summary", 14, 70);

    doc.setFontSize(12);
    doc.text(
      `Original Full Amount: RS. ${order.originalFullAmount?.toLocaleString()}`,
      14,
      80
    );
    doc.text(
      `Original Expected Profit: RS. ${order.originalExpectedProfit?.toLocaleString()}`,
      14,
      90
    );
    doc.text(
      `Full Amount Remaining: RS. ${order.fullAmount?.toLocaleString()}`,
      14,
      100
    );
    doc.text(
      `Expected Profit Remaining: RS. ${order.expectedProfit?.toLocaleString()}`,
      14,
      110
    );
    doc.text(
      `Total Paid: RS. ${(
        order.originalFullAmount -
        order.fullAmount +
        ((order.originalExpectedProfit || order.expectedProfit) -
          order.expectedProfit)
      ).toLocaleString()}`,
      14,
      120
    );

    // Add payment history table
    if (paymentHistory.length > 0) {
      doc.setFontSize(14);
      doc.text("Payment History", 14, 140);

      const tableData = paymentHistory.map((payment) => [
        new Date(payment.date).toLocaleString(),
        payment.type === "fullAmount" ? "Full Amount" : "Expected Profit",
        `RS. ${payment.amount.toLocaleString()}`,
        payment.description,
      ]);

      doc.autoTable({
        startY: 145,
        head: [["Date", "Type", "Amount", "Description"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
    }

    // Add admin notes if available
    if (order.adminNotes) {
      const finalY = doc.lastAutoTable.finalY || 150;
      doc.setFontSize(14);
      doc.text("Admin Notes", 14, finalY + 15);
      doc.setFontSize(12);
      const splitNotes = doc.splitTextToSize(order.adminNotes, 180);
      doc.text(splitNotes, 14, finalY + 25);
    }

    // Save the PDF
    doc.save(`order_${order._id}.pdf`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  if (!order) return <div>Order not found</div>;

  const totalExpectedFullAmount =
    order.originalFullAmount +
    (order.originalExpectedProfit || order.expectedProfit);

  const totalPaid =
    order.originalFullAmount -
    order.fullAmount +
    ((order.originalExpectedProfit || order.expectedProfit) -
      order.expectedProfit);

  // Prepare deduction data for the table
  const deductionData = [
    {
      type: "Full Amount",
      original: order.originalFullAmount,
      paid: order.originalFullAmount - order.fullAmount,
      remaining: order.fullAmount,
    },
    {
      type: "Expected Profit",
      original: order.originalExpectedProfit || order.expectedProfit,
      paid:
        (order.originalExpectedProfit || order.expectedProfit) -
        order.expectedProfit,
      remaining: order.expectedProfit,
    },
    {
      type: "Total",
      original:
        order.originalFullAmount +
        (order.originalExpectedProfit || order.expectedProfit),
      paid: totalPaid,
      remaining: order.fullAmount + order.expectedProfit,
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Orders
          </button>
          <div className="space-x-2 flex">
            <button
              onClick={generatePDF}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FiDownload className="mr-2" /> Generate PDF
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <FiEdit className="mr-2" /> Edit Order
              </button>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <FiUser className="mr-2" /> User Information
          </h3>
          <div className="space-y-2">
            {order.user && (
              <>
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  {order.user.username || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {order.user.email ? (
                    <a
                      href={`mailto:${order.user.email}`}
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FiMail className="mr-1" /> {order.user.email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                {order.user.firstName && (
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {[order.user.firstName, order.user.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handlePaymentSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  Order Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={order.productName}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Full Amount
                    </label>
                    <input
                      type="text"
                      value={`RS ${order.fullAmount.toLocaleString()}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Expected Profit
                    </label>
                    <input
                      type="text"
                      value={`RS ${order.expectedProfit.toLocaleString()}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  Payment Processing
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Amount (RS)
                    </label>
                    <input
                      type="text"
                      value={formData.payNow}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter payment amount"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.fullAmount > 0 ? (
                      <p className="flex items-center">
                        <FiCheckCircle className="mr-1 text-green-500" />
                        {order.fullAmount.toLocaleString()} RS available in Full
                        Amount
                      </p>
                    ) : (
                      <p className="flex items-center">
                        <FiXCircle className="mr-1 text-red-500" />
                        Full Amount fully paid
                      </p>
                    )}
                    {order.expectedProfit > 0 ? (
                      <p className="flex items-center">
                        <FiCheckCircle className="mr-1 text-green-500" />
                        {order.expectedProfit.toLocaleString()} RS available in
                        Expected Profit
                      </p>
                    ) : (
                      <p className="flex items-center">
                        <FiXCircle className="mr-1 text-red-500" />
                        Expected Profit fully paid
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Notes
              </label>
              <textarea
                value={formData.adminNotes}
                onChange={(e) =>
                  setFormData({ ...formData, adminNotes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Add any notes about this payment..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!formData.payNow || parseFloat(formData.payNow) <= 0}
              >
                <FiSave className="mr-2" /> Process Payment
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <FiPackage className="mr-2" /> Order Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Product:</span>{" "}
                    {order.productName}
                  </p>
                  <p>
                    <span className="font-medium">Original Full Amount:</span>{" "}
                    RS.
                    {order.originalFullAmount?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">
                      Original Expected Profit:
                    </span>{" "}
                    RS.
                    {(
                      order.originalExpectedProfit || order.expectedProfit
                    )?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">
                      Toatal Expected Full Amount:
                    </span>{" "}
                    RS.
                    {totalExpectedFullAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <FiDollarSign className="mr-2" /> Payment Summary
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Full Amount Remaining:</span>{" "}
                    RS.
                    {order.fullAmount?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">
                      Expected Profit Remaining:
                    </span>{" "}
                    RS.
                    {order.expectedProfit?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Total Paid:</span> RS.
                    {totalPaid.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        order.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : order.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : order.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="mt-4 space-x-2">
                  {/* {order.status !== "approved" &&
                    order.status !== "completed" && (
                      <button
                        onClick={() => handleStatusChange("approved")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                    )}
                  {order.status !== "rejected" &&
                    order.status !== "completed" && (
                      <button
                        onClick={() => handleStatusChange("rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    )} */}
                  {order.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Deductions Summary Table */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-700 mb-3">
                Deductions Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">
                        Original Amount (RS)
                      </th>
                      <th className="px-4 py-2 text-left">Paid (RS)</th>
                      <th className="px-4 py-2 text-left">Remaining (RS)</th>
                      <th className="px-4 py-2 text-left">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deductionData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.type}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.original?.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.paid?.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.remaining?.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                item.remaining === 0
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{
                                width: `${(item.paid / item.original) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round((item.paid / item.original) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {paymentHistory.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Payment History
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Amount (RS)</th>
                        <th className="px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(payment.date).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {payment.type === "fullAmount"
                              ? "Full Amount"
                              : "Expected Profit"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {payment.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-2">{payment.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {order.adminNotes && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Admin Notes</h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {order.adminNotes}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

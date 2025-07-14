/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [posts,setPosts] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});
  const baseUrl = import.meta.env.VITE_API_BASE_URI ;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/protected/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setOrders(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );

        // Calculate time remaining for each order
        const timeData = {};
        data.forEach((order) => {
          if (order.status === "pending" && order.expiresAt) {
            const diff = new Date(order.expiresAt) - new Date();
            timeData[order._id] = {
              hours: Math.floor(diff / (1000 * 60 * 60)),
              minutes: Math.floor((diff / (1000 * 60)) % 60),
              seconds: Math.floor((diff / 1000) % 60),
            };
          }
        });
        setTimeRemaining(timeData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update countdown timers every second
    const timer = setInterval(() => {
      const newTimeRemaining = { ...timeRemaining };
      let changed = false;

      Object.keys(newTimeRemaining).forEach((orderId) => {
        const order = orders.find((o) => o._id === orderId);
        if (order && order.status === "pending" && order.expiresAt) {
          const diff = new Date(order.expiresAt) - new Date();
          if (diff <= 0) {
            delete newTimeRemaining[orderId];
            changed = true;
          } else {
            newTimeRemaining[orderId] = {
              hours: Math.floor(diff / (1000 * 60 * 60)),
              minutes: Math.floor((diff / (1000 * 60)) % 60),
              seconds: Math.floor((diff / 1000) % 60),
            };
            changed = true;
          }
        }
      });

      if (changed) {
        setTimeRemaining(newTimeRemaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [orders, timeRemaining]);

  const handleStatusChange = async (orderId, status) => {
    try {
      // const token = localStorage.getItem("token");
      // const response = await axios.put(
      //   `http://localhost:5000/api/protected/orders/${orderId}/status`,
      //   { status },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
          const token = localStorage.getItem("token");
    const response = await axios.put(
      `${baseUrl}/api/protected/orders/${orderId}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refresh data after approval
    if (status === "approved") {
      const ordersResponse = await axios.get(
        `${baseUrl}/api/protected/admin/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(ordersResponse.data);
      
      // Refresh posts data
      const postsResponse = await axios.get(
        `${baseUrl}/api/protected/posts/available`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(postsResponse.data);
    }

      if (response.status !== 200) throw new Error("Failed to update status");

      // Update local state immediately
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);

      // Remove time remaining for approved/rejected orders
      if (status !== "pending") {
        const newTimeRemaining = { ...timeRemaining };
        delete newTimeRemaining[orderId];
        setTimeRemaining(newTimeRemaining);
      }

      alert(`Order ${status} successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Failed to update order: ${error.message}`);
    }
  };

  const formatTime = (time) => {
    return `${String(time.hours).padStart(2, "0")}:${String(
      time.minutes
    ).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
  };

  // PDF Generation function for all orders
  const generateOrdersPDF = () => {
    const doc = new jsPDF();

    // Add title to the document
    doc.setFontSize(18);
    doc.text("Orders Report", 14, 22);

    // Add generation date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Prepare table data
    const tableColumn = [
      "Product",
      "User",
      "Amount",
      "Profit",
      "Status",
      "Created At",
    ];
    const tableRows = orders.map((order) => [
      order.productName,
      order.user?.username || "N/A",
      `RS.${order.fullAmount?.toLocaleString()}`,
      `RS.${order.expectedProfit?.toLocaleString()}`,
      order.status.toUpperCase(),
      new Date(order.createdAt).toLocaleString(),
    ]);

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 135, 245] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 15 },
    });

    // Summary at the bottom
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const approvedOrders = orders.filter((o) => o.status === "approved").length;
    const rejectedOrders = orders.filter((o) => o.status === "rejected").length;
    const totalProfit = orders
      .filter((o) => o.status === "approved")
      .reduce((sum, order) => sum + (order.expectedProfit || 0), 0);

    const finalY = doc.lastAutoTable?.finalY || 150;

    doc.setFontSize(12);
    doc.text("Summary:", 14, finalY + 15);
    doc.setFontSize(10);
    doc.text(`Total Orders: ${orders.length}`, 14, finalY + 25);
    doc.text(`Pending: ${pendingOrders}`, 14, finalY + 35);
    doc.text(`Approved: ${approvedOrders}`, 14, finalY + 45);
    doc.text(`Rejected: ${rejectedOrders}`, 14, finalY + 55);
    doc.text(
      `Total Expected Profit: RS.${totalProfit.toLocaleString()}`,
      14,
      finalY + 65
    );

    // Save PDF
    doc.save("orders-report.pdf");
  };

  // PDF Generation function for a single order
  const generateSingleOrderPDF = (order) => {
    const doc = new jsPDF();

    // Add title to the document
    doc.setFontSize(18);
    doc.text("Order Details", 14, 22);

    // Add order ID and date
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 35);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 45);

    // Order details
    doc.setFontSize(14);
    doc.text("Product Information", 14, 60);

    doc.setFontSize(10);
    doc.text(`Product: ${order.productName}`, 14, 70);
    doc.text(`User: ${order.user?.username || "N/A"}`, 14, 80);
    doc.text(`Amount: RS.${order.fullAmount?.toLocaleString()}`, 14, 90);
    doc.text(
      `Expected Profit: RS.${order.expectedProfit?.toLocaleString()}`,
      14,
      100
    );
    doc.text(`Status: ${order.status.toUpperCase()}`, 14, 110);
    doc.text(
      `Created At: ${new Date(order.createdAt).toLocaleString()}`,
      14,
      120
    );

    if (order.updatedAt) {
      doc.text(
        `Last Updated: ${new Date(order.updatedAt).toLocaleString()}`,
        14,
        130
      );
    }

    // Save PDF
    doc.save(`order-${order._id}.pdf`);
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Order Management</h1>
        <button
          onClick={generateOrdersPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
              clipRule="evenodd"
            />
          </svg>
          Generate PDF Report
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border text-left">Product</th>
              <th className="py-3 px-4 border text-left">User</th>
              <th className="py-3 px-4 border text-left">Amount</th>
              <th className="py-3 px-4 border text-left">Profit</th>
              <th className="py-3 px-4 border text-left">Time Left</th>
              <th className="py-3 px-4 border text-left">Created At</th>
              <th className="py-3 px-4 border text-left">Status</th>
              <th className="py-3 px-4 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{order.productName}</td>
                <td className="py-2 px-4 border">
                  {order.user?.username || "N/A"}
                </td>
                <td className="py-2 px-4 border">
                  RS.{order.fullAmount?.toLocaleString()}
                </td>
                <td className="py-2 px-4 border">
                  RS.{order.expectedProfit?.toLocaleString()}
                </td>
                <td className="py-2 px-4 border">
                  {order.status === "pending" && timeRemaining[order._id] ? (
                    <span className="font-mono">
                      {formatTime(timeRemaining[order._id])}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      order.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2">
                    {order.status === "pending" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "approved")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "rejected")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                    )}
                    <button
                      onClick={() => generateSingleOrderPDF(order)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Product:</strong> {selectedOrder.productName}
              </p>
              <p>
                <strong>User:</strong> {selectedOrder.user?.username || "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> RS.
                {selectedOrder.fullAmount?.toLocaleString()}
              </p>
              <p>
                <strong>Expected Profit:</strong> RS.
                {selectedOrder.expectedProfit?.toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedOrder.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedOrder.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              {selectedOrder.updatedAt && (
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(selectedOrder.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => generateSingleOrderPDF(selectedOrder)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;

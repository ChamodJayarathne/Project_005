// /* eslint-disable no-unused-vars */

// import React, { useEffect, useState } from "react";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import { FiTrash2 } from "react-icons/fi";

// function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [timeRemaining, setTimeRemaining] = useState({});
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${baseUrl}/api/protected/admin/orders`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = response.data;
//         setOrders(
//           data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         );

//         // Calculate time remaining for each order
//         const timeData = {};
//         data.forEach((order) => {
//           if (order.status === "pending" && order.expiresAt) {
//             const diff = new Date(order.expiresAt) - new Date();
//             timeData[order._id] = {
//               hours: Math.floor(diff / (1000 * 60 * 60)),
//               minutes: Math.floor((diff / (1000 * 60)) % 60),
//               seconds: Math.floor((diff / 1000) % 60),
//             };
//           }
//         });
//         setTimeRemaining(timeData);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//     const interval = setInterval(fetchOrders, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     // Update countdown timers every second
//     const timer = setInterval(() => {
//       const newTimeRemaining = { ...timeRemaining };
//       let changed = false;

//       Object.keys(newTimeRemaining).forEach((orderId) => {
//         const order = orders.find((o) => o._id === orderId);
//         if (order && order.status === "pending" && order.expiresAt) {
//           const diff = new Date(order.expiresAt) - new Date();
//           if (diff <= 0) {
//             delete newTimeRemaining[orderId];
//             changed = true;
//           } else {
//             newTimeRemaining[orderId] = {
//               hours: Math.floor(diff / (1000 * 60 * 60)),
//               minutes: Math.floor((diff / (1000 * 60)) % 60),
//               seconds: Math.floor((diff / 1000) % 60),
//             };
//             changed = true;
//           }
//         }
//       });

//       if (changed) {
//         setTimeRemaining(newTimeRemaining);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [orders, timeRemaining]);

//   const handleStatusChange = async (orderId, status) => {
//     try {
//       // const token = localStorage.getItem("token");
//       // const response = await axios.put(
//       //   `http://localhost:5000/api/protected/orders/${orderId}/status`,
//       //   { status },
//       //   {
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //       Authorization: `Bearer ${token}`,
//       //     },
//       //   }
//       // );
//       //       const token = localStorage.getItem("token");
//       // const response = await axios.put(
//       //   `${baseUrl}/api/protected/orders/${orderId}/status`,
//       //   { status },
//       //   {
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //       Authorization: `Bearer ${token}`,
//       //     },
//       //   }
//       // );

//       const token = localStorage.getItem("token");
//       console.log("Current token:", token); // Debug token

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.put(
//         `${baseUrl}/api/protected/orders/${orderId}/status`,
//         { status },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Refresh data after approval
//       if (status === "approved") {
//         const ordersResponse = await axios.get(
//           `${baseUrl}/api/protected/admin/orders`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setOrders(ordersResponse.data);

//         // Refresh posts data
//         const postsResponse = await axios.get(
//           `${baseUrl}/api/protected/posts/available`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setPosts(postsResponse.data);
//       }

//       if (response.status !== 200) throw new Error("Failed to update status");

//       // Update local state immediately
//       const updatedOrders = orders.map((order) =>
//         order._id === orderId ? { ...order, status } : order
//       );
//       setOrders(updatedOrders);

//       // Remove time remaining for approved/rejected orders
//       if (status !== "pending") {
//         const newTimeRemaining = { ...timeRemaining };
//         delete newTimeRemaining[orderId];
//         setTimeRemaining(newTimeRemaining);
//       }

//       alert(`Order ${status} successfully!`);
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert(`Failed to update order: ${error.message}`);
//     }
//   };


//   const handleDeleteOrder = async (orderId) => {
//   if (!window.confirm("Are you sure you want to delete this order?")) return;

//   try {
//     const token = localStorage.getItem("token");
//     await axios.delete(`${baseUrl}/api/protected/orders/${orderId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     // Update local state by removing the deleted order
//     setOrders(orders.filter(order => order._id !== orderId));

//     // Also remove from timeRemaining if it exists
//     const newTimeRemaining = { ...timeRemaining };
//     delete newTimeRemaining[orderId];
//     setTimeRemaining(newTimeRemaining);

//     alert("Order deleted successfully");
//   } catch (error) {
//     console.error("Error deleting order:", error);
//     alert(error.response?.data?.msg || "Failed to delete order");
//   }
// };

//   const formatTime = (time) => {
//     return `${String(time.hours).padStart(2, "0")}:${String(
//       time.minutes
//     ).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
//   };

//   // PDF Generation function for all orders
//   const generateOrdersPDF = () => {
//     const doc = new jsPDF();

//     // Add title to the document
//     doc.setFontSize(18);
//     doc.text("Orders Report", 14, 22);

//     // Add generation date
//     doc.setFontSize(11);
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

//     // Prepare table data
//     const tableColumn = [
//       "Product",
//       "User",
//       "Amount",
//       "Profit",
//       "Status",
//       "Created At",
//     ];
//     const tableRows = orders.map((order) => [
//       order.productName,
//       order.user?.username || "N/A",
//       `RS.${order.
// originalFullAmount?.toLocaleString()}`,
//       `RS.${order.originalExpectedProfit?.toLocaleString()}`,
//       order.status.toUpperCase(),
//       new Date(order.createdAt).toLocaleString(),
//     ]);

//     // Generate the table
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 40,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [66, 135, 245] },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//       margin: { top: 15 },
//     });

//     // Summary at the bottom
//     const pendingOrders = orders.filter((o) => o.status === "pending").length;
//     const approvedOrders = orders.filter((o) => o.status === "approved").length;
//     const rejectedOrders = orders.filter((o) => o.status === "rejected").length;
//     const totalProfit = orders
//       .filter((o) => o.status === "approved")
//       .reduce((sum, order) => sum + (order.expectedProfit || 0), 0);

//     const finalY = doc.lastAutoTable?.finalY || 150;

//     doc.setFontSize(12);
//     doc.text("Summary:", 14, finalY + 15);
//     doc.setFontSize(10);
//     doc.text(`Total Orders: ${orders.length}`, 14, finalY + 25);
//     doc.text(`Pending: ${pendingOrders}`, 14, finalY + 35);
//     doc.text(`Approved: ${approvedOrders}`, 14, finalY + 45);
//     doc.text(`Rejected: ${rejectedOrders}`, 14, finalY + 55);
//     doc.text(
//       `Total Expected Profit: RS.${totalProfit.toLocaleString()}`,
//       14,
//       finalY + 65
//     );

//     // Save PDF
//     doc.save("orders-report.pdf");
//   };

//   // PDF Generation function for a single order
//   const generateSingleOrderPDF = (order) => {
//     const doc = new jsPDF();

//     // Add title to the document
//     doc.setFontSize(18);
//     doc.text("Order Details", 14, 22);

//     // Add order ID and date
//     doc.setFontSize(12);
//     doc.text(`Order ID: ${order._id}`, 14, 35);
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 45);

//     // Order details
//     doc.setFontSize(14);
//     doc.text("Product Information", 14, 60);

//     doc.setFontSize(10);
//     doc.text(`Product: ${order.productName}`, 14, 70);
//     doc.text(`User: ${order.user?.username || "N/A"}`, 14, 80);
//     doc.text(`Amount: RS.${order.fullAmount?.toLocaleString()}`, 14, 90);
//     doc.text(
//       `Expected Profit: RS.${order.expectedProfit?.toLocaleString()}`,
//       14,
//       100
//     );
//     doc.text(`Status: ${order.status.toUpperCase()}`, 14, 110);
//     doc.text(
//       `Created At: ${new Date(order.createdAt).toLocaleString()}`,
//       14,
//       120
//     );

//     if (order.updatedAt) {
//       doc.text(
//         `Last Updated: ${new Date(order.updatedAt).toLocaleString()}`,
//         14,
//         130
//       );
//     }

//     // Save PDF
//     doc.save(`order-${order._id}.pdf`);
//   };

//   if (loading) return <div className="text-center py-8">Loading orders...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold mb-4">Order Management</h1>
//         <button
//           onClick={generateOrdersPDF}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Generate PDF Report
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 border text-left">Product</th>
//               <th className="py-3 px-4 border text-left">User</th>
//               <th className="py-3 px-4 border text-left">Amount</th>
//               <th className="py-3 px-4 border text-left">Profit</th>
//               <th className="py-3 px-4 border text-left">Time Left</th>
//               <th className="py-3 px-4 border text-left">Created At</th>
//               <th className="py-3 px-4 border text-left">Status</th>
//               <th className="py-3 px-4 border text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border">{order.productName}</td>
//                 <td className="py-2 px-4 border">
//                   {order.user?.username || "N/A"}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   RS.{order.originalFullAmount?.toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   RS.{order.originalExpectedProfit?.toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   {order.status === "pending" && timeRemaining[order._id] ? (
//                     <span className="font-mono">
//                       {formatTime(timeRemaining[order._id])}
//                     </span>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   {new Date(order.createdAt).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   <span
//                     className={`inline-block px-2 py-1 rounded-full text-xs ${
//                       order.status === "approved"
//                         ? "bg-green-100 text-green-800"
//                         : order.status === "rejected"
//                         ? "bg-red-100 text-red-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {order.status.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="py-2 px-4 border">
//                   <div className="flex space-x-2">
//                     {order.status === "pending" ? (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() =>
//                             handleStatusChange(order._id, "approved")
//                           }
//                           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleStatusChange(order._id, "rejected")
//                           }
//                           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                       >
//                         View
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleDeleteOrder(order._id)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
//                       title="Delete Order"
//                     >
//                       <FiTrash2 className="mr-1" />
//                       Delete
//                     </button>
//                     <button
//                       onClick={() => generateSingleOrderPDF(order)}
//                       className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4 mr-1"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       PDF
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//             <h2 className="text-xl font-bold mb-4">Order Details</h2>
//             <div className="space-y-2">
//               <p>
//                 <strong>Product:</strong> {selectedOrder.productName}
//               </p>
//               <p>
//                 <strong>User:</strong> {selectedOrder.user?.username || "N/A"}
//               </p>
//               <p>
//                 <strong>Amount:</strong> RS.
//                 {selectedOrder.fullAmount?.toLocaleString()}
//               </p>
//               <p>
//                 <strong>Expected Profit:</strong> RS.
//                 {selectedOrder.expectedProfit?.toLocaleString()}
//               </p>
//               <p>
//                 <strong>Status:</strong>
//                 <span
//                   className={`ml-2 px-2 py-1 rounded-full text-xs ${
//                     selectedOrder.status === "approved"
//                       ? "bg-green-100 text-green-800"
//                       : selectedOrder.status === "rejected"
//                       ? "bg-red-100 text-red-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {selectedOrder.status.toUpperCase()}
//                 </span>
//               </p>
//               <p>
//                 <strong>Created At:</strong>{" "}
//                 {new Date(selectedOrder.createdAt).toLocaleString()}
//               </p>
//               {selectedOrder.updatedAt && (
//                 <p>
//                   <strong>Last Updated:</strong>{" "}
//                   {new Date(selectedOrder.updatedAt).toLocaleString()}
//                 </p>
//               )}
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 onClick={() => generateSingleOrderPDF(selectedOrder)}
//                 className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Download PDF
//               </button>
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminOrders;




import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addLetterhead } from "../../utils/pdfHelper";
import logo from "../../assets/img/Logo.jpeg";
import axios from "axios";
import {
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiFileText,
  FiDownload,
  FiClock,
  FiDollarSign,
  FiUser,
  FiTrendingUp,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.put(
        `${baseUrl}/api/protected/orders/${orderId}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);

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

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/api/protected/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(orders.filter(order => order._id !== orderId));

      const newTimeRemaining = { ...timeRemaining };
      delete newTimeRemaining[orderId];
      setTimeRemaining(newTimeRemaining);

      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(error.response?.data?.msg || "Failed to delete order");
    }
  };

  const formatTime = (time) => {
    return `${String(time.hours).padStart(2, "0")}:${String(
      time.minutes
    ).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const stats = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    totalProfit: orders
      .filter((o) => o.status === "approved")
      .reduce((sum, order) => sum + (order.originalExpectedProfit || 0), 0),
  };

  const generateOrdersPDF = () => {
    const doc = new jsPDF();
    const margin = 15;

    // Use standard letterhead
    const startY = addLetterhead(doc, "Orders Report", logo);
    let yPos = startY;

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
      `RS.${order.originalFullAmount?.toLocaleString()}`,
      `RS.${order.originalExpectedProfit?.toLocaleString()}`,
      order.status.toUpperCase(),
      new Date(order.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 135, 245] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 15 },
    });

    const finalY = doc.lastAutoTable?.finalY || 150;
    doc.setFontSize(12);
    doc.text("Summary:", 14, finalY + 15);
    doc.setFontSize(10);
    doc.text(`Total Orders: ${orders.length}`, 14, finalY + 25);
    doc.text(`Pending: ${stats.pending}`, 14, finalY + 35);
    doc.text(`Approved: ${stats.approved}`, 14, finalY + 45);
    doc.text(`Rejected: ${stats.rejected}`, 14, finalY + 55);
    doc.text(
      `Total Expected Profit: RS.${stats.totalProfit.toLocaleString()}`,
      14,
      finalY + 65
    );

    doc.save("orders-report.pdf");
  };

  const generateSingleOrderPDF = (order) => {
    const doc = new jsPDF();
    const margin = 15;

    // Use standard letterhead
    const startY = addLetterhead(doc, "Order Details", logo);
    let yPos = startY;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order ID: ${order._id}`, margin, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text("Product Information", 14, 60);

    doc.setFontSize(10);
    doc.text(`Product: ${order.productName}`, 14, 70);
    doc.text(`User: ${order.user?.username || "N/A"}`, 14, 80);
    doc.text(`Amount: RS.${order.originalFullAmount?.toLocaleString()}`, 14, 90);
    doc.text(
      `Expected Profit: RS.${order.originalExpectedProfit?.toLocaleString()}`,
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

    doc.save(`order-${order._id}.pdf`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Order Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor all orders in the system
            </p>
          </div>

          <button
            onClick={generateOrdersPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm"
          >
            <FiFileText className="mr-2" /> Generate Full Report
          </button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FiPackage className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900">{stats.all}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <FiClock className="text-yellow-600 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FiCheck className="text-green-600 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Approved</div>
                <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FiTrendingUp className="text-purple-600 w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Profit</div>
                <div className="md:text-2xl text-md font-bold text-gray-900">
                  RS. {stats.totalProfit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setActiveFilter("all")}
          >
            All ({stats.all})
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setActiveFilter("pending")}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setActiveFilter("approved")}
          >
            Approved ({stats.approved})
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setActiveFilter("rejected")}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Orders Table/Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6">
          {filteredOrders.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Left
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {order.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            <FiCalendar className="inline mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiUser className="text-gray-400 mr-2" />
                            <span>{order.user?.username || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-400 mr-2" />
                            <span className="font-semibold">
                              RS. {order.originalFullAmount?.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-green-600">
                            <FiTrendingUp className="mr-2" />
                            <span className="font-semibold">
                              RS. {order.originalExpectedProfit?.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {order.status === "pending" && timeRemaining[order._id] ? (
                            <div className="flex items-center">
                              <FiClock className="text-yellow-500 mr-2" />
                              <span className="font-mono bg-yellow-50 px-2 py-1 rounded text-sm">
                                {formatTime(timeRemaining[order._id])}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : order.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {order.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleStatusChange(order._id, "approved")}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                >
                                  <FiCheck className="mr-1" /> Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order._id, "rejected")}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                >
                                  <FiX className="mr-1" /> Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <FiEye className="mr-1" /> View
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => generateSingleOrderPDF(order)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <FiDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {order.productName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiUser className="mr-1" />
                          {order.user?.username || "N/A"}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : order.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                        <div className="font-semibold">
                          RS. {order.originalFullAmount?.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Profit</div>
                        <div className="font-semibold text-green-600">
                          RS. {order.originalExpectedProfit?.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Created</div>
                        <div className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {order.status === "pending" && timeRemaining[order._id] && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Time Left</div>
                          <div className="font-mono text-yellow-700">
                            {formatTime(timeRemaining[order._id])}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                      {order.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(order._id, "approved")}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <FiCheck className="mr-2" /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(order._id, "rejected")}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <FiX className="mr-2" /> Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FiEye className="mr-2" /> View Details
                        </button>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-1"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => generateSingleOrderPDF(order)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex-1"
                          title="Download PDF"
                        >
                          <FiDownload className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                No orders found{activeFilter !== "all" ? ` with status "${activeFilter}"` : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FiPackage className="text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Product</div>
                  <div className="font-medium">{selectedOrder.productName}</div>
                </div>
              </div>

              <div className="flex items-center">
                <FiUser className="text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">User</div>
                  <div className="font-medium">{selectedOrder.user?.username || "N/A"}</div>
                </div>
              </div>

              <div className="flex items-center">
                <FiDollarSign className="text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">
                    RS. {selectedOrder.originalFullAmount?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FiTrendingUp className="text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Expected Profit</div>
                  <div className="font-medium text-green-600">
                    RS. {selectedOrder.originalExpectedProfit?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FiCalendar className="text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Created At</div>
                  <div className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-3">
                  <div className="text-sm text-gray-500">Status</div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedOrder.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedOrder.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedOrder.updatedAt && (
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="font-medium">
                      {new Date(selectedOrder.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => generateSingleOrderPDF(selectedOrder)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiDownload className="mr-2" /> Download PDF
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg transition-colors"
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

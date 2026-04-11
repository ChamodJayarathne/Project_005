/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   FiUser,
//   FiMail,
//   FiShield,
//   FiClock,
//   FiEdit,
//   FiArrowLeft,
//   FiFileText,
//   FiDollarSign,
//   FiEye,
//   FiTrash2,
//   FiCheck,
//   FiX,
// } from "react-icons/fi";

// export default function UserDetail() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("posts");
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Fetch user data
//         const userResponse = await axios.get(
//           `${baseUrl}/api/auth/users/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUser(userResponse.data);

//         // Fetch user's approved posts
//         const postsResponse = await axios.get(
//           `${baseUrl}/api/protected/posts/user/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setPosts(postsResponse.data);

//         // Fetch user's orders
//         const ordersResponse = await axios.get(
//           `${baseUrl}/api/protected/orders/user/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setOrders(ordersResponse.data);
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const handlePostStatusChange = async (postId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${baseUrl}/api/protected/posts/${postId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setPosts(
//         posts.map((post) =>
//           post._id === postId ? { ...post, status: newStatus } : post
//         )
//       );

//       alert(`Post status updated to ${newStatus}`);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to update post status");
//     }
//   };

//   const handleOrderStatusChange = async (orderId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${baseUrl}/api/protected/orders/${orderId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setOrders(
//         orders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );

//       alert(`Order status updated to ${newStatus}`);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to update order status");
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${baseUrl}/api/protected/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPosts(posts.filter((post) => post._id !== postId));
//       alert("Post deleted successfully");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to delete post");
//     }
//   };

//   // PDF Generator function
//   const downloadPDF = () => {
//     if (!user) return;

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 15;
//     let yPos = 20;

//     // Add title
//     doc.setFontSize(20);
//     doc.setTextColor(40, 53, 147); // Dark blue
//     doc.text(
//       `${activeTab === "posts" ? "Admin Posts Report" : "User Orders Report"}`,
//       pageWidth / 2,
//       yPos,
//       { align: "center" }
//     );
//     yPos += 10;

//     // Add date and user info
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPos);
//     doc.text(
//       `User: ${user.username} (${user.email})`,
//       pageWidth - margin,
//       yPos,
//       {
//         align: "right",
//       }
//     );
//     yPos += 15;

//     // Add a horizontal line
//     doc.setDrawColor(200, 200, 200);
//     doc.line(margin, yPos, pageWidth - margin, yPos);
//     yPos += 15;

//     if (activeTab === "posts" && posts.length > 0) {
//       // Generate PDF with post details
//       doc.setFontSize(16);
//       doc.setTextColor(40, 53, 147);
//       doc.text("Detailed Posts Information", margin, yPos);
//       yPos += 10;

//       posts.forEach((post, index) => {
//         // Check for page break
//         if (yPos > doc.internal.pageSize.height - 50) {
//           doc.addPage();
//           yPos = 20;
//         }

//         // Post header
//         doc.setFontSize(14);
//         doc.setTextColor(0, 0, 0);
//         doc.text(
//           `Post #${index + 1}: ${post.title || "Untitled Post"}`,
//           margin,
//           yPos
//         );
//         yPos += 8;

//         // Post metadata
//         doc.setFontSize(10);
//         doc.setTextColor(100, 100, 100);
//         doc.text(
//           `Status: ${post.status.toUpperCase()} | Created: ${new Date(
//             post.createdAt
//           ).toLocaleDateString()}`,
//           margin,
//           yPos
//         );
//         yPos += 10;

//         // Post details table
//         const postDetails = [
//           ["Product Name", post.productName || "N/A"],
//           // ["Category", post.category || "N/A"],
//           ["Amount", `RS.${post.fullAmount?.toLocaleString() || "0"}`],
//           [
//             "Expected Profit",
//             `RS.${post.expectedProfit?.toLocaleString() || "0"}`,
//           ],
//           ["Unit Price", `RS.${post.unitPrice?.toLocaleString() || "0"}`],
//           // ["Location", post.location || "N/A"],
//         ];

//         autoTable(doc, {
//           startY: yPos,
//           head: [["Field", "Value"]],
//           body: postDetails,
//           margin: { left: margin },
//           styles: { cellPadding: 3, fontSize: 10 },
//           columnStyles: {
//             0: { fontStyle: "bold", cellWidth: 40 },
//             1: { cellWidth: "auto" },
//           },
//           theme: "grid",
//         });

//         yPos = doc.lastAutoTable.finalY + 10;

//         // Post description
//         // doc.setFontSize(12);
//         // doc.setTextColor(0, 0, 0);
//         // doc.text("Description:", margin, yPos);
//         // yPos += 6;

//         // const description = post.description || "No description provided";
//         // const splitDescription = doc.splitTextToSize(
//         //   description,
//         //   pageWidth - margin * 2
//         // );
//         // doc.setFontSize(10);
//         // doc.setTextColor(50, 50, 50);
//         // doc.text(splitDescription, margin, yPos);
//         // yPos += splitDescription.length * 5 + 15;

//         // Separator between posts
//         if (index < posts.length - 1) {
//           doc.setDrawColor(200, 200, 200);
//           doc.line(margin, yPos, pageWidth - margin, yPos);
//           yPos += 15;
//         }
//       });
//     } else if (activeTab === "orders" && orders.length > 0) {
//       // Generate PDF with order details
//       doc.setFontSize(16);
//       doc.setTextColor(40, 53, 147);
//       doc.text("Detailed Orders Information", margin, yPos);
//       yPos += 15;

//       // Orders table
//       const ordersData = orders.map((order) => [
//         order.productName || "N/A",
//         `RS.${order.fullAmount?.toLocaleString() || "0"}`,
//         `RS.${order.expectedProfit?.toLocaleString() || "0"}`,
//         order.status.toUpperCase(),
//         new Date(order.createdAt).toLocaleDateString(),
//         // order.paymentMethod || "N/A",
//         // order.deliveryAddress || "N/A",
//       ]);

//       autoTable(doc, {
//         startY: yPos,
//         head: [
//           [
//             "Product",
//             "Amount",
//             "Profit",
//             "Status",
//             "Date",
//             "Payment",
//             "Address",
//           ],
//         ],
//         body: ordersData,
//         margin: { left: margin },
//         styles: { cellPadding: 3, fontSize: 9 },
//         columnStyles: {
//           0: { cellWidth: 30 },
//           1: { cellWidth: 20 },
//           2: { cellWidth: 20 },
//           3: { cellWidth: 20 },
//           4: { cellWidth: 20 },
//           5: { cellWidth: 25 },
//           6: { cellWidth: "auto" },
//         },
//         headStyles: { fillColor: [40, 53, 147] },
//         alternateRowStyles: { fillColor: [240, 240, 240] },
//       });

//       yPos = doc.lastAutoTable.finalY + 10;
//     } else {
//       // No data available for the active tab
//       doc.setFontSize(12);
//       doc.setTextColor(100, 100, 100);
//       doc.text(`No ${activeTab} found for this user`, pageWidth / 2, yPos, {
//         align: "center",
//       });
//     }

//     // Footer
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(150, 150, 150);
//       doc.text(
//         `Page ${i} of ${pageCount}`,
//         pageWidth / 2,
//         doc.internal.pageSize.height - 10,
//         { align: "center" }
//       );
//     }

//     // Save the PDF
//     doc.save(
//       `User_${activeTab}_Report_${
//         user.username || userId
//       }_${new Date().toLocaleDateString()}.pdf`
//     );
//   };
//   // const downloadPDF = () => {
//   //   if (!user) return;

//   //   const doc = new jsPDF();
//   //   const pageWidth = doc.internal.pageSize.width;

//   //   // Add title
//   //   doc.setFontSize(20);
//   //   doc.setTextColor(0, 0, 255);
//   //   doc.text("User Report", pageWidth / 2, 15, { align: "center" });

//   //   doc.setFontSize(12);
//   //   doc.setTextColor(0, 0, 0);

//   //   // Add date
//   //   const today = new Date().toLocaleDateString();
//   //   doc.text(`Generated on: ${today}`, pageWidth - 15, 10, { align: "right" });

//   //   // User information section
//   //   doc.setFontSize(16);
//   //   doc.text("User Information", 14, 30);
//   //   doc.setFontSize(12);

//   //   const userInfo = [
//   //     [`Name: ${user.name || "N/A"}`],
//   //     [`Email: ${user.email || "N/A"}`],
//   //     [`Role: ${user.role || "N/A"}`],
//   //     [`Status: ${user.status || "N/A"}`],
//   //     [
//   //       `Member Since: ${
//   //         new Date(user.createdAt).toLocaleDateString() || "N/A"
//   //       }`,
//   //     ],
//   //   ];

//   //   autoTable(doc, {
//   //     startY: 35,
//   //     head: [],
//   //     body: userInfo,
//   //     theme: "plain",
//   //     styles: { cellPadding: 1 },
//   //   });

//   //   // Posts section
//   //   let yPos = doc.lastAutoTable.finalY + 10;
//   //   doc.setFontSize(16);
//   //   doc.text("Posts", 14, yPos);
//   //   doc.setFontSize(12);

//   //   if (posts.length > 0) {
//   //     const postsData = posts.map((post) => [
//   //       post.title,
//   //       post.status,
//   //       new Date(post.createdAt).toLocaleDateString(),
//   //     ]);

//   //     autoTable(doc, {
//   //       startY: yPos + 5,
//   //       head: [["Title", "Status", "Created Date"]],
//   //       body: postsData,
//   //       theme: "striped",
//   //       headStyles: { fillColor: [66, 139, 202] },
//   //     });

//   //     yPos = doc.lastAutoTable.finalY + 10;
//   //   } else {
//   //     doc.text("No posts found for this user", 14, yPos + 5);
//   //     yPos += 15;
//   //   }

//   //   // Orders section
//   //   doc.setFontSize(16);
//   //   doc.text("Orders", 14, yPos);
//   //   doc.setFontSize(12);

//   //   if (orders.length > 0) {
//   //     const ordersData = orders.map((order) => [
//   //       order.productName || "N/A",
//   //       `RS.${order.fullAmount?.toLocaleString() || "0"}`,
//   //       `RS.${order.expectedProfit?.toLocaleString() || "0"}`,
//   //       order.status.toUpperCase(),
//   //       new Date(order.createdAt).toLocaleDateString(),
//   //     ]);

//   //     autoTable(doc, {
//   //       startY: yPos + 5,
//   //       head: [["Product", "Amount", "Profit", "Status", "Date"]],
//   //       body: ordersData,
//   //       theme: "striped",
//   //       headStyles: { fillColor: [66, 139, 202] },
//   //     });
//   //   } else {
//   //     doc.text("No orders found for this user", 14, yPos + 5);
//   //   }

//   //   // Footer
//   //   const pageCount = doc.internal.getNumberOfPages();
//   //   for (let i = 1; i <= pageCount; i++) {
//   //     doc.setPage(i);
//   //     doc.setFontSize(10);
//   //     doc.text(
//   //       `Page ${i} of ${pageCount}`,
//   //       pageWidth / 2,
//   //       doc.internal.pageSize.height - 10,
//   //       { align: "center" }
//   //     );
//   //   }

//   //   // Save the PDF
//   //   doc.save(`User_Report_${user.name || userId}_${today}.pdf`);
//   // };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     );

//   if (!user) return <div>User not found</div>;

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-6">
//         <button
//           onClick={() => navigate("/admin/accounts")}
//           className="flex items-center text-blue-600 hover:text-blue-800"
//         >
//           <FiArrowLeft className="mr-2" /> Back to Users
//         </button>
//         <button
//           onClick={downloadPDF}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
//         >
//           <FiFileText className="mr-2" /> Generate PDF
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">

//       </div>

//       {/* Tabs for Posts and Orders */}
//       <div className="flex-shrink-0 border-b border-gray-200 mb-6">
//         <button
//           className={`py-2 px-4 font-medium text-sm ${
//             activeTab === "posts"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("posts")}
//         >
//           <FiFileText className="inline mr-2" /> Posts ({posts.length})
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${
//             activeTab === "orders"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("orders")}
//         >
//           <FiDollarSign className="inline mr-2" /> Orders ({orders.length})
//         </button>
//       </div>

//       {/* Posts Tab Content */}

//       {activeTab === "posts" && (
//         <div className=" flex-1 bg-white rounded-lg shadow-md overflow-hidden mb-8">
//           <div className="p-6">
//             {posts.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-max divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Title
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {posts.map((post) => (
//                       <tr key={post._id}>
//                         <td className="px-6 py-4 ">
//                           <div className="flex items-center md:max-w-md max-w-full mx-auto">
//                             {post.image && (
//                               // <img
//                               //   src={`${baseUrl}/${post.image}`}
//                               //   alt={post.productName}
//                               //   className="w-10 h-10 object-cover rounded mr-3"
//                               // />
//                               <img
//                                 src={post?.image} // Direct Cloudinary URL
//                                 alt={post.productName}
//                                 // className="w-10 h-10 object-cover rounded mr-3"
//                                 className="w-full md:w-40 h-full object-cover mr-3"
//                                 onError={(e) => {
//                                   e.target.onerror = null;
//                                   // e.target.src = '/default-post.jpg'; // Fallback image
//                                 }}
//                               />
//                             )}
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {post.productName || "Untitled Post"}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {post.title}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-2 py-1 text-xs rounded-full ${
//                               post.status === "active"
//                                 ? "bg-green-100 text-green-800"
//                                 : post.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                           >
//                             {post.status.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <div className="font-medium">
//                             Full Amount: RS.
//                             {post.fullAmount?.toLocaleString() || "0"}
//                           </div>
//                           <div className="text-green-600">
//                             Expected Profit: +RS.
//                             {post.expectedProfit?.toLocaleString() || "0"}
//                           </div>
//                           <div className="text-gray-500">
//                             Unit Price: RS.
//                             {post.unitPrice?.toLocaleString() || "0"}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(post.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <Link
//                               // to={`/admin/posts/${post._id}`}
//                               to={`/admin/posts/${post._id}`}
//                               className="text-blue-600 hover:text-blue-900 flex items-center"
//                               title="View Details"
//                             >
//                               <FiEye className="mr-1" />
//                             </Link>
//                             <Link
//                               // to={`/admin/posts/edit/${post._id}`}
//                               to={`/admin/posts/edit/${post._id}`}
//                               className="text-yellow-600 hover:text-yellow-900 flex items-center"
//                               title="Edit Post"
//                             >
//                               <FiEdit className="mr-1" />
//                             </Link>
//                             <button
//                               onClick={() => handleDeletePost(post._id)}
//                               className="text-red-600 hover:text-red-900 flex items-center"
//                               title="Delete Post"
//                             >
//                               <FiTrash2 className="mr-1" />
//                             </button>
//                             {post.status === "pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handlePostStatusChange(post._id, "active")
//                                   }
//                                   className="text-green-600 hover:text-green-900 flex items-center"
//                                   title="Approve Post"
//                                 >
//                                   <FiCheck className="mr-1" />
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handlePostStatusChange(post._id, "rejected")
//                                   }
//                                   className="text-red-600 hover:text-red-900 flex items-center"
//                                   title="Reject Post"
//                                 >
//                                   <FiX className="mr-1" />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No posts found for this user
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Orders Tab Content */}
//       {activeTab === "orders" && (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="p-6">
//             {orders.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Profit
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {orders.map((order) => (
//                       <tr key={order._id}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {order.productName}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           RS.{order.originalFullAmount?.toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           RS.{order.originalExpectedProfit?.toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-2 py-1 text-xs rounded-full ${
//                               order.status === "approved"
//                                 ? "bg-green-100 text-green-800"
//                                 : order.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                           >
//                             {order.status.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             {order.status === "pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleOrderStatusChange(
//                                       order._id,
//                                       "approved"
//                                     )
//                                   }
//                                   className="text-green-600 hover:text-green-900"
//                                 >
//                                   Approve
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleOrderStatusChange(
//                                       order._id,
//                                       "rejected"
//                                     )
//                                   }
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   Reject
//                                 </button>
//                               </>
//                             )}

//                             {order.status === "rejected" && (
//                               <button
//                                 onClick={() =>
//                                   handleOrderStatusChange(order._id, "approved")
//                                 }
//                                 className="text-green-600 hover:text-green-900"
//                               >
//                                 Approve
//                               </button>
//                             )}

//                             {order.status === "approved" && (
//                               <Link
//                                 to={`/admin/orders/${order._id}`}
//                                 className="text-blue-600 hover:text-blue-900"
//                               >
//                                 View Details
//                               </Link>
//                             )}
//                           </div>
//                         </td>
//                         {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             {order.status === "pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleOrderStatusChange(
//                                       order._id,
//                                       "approved"
//                                     )
//                                   }
//                                   className="text-green-600 hover:text-green-900"
//                                 >
//                                   Approve
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleOrderStatusChange(
//                                       order._id,
//                                       "rejected"
//                                     )
//                                   }
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   Reject
//                                 </button>
//                               </>
//                             )}

//                             <Link
//                               to={`/admin/orders/${order._id}`}
//                               className="text-blue-600 hover:text-blue-900"
//                             >
//                               View Details
//                             </Link>
//                           </div>
//                         </td> */}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No orders found for this user
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addLetterhead } from "../../utils/pdfHelper";
import logo from "../../assets/img/Logo.jpeg";
import {
  FiArrowLeft,
  FiFileText,
  FiDollarSign,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
  FiEdit,
  FiUser,
  FiCalendar,
  FiDollarSign as FiDollar,
  FiTrendingUp,
} from "react-icons/fi";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userResponse, postsResponse, ordersResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/auth/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/protected/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/protected/orders/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userResponse.data);
        setPosts(postsResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handlePostStatusChange = async (postId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/api/protected/posts/${postId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, status: newStatus } : post
        )
      );

      alert(`Post status updated to ${newStatus}`);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update post status");
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/api/protected/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update order status");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/api/protected/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete post");
    }
  };

  const downloadPDF = () => {
    if (!user) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;

    // Use standard letterhead
    const reportTitle = activeTab === "posts" ? "Admin Posts Report" : "User Orders Report";
    const startY = addLetterhead(doc, reportTitle, logo);
    let yPos = startY;

    // User header info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `User: ${user.username} (${user.email})`,
      margin,
      yPos
    );
    yPos += 15;

    if (activeTab === "posts" && posts.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(40, 53, 147);
      doc.text("Detailed Posts Information", margin, yPos);
      yPos += 10;

      posts.forEach((post, index) => {
        if (yPos > doc.internal.pageSize.height - 50) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `Post #${index + 1}: ${post.title || "Untitled Post"}`,
          margin,
          yPos
        );
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Status: ${post.status.toUpperCase()} | Created: ${new Date(
            post.createdAt
          ).toLocaleDateString()}`,
          margin,
          yPos
        );
        yPos += 10;

        const postDetails = [
          ["Product Name", post.productName || "N/A"],
          ["Amount", `RS.${post.fullAmount?.toLocaleString() || "0"}`],
          [
            "Expected Profit",
            `RS.${post.expectedProfit?.toLocaleString() || "0"}`,
          ],
          ["Unit Price", `RS.${post.unitPrice?.toLocaleString() || "0"}`],
        ];

        autoTable(doc, {
          startY: yPos,
          head: [["Field", "Value"]],
          body: postDetails,
          margin: { left: margin },
          styles: { cellPadding: 3, fontSize: 10 },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: "auto" },
          },
          theme: "grid",
        });

        yPos = doc.lastAutoTable.finalY + 10;

        if (index < posts.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 15;
        }
      });
    } else if (activeTab === "orders" && orders.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(40, 53, 147);
      doc.text("Detailed Orders Information", margin, yPos);
      yPos += 15;

      const ordersData = orders.map((order) => [
        order.productName || "N/A",
        `RS.${order.fullAmount?.toLocaleString() || "0"}`,
        `RS.${order.expectedProfit?.toLocaleString() || "0"}`,
        order.status.toUpperCase(),
        new Date(order.createdAt).toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Product", "Amount", "Profit", "Status", "Date"]],
        body: ordersData,
        margin: { left: margin },
        styles: { cellPadding: 3, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
        },
        headStyles: { fillColor: [40, 53, 147] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`No ${activeTab} found for this user`, pageWidth / 2, yPos, {
        align: "center",
      });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save(
      `User_${activeTab}_Report_${user.username || userId
      }_${new Date().toLocaleDateString()}.pdf`
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  if (!user) return <div className="text-gray-600 text-center py-8">User not found</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/accounts")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Accounts
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm"
            >
              <FiFileText className="mr-2" /> Generate PDF Report
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center shadow-sm">
                  <FiUser className="text-gray-400 text-3xl" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {user.username}
              </h1>
              <div className="flex flex-wrap gap-4 mb-3">
                <div className="flex items-center text-gray-600">
                  <FiUser className="mr-2" />
                  <span className="font-medium">{user.role || "User"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center text-blue-600 mb-1">
                    <FiFileText className="mr-2" />
                    <span className="text-sm font-medium">Total Posts</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center text-green-600 mb-1">
                    <FiDollarSign className="mr-2" />
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center text-purple-600 mb-1">
                    <FiTrendingUp className="mr-2" />
                    <span className="text-sm font-medium">Active Status</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                      {user.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
          <button
            className={`flex items-center px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === "posts"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("posts")}
          >
            <FiFileText className="mr-2" />
            <span>Posts</span>
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
              {posts.length}
            </span>
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === "orders"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            onClick={() => setActiveTab("orders")}
          >
            <FiDollarSign className="mr-2" />
            <span>Orders</span>
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
              {orders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      {activeTab === "posts" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6">
            {posts.length > 0 ? (
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
                          Details
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
                      {posts.map((post) => (
                        <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {post.image && (
                                <img
                                  src={post.image}
                                  alt={post.productName}
                                  className="w-12 h-12 rounded-lg object-cover mr-4"
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {post.productName || "Untitled Post"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <FiDollar className="mr-2 text-gray-400" />
                                <span className="font-semibold">
                                  RS. {post.fullAmount?.toLocaleString() || "0"}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-green-600">
                                <FiTrendingUp className="mr-2" />
                                <span>Profit: RS. {post.expectedProfit?.toLocaleString() || "0"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${post.status === "active"
                                ? "bg-green-100 text-green-800"
                                : post.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                              {post.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/admin/posts/${post._id}`}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                              >
                                <FiEye className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/admin/posts/edit/${post._id}`}
                                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FiEdit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post._id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                              {post.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handlePostStatusChange(post._id, "active")}
                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <FiCheck className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handlePostStatusChange(post._id, "rejected")}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {posts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start flex-1">
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.productName}
                              className="w-16 h-16 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {post.productName || "Untitled Post"}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FiCalendar className="mr-1" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === "active"
                            ? "bg-green-100 text-green-800"
                            : post.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {post.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Amount</div>
                          <div className="font-semibold">
                            RS. {post.fullAmount?.toLocaleString() || "0"}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Profit</div>
                          <div className="font-semibold text-green-600">
                            RS. {post.expectedProfit?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/posts/${post._id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/posts/edit/${post._id}`}
                            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {post.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePostStatusChange(post._id, "active")}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePostStatusChange(post._id, "rejected")}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No posts found for this user</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6">
            {orders.length > 0 ? (
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
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profit
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
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {order.productName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold">
                              RS. {order.originalFullAmount?.toLocaleString() || "0"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-green-600">
                              RS. {order.originalExpectedProfit?.toLocaleString() || "0"}
                            </div>
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
                              {order.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleOrderStatusChange(order._id, "approved")}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleOrderStatusChange(order._id, "rejected")}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {order.status === "approved" && (
                                <Link
                                  to={`/admin/orders/${order._id}`}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  View Details
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.productName || "N/A"}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FiCalendar className="mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()}
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
                            RS. {order.originalFullAmount?.toLocaleString() || "0"}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Profit</div>
                          <div className="font-semibold text-green-600">
                            RS. {order.originalExpectedProfit?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        {order.status === "pending" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleOrderStatusChange(order._id, "approved")}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center transition-colors"
                            >
                              Approve Order
                            </button>
                            <button
                              onClick={() => handleOrderStatusChange(order._id, "rejected")}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-center transition-colors"
                            >
                              Reject Order
                            </button>
                          </div>
                        )}
                        {order.status === "approved" && (
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition-colors"
                          >
                            View Order Details
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No orders found for this user</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   FiUser,
//   FiMail,
//   FiShield,
//   FiClock,
//   FiEdit,
//   FiArrowLeft,
//   FiFileText,
//   FiDollarSign,
//   FiEye,
//   FiTrash2,
//   FiCheck,
//   FiX,
//   FiMoreVertical,
// } from "react-icons/fi";

// export default function UserDetail() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Fetch user data
//         const userResponse = await axios.get(
//           `${baseUrl}/api/auth/users/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUser(userResponse.data);

//         // Fetch user's approved posts
//         const postsResponse = await axios.get(
//           `${baseUrl}/api/protected/posts/user/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setPosts(postsResponse.data);

//         // Fetch user's orders
//         const ordersResponse = await axios.get(
//           `${baseUrl}/api/protected/orders/user/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setOrders(ordersResponse.data);
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const handlePostStatusChange = async (postId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${baseUrl}/api/protected/posts/${postId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setPosts(
//         posts.map((post) =>
//           post._id === postId ? { ...post, status: newStatus } : post
//         )
//       );

//       alert(`Post status updated to ${newStatus}`);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to update post status");
//     }
//   };

//   const handleOrderStatusChange = async (orderId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${baseUrl}/api/protected/orders/${orderId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setOrders(
//         orders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );

//       alert(`Order status updated to ${newStatus}`);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to update order status");
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${baseUrl}/api/protected/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setPosts(posts.filter((post) => post._id !== postId));
//       alert("Post deleted successfully");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to delete post");
//     }
//   };

//   // PDF Generator function
//   const downloadPDF = () => {
//     if (!user) return;

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 15;
//     let yPos = 20;

//     // Add title
//     doc.setFontSize(20);
//     doc.setTextColor(40, 53, 147);
//     doc.text(
//       `${activeTab === "posts" ? "Admin Posts Report" : "User Orders Report"}`,
//       pageWidth / 2,
//       yPos,
//       { align: "center" }
//     );
//     yPos += 10;

//     // Add date and user info
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPos);
//     doc.text(
//       `User: ${user.username} (${user.email})`,
//       pageWidth - margin,
//       yPos,
//       {
//         align: "right",
//       }
//     );
//     yPos += 15;

//     // Add a horizontal line
//     doc.setDrawColor(200, 200, 200);
//     doc.line(margin, yPos, pageWidth - margin, yPos);
//     yPos += 15;

//     if (activeTab === "posts" && posts.length > 0) {
//       // Generate PDF with post details
//       doc.setFontSize(16);
//       doc.setTextColor(40, 53, 147);
//       doc.text("Detailed Posts Information", margin, yPos);
//       yPos += 10;

//       posts.forEach((post, index) => {
//         // Check for page break
//         if (yPos > doc.internal.pageSize.height - 50) {
//           doc.addPage();
//           yPos = 20;
//         }

//         // Post header
//         doc.setFontSize(14);
//         doc.setTextColor(0, 0, 0);
//         doc.text(
//           `Post #${index + 1}: ${post.title || "Untitled Post"}`,
//           margin,
//           yPos
//         );
//         yPos += 8;

//         // Post metadata
//         doc.setFontSize(10);
//         doc.setTextColor(100, 100, 100);
//         doc.text(
//           `Status: ${post.status.toUpperCase()} | Created: ${new Date(
//             post.createdAt
//           ).toLocaleDateString()}`,
//           margin,
//           yPos
//         );
//         yPos += 10;

//         // Post details table
//         const postDetails = [
//           ["Product Name", post.productName || "N/A"],
//           ["Amount", `RS.${post.fullAmount?.toLocaleString() || "0"}`],
//           [
//             "Expected Profit",
//             `RS.${post.expectedProfit?.toLocaleString() || "0"}`,
//           ],
//           ["Unit Price", `RS.${post.unitPrice?.toLocaleString() || "0"}`],
//         ];

//         autoTable(doc, {
//           startY: yPos,
//           head: [["Field", "Value"]],
//           body: postDetails,
//           margin: { left: margin },
//           styles: { cellPadding: 3, fontSize: 10 },
//           columnStyles: {
//             0: { fontStyle: "bold", cellWidth: 40 },
//             1: { cellWidth: "auto" },
//           },
//           theme: "grid",
//         });

//         yPos = doc.lastAutoTable.finalY + 10;

//         if (index < posts.length - 1) {
//           doc.setDrawColor(200, 200, 200);
//           doc.line(margin, yPos, pageWidth - margin, yPos);
//           yPos += 15;
//         }
//       });
//     } else if (activeTab === "orders" && orders.length > 0) {
//       doc.setFontSize(16);
//       doc.setTextColor(40, 53, 147);
//       doc.text("Detailed Orders Information", margin, yPos);
//       yPos += 15;

//       const ordersData = orders.map((order) => [
//         order.productName || "N/A",
//         `RS.${order.fullAmount?.toLocaleString() || "0"}`,
//         `RS.${order.expectedProfit?.toLocaleString() || "0"}`,
//         order.status.toUpperCase(),
//         new Date(order.createdAt).toLocaleDateString(),
//       ]);

//       autoTable(doc, {
//         startY: yPos,
//         head: [["Product", "Amount", "Profit", "Status", "Date"]],
//         body: ordersData,
//         margin: { left: margin },
//         styles: { cellPadding: 3, fontSize: 9 },
//         columnStyles: {
//           0: { cellWidth: 30 },
//           1: { cellWidth: 20 },
//           2: { cellWidth: 20 },
//           3: { cellWidth: 20 },
//           4: { cellWidth: 20 },
//         },
//         headStyles: { fillColor: [40, 53, 147] },
//         alternateRowStyles: { fillColor: [240, 240, 240] },
//       });

//       yPos = doc.lastAutoTable.finalY + 10;
//     } else {
//       doc.setFontSize(12);
//       doc.setTextColor(100, 100, 100);
//       doc.text(`No ${activeTab} found for this user`, pageWidth / 2, yPos, {
//         align: "center",
//       });
//     }

//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(150, 150, 150);
//       doc.text(
//         `Page ${i} of ${pageCount}`,
//         pageWidth / 2,
//         doc.internal.pageSize.height - 10,
//         { align: "center" }
//       );
//     }

//     doc.save(
//       `User_${activeTab}_Report_${
//         user.username || userId
//       }_${new Date().toLocaleDateString()}.pdf`
//     );
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     );

//   if (!user) return <div>User not found</div>;

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <button
//           onClick={() => navigate("/admin/accounts")}
//           className="flex items-center text-blue-600 hover:text-blue-800 w-full md:w-auto"
//         >
//           <FiArrowLeft className="mr-2" /> Back to Users
//         </button>
//         <button
//           onClick={downloadPDF}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center w-full md:w-auto"
//         >
//           <FiFileText className="mr-2" /> Generate PDF
//         </button>
//       </div>

//       {/* Tabs for Posts and Orders */}
//       <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
//         <button
//           className={`py-3 px-4 font-medium text-sm whitespace-nowrap ${
//             activeTab === "posts"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("posts")}
//         >
//           <FiFileText className="inline mr-2" /> Posts ({posts.length})
//         </button>
//         <button
//           className={`py-3 px-4 font-medium text-sm whitespace-nowrap ${
//             activeTab === "orders"
//               ? "border-b-2 border-blue-500 text-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("orders")}
//         >
//           <FiDollarSign className="inline mr-2" /> Orders ({orders.length})
//         </button>
//       </div>

//       {/* Posts Tab Content */}
//       {activeTab === "posts" && (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//           <div className="p-4 md:p-6">
//             {posts.length > 0 ? (
//               <div className="overflow-x-auto">
//                 {/* Desktop Table View */}
//                 <table className="hidden md:table min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {posts.map((post) => (
//                       <tr key={post._id}>
//                         <td className="px-4 py-4">
//                           <div className="flex items-center max-w-full lg:max-w-[430px] mx-auto">
//                             {post.image && (
//                               <img
//                                 src={post?.image}
//                                 alt={post.productName}
//                                 className="w-12 h-12 md:w-16 md:h-16 object-cover rounded mr-3"
//                               />
//                             )}
//                             <div className="min-w-0 flex-1">
//                               <div className="text-sm font-medium text-gray-900 truncate">
//                                 {post.productName || "Untitled Post"}
//                               </div>
//                               <div className="text-sm text-gray-500 truncate">
//                                 {post.title}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs rounded-full ${
//                               post.status === "active"
//                                 ? "bg-green-100 text-green-800"
//                                 : post.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                           >
//                             {post.status.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4">
//                           <div className="space-y-1">
//                             <div className="text-sm font-medium">
//                               RS. {post.fullAmount?.toLocaleString() || "0"}
//                             </div>
//                             <div className="text-xs text-green-600">
//                               Profit: +RS.
//                               {post.expectedProfit?.toLocaleString() || "0"}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-500">
//                           {new Date(post.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-4">
//                           <div className="flex flex-wrap gap-2">
//                             <Link
//                               to={`/admin/posts/${post._id}`}
//                               className="text-blue-600 hover:text-blue-900 p-1"
//                               title="View"
//                             >
//                               <FiEye className="w-4 h-4" />
//                             </Link>
//                             <Link
//                               to={`/admin/posts/edit/${post._id}`}
//                               className="text-yellow-600 hover:text-yellow-900 p-1"
//                               title="Edit"
//                             >
//                               <FiEdit className="w-4 h-4" />
//                             </Link>
//                             <button
//                               onClick={() => handleDeletePost(post._id)}
//                               className="text-red-600 hover:text-red-900 p-1"
//                               title="Delete"
//                             >
//                               <FiTrash2 className="w-4 h-4" />
//                             </button>
//                             {post.status === "pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handlePostStatusChange(post._id, "active")
//                                   }
//                                   className="text-green-600 hover:text-green-900 p-1"
//                                   title="Approve"
//                                 >
//                                   <FiCheck className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handlePostStatusChange(post._id, "rejected")
//                                   }
//                                   className="text-red-600 hover:text-red-900 p-1"
//                                   title="Reject"
//                                 >
//                                   <FiX className="w-4 h-4" />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Mobile Card View */}
//                 <div className="md:hidden space-y-4">
//                   {posts.map((post) => (
//                     <div key={post._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-start">
//                           {post.image && (
//                             <img
//                               src={post?.image}
//                               alt={post.productName}
//                               className="w-16 h-16 object-cover rounded mr-3"
//                             />
//                           )}
//                           <div>
//                             <h3 className="font-medium text-gray-900">
//                               {post.productName || "Untitled Post"}
//                             </h3>
//                             <p className="text-sm text-gray-500 truncate">
//                               {post.title}
//                             </p>
//                           </div>
//                         </div>
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full ${
//                             post.status === "active"
//                               ? "bg-green-100 text-green-800"
//                               : post.status === "rejected"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {post.status.toUpperCase()}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3 mb-3">
//                         <div>
//                           <div className="text-xs text-gray-500">Amount</div>
//                           <div className="font-medium">
//                             RS. {post.fullAmount?.toLocaleString() || "0"}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Profit</div>
//                           <div className="text-green-600 font-medium">
//                             +RS. {post.expectedProfit?.toLocaleString() || "0"}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Unit Price</div>
//                           <div className="font-medium">
//                             RS. {post.unitPrice?.toLocaleString() || "0"}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Created</div>
//                           <div className="font-medium">
//                             {new Date(post.createdAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-center pt-3 border-t border-gray-100">
//                         <div className="flex space-x-2">
//                           <Link
//                             to={`/admin/posts/${post._id}`}
//                             className="text-blue-600 hover:text-blue-900 p-2"
//                             title="View"
//                           >
//                             <FiEye className="w-4 h-4" />
//                           </Link>
//                           <Link
//                             to={`/admin/posts/edit/${post._id}`}
//                             className="text-yellow-600 hover:text-yellow-900 p-2"
//                             title="Edit"
//                           >
//                             <FiEdit className="w-4 h-4" />
//                           </Link>
//                           <button
//                             onClick={() => handleDeletePost(post._id)}
//                             className="text-red-600 hover:text-red-900 p-2"
//                             title="Delete"
//                           >
//                             <FiTrash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                         {post.status === "pending" && (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() =>
//                                 handlePostStatusChange(post._id, "active")
//                               }
//                               className="text-green-600 hover:text-green-900 p-2"
//                               title="Approve"
//                             >
//                               <FiCheck className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handlePostStatusChange(post._id, "rejected")
//                               }
//                               className="text-red-600 hover:text-red-900 p-2"
//                               title="Reject"
//                             >
//                               <FiX className="w-4 h-4" />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No posts found for this user
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Orders Tab Content */}
//       {activeTab === "orders" && (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="p-4 md:p-6">
//             {orders.length > 0 ? (
//               <div className="overflow-x-auto">
//                 {/* Desktop Table View */}
//                 <table className="hidden md:table min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Profit
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {orders.map((order) => (
//                       <tr key={order._id}>
//                         <td className="px-4 py-4">
//                           <div className="text-sm font-medium text-gray-900 truncate">
//                             {order.productName || "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 text-sm font-medium">
//                           RS. {order.originalFullAmount?.toLocaleString() || "0"}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-green-600">
//                           RS. {order.originalExpectedProfit?.toLocaleString() || "0"}
//                         </td>
//                         <td className="px-4 py-4">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs rounded-full ${
//                               order.status === "approved"
//                                 ? "bg-green-100 text-green-800"
//                                 : order.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                           >
//                             {order.status.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-4">
//                           <div className="flex flex-wrap gap-2">
//                             {order.status === "pending" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleOrderStatusChange(order._id, "approved")
//                                   }
//                                   className="text-green-600 hover:text-green-900 text-sm px-2 py-1 border border-green-200 rounded"
//                                 >
//                                   Approve
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleOrderStatusChange(order._id, "rejected")
//                                   }
//                                   className="text-red-600 hover:text-red-900 text-sm px-2 py-1 border border-red-200 rounded"
//                                 >
//                                   Reject
//                                 </button>
//                               </>
//                             )}
//                             {order.status === "approved" && (
//                               <Link
//                                 to={`/admin/orders/${order._id}`}
//                                 className="text-blue-600 hover:text-blue-900 text-sm px-2 py-1 border border-blue-200 rounded"
//                               >
//                                 View
//                               </Link>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Mobile Card View */}
//                 <div className="md:hidden space-y-4">
//                   {orders.map((order) => (
//                     <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="font-medium text-gray-900">
//                             {order.productName || "N/A"}
//                           </h3>
//                         </div>
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full ${
//                             order.status === "approved"
//                               ? "bg-green-100 text-green-800"
//                               : order.status === "rejected"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {order.status.toUpperCase()}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <div className="text-xs text-gray-500">Amount</div>
//                           <div className="font-medium">
//                             RS. {order.originalFullAmount?.toLocaleString() || "0"}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Profit</div>
//                           <div className="text-green-600 font-medium">
//                             RS. {order.originalExpectedProfit?.toLocaleString() || "0"}
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Date</div>
//                           <div className="font-medium">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
//                         {order.status === "pending" && (
//                           <>
//                             <button
//                               onClick={() =>
//                                 handleOrderStatusChange(order._id, "approved")
//                               }
//                               className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded text-center"
//                             >
//                               Approve
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleOrderStatusChange(order._id, "rejected")
//                               }
//                               className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded text-center"
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                         {order.status === "approved" && (
//                           <Link
//                             to={`/admin/orders/${order._id}`}
//                             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded text-center"
//                           >
//                             View Details
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No orders found for this user
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
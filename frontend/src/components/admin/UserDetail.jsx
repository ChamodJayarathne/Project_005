
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiUser,
  FiMail,
  FiShield,
  FiClock,
  FiEdit,
  FiArrowLeft,
  FiFileText,
  FiDollarSign,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
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
  const baseUrl = import.meta.env.VITE_API_BASE_URI ;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user data
        const userResponse = await axios.get(
          `${baseUrl}/api/auth/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);

        // Fetch user's approved posts
        const postsResponse = await axios.get(
          `${baseUrl}/api/protected/posts/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(postsResponse.data);

        // Fetch user's orders
        const ordersResponse = await axios.get(
          `${baseUrl}/api/protected/orders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      await axios.delete(
        `${baseUrl}/api/protected/posts/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(posts.filter((post) => post._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete post");
    }
  };

  // PDF Generator function
  const downloadPDF = () => {
    if (!user) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255);
    doc.text("User Report", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Add date
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, pageWidth - 15, 10, { align: "right" });

    // User information section
    doc.setFontSize(16);
    doc.text("User Information", 14, 30);
    doc.setFontSize(12);

    const userInfo = [
      [`Name: ${user.name || "N/A"}`],
      [`Email: ${user.email || "N/A"}`],
      [`Role: ${user.role || "N/A"}`],
      [`Status: ${user.status || "N/A"}`],
      [
        `Member Since: ${
          new Date(user.createdAt).toLocaleDateString() || "N/A"
        }`,
      ],
    ];

    autoTable(doc, {
      startY: 35,
      head: [],
      body: userInfo,
      theme: "plain",
      styles: { cellPadding: 1 },
    });

    // Posts section
    let yPos = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text("Posts", 14, yPos);
    doc.setFontSize(12);

    if (posts.length > 0) {
      const postsData = posts.map((post) => [
        post.title,
        post.status,
        new Date(post.createdAt).toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: yPos + 5,
        head: [["Title", "Status", "Created Date"]],
        body: postsData,
        theme: "striped",
        headStyles: { fillColor: [66, 139, 202] },
      });

      yPos = doc.lastAutoTable.finalY + 10;
    } else {
      doc.text("No posts found for this user", 14, yPos + 5);
      yPos += 15;
    }

    // Orders section
    doc.setFontSize(16);
    doc.text("Orders", 14, yPos);
    doc.setFontSize(12);

    if (orders.length > 0) {
      const ordersData = orders.map((order) => [
        order.productName || "N/A",
        `RS.${order.fullAmount?.toLocaleString() || "0"}`,
        `RS.${order.expectedProfit?.toLocaleString() || "0"}`,
        order.status.toUpperCase(),
        new Date(order.createdAt).toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: yPos + 5,
        head: [["Product", "Amount", "Profit", "Status", "Date"]],
        body: ordersData,
        theme: "striped",
        headStyles: { fillColor: [66, 139, 202] },
      });
    } else {
      doc.text("No orders found for this user", 14, yPos + 5);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`User_Report_${user.name || userId}_${today}.pdf`);
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

  if (!user) return <div>User not found</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/admin/accounts")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" /> Back to Users
        </button>
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FiFileText className="mr-2" /> Generate PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* User details section remains the same */}
        {/* ... existing user details code ... */}
      </div>

      {/* Tabs for Posts and Orders */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "posts"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          <FiFileText className="inline mr-2" /> Posts ({posts.length})
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "orders"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <FiDollarSign className="inline mr-2" /> Orders ({orders.length})
        </button>
      </div>

      {/* Posts Tab Content */}

      {activeTab === "posts" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            {posts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {post.image && (
                              <img
                                src={`${baseUrl}/${post.image}`}
                                alt={post.productName}
                                className="w-10 h-10 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.productName || "Untitled Post"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {post.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              post.status === "active"
                                ? "bg-green-100 text-green-800"
                                : post.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">
                            RS.{post.fullAmount?.toLocaleString() || "0"}
                          </div>
                          <div className="text-green-600">
                            +RS.{post.expectedProfit?.toLocaleString() || "0"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              // to={`/admin/posts/${post._id}`}
                              to={`/admin/posts/${post._id}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                              title="View Details"
                            >
                              <FiEye className="mr-1" />
                            </Link>
                            <Link
                              // to={`/admin/posts/edit/${post._id}`}
                              to={`/admin/posts/edit/${post._id}`}
                              className="text-yellow-600 hover:text-yellow-900 flex items-center"
                              title="Edit Post"
                            >
                              <FiEdit className="mr-1" />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Delete Post"
                            >
                              <FiTrash2 className="mr-1" />
                            </button>
                            {post.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handlePostStatusChange(post._id, "active")
                                  }
                                  className="text-green-600 hover:text-green-900 flex items-center"
                                  title="Approve Post"
                                >
                                  <FiCheck className="mr-1" />
                                </button>
                                <button
                                  onClick={() =>
                                    handlePostStatusChange(post._id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                  title="Reject Post"
                                >
                                  <FiX className="mr-1" />
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                No posts found for this user
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab Content */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.productName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          RS.{order.fullAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          RS.{order.expectedProfit?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {order.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleOrderStatusChange(
                                      order._id,
                                      "approved"
                                    )
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleOrderStatusChange(
                                      order._id,
                                      "rejected"
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders found for this user
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

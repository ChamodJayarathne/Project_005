import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";
import item1 from "../assets/img/Item.jpg";
import { FiDollarSign, FiFileText } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard({ user, onLogout }) {
  const [userData, setUserData] = useState(user);
  const [userOrders, setUserOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [profitSummary, setProfitSummary] = useState({
    totalPaid: 0,
    totalRemaining: 0,
    totalOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
  });

  // const totalExpectedFullAmount =
  //   order.originalFullAmount +
  //   (order.expectedProfit || order.originalExpectedProfit);
  // const totalOriginal = order.originalFullAmount + order.originalExpectedProfit;

  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  const fetchProfitSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}/api/protected/orders/profit/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfitSummary(response.data.data);
    } catch (error) {
      console.error("Error fetching profit summary:", error);
    }
  };

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get(
          `${baseUrl}/api/protected/current-user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setUserData(response.data);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        if (error.response?.status === 401) onLogout();
      }
    };

    if (!user) fetchUserData();
    else setUserData(user);
  }, [user, onLogout]);

  // Fetch posts and orders with refresh capability
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        // setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token missing");
          return;
        }

        // Fetch available posts
        const postsResponse = await axios.get(
          `${baseUrl}/api/protected/posts/available`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Filter out expired posts and posts not visible to current user
        const now = new Date();
        const filteredPosts = postsResponse.data.filter((post) => {
          const postTime = new Date(post.createdAt);
          const isExpired = now - postTime > 48 * 60 * 60 * 1000;
          return !isExpired;
        });

        setPosts(filteredPosts);

        // Fetch user orders
        // const ordersResponse = await axios.get(
        //   `${baseUrl}/api/protected/user/orders`,
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        // setUserOrders(ordersResponse.data);
        const ordersResponse = await axios.get(
          `${baseUrl}/api/protected/user/orders?status=approved`, // Add status filter
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserOrders(ordersResponse.data);

        // Fetch profit summary
        await fetchProfitSummary();
      } catch (error) {
        console.error("Network Error:", error);
        setError("Network error. Please try again later.");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [refreshCounter]); // Added refreshCounter dependency

  const handleInvest = async (post) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/api/protected/orders`,
        {
          postId: post._id,
          productName: post.productName,
          fullAmount: post.fullAmount,
          expectedProfit: post.expectedProfit,
          unitPrice: post.unitPrice,
          timeLine: post.timeLine,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI and trigger refresh
      setPosts(posts.filter((p) => p._id !== post._id));
      setRefreshCounter((prev) => prev + 1); // Trigger refresh
      alert("Investment successful!");
    } catch (error) {
      console.error("Investment error:", error);
      alert(
        `Investment failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const generateDashboardPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let yPos = 20;

    // Add title and date
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147); // Dark blue
    doc.text("Investment Dashboard Report", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth - margin,
      yPos,
      { align: "right" }
    );
    doc.text(
      `User: ${userData?.username || "N/A"} (${userData?.email || "N/A"})`,
      margin,
      yPos
    );
    yPos += 15;

    // Add a horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // User Profile Section
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text("User Profile", margin, yPos);
    yPos += 10;

    const profileData = [
      ["Username:", userData?.username || "N/A"],
      ["Email:", userData?.email || "N/A"],
      ["Role:", userData?.role || "N/A"],
      // [
      //   "Member Since:",
      //   userData?.createdAt
      //     ? new Date(userData.createdAt).toLocaleDateString()
      //     : "N/A",
      // ],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Field", "Value"]],
      body: profileData,
      margin: { left: margin },
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 40 },
        1: { cellWidth: "auto" },
      },
      theme: "grid",
    });
    yPos = doc.lastAutoTable.finalY + 10;

    // Investment Summary Section
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text("Investment Summary", margin, yPos);
    yPos += 10;

    const summaryData = [
      ["Total Earned Profit", `RS.${profitSummary.totalPaid.toLocaleString()}`],
      ["Pending Profit", `RS.${profitSummary.totalRemaining.toLocaleString()}`],
      ["Total Investments", profitSummary.totalOrders],
      ["Active Investments", profitSummary.activeOrders],
      ["Completed Investments", profitSummary.completedOrders],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Metric", "Value"]],
      body: summaryData,
      margin: { left: margin },
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: "auto" },
      },
      headStyles: { fillColor: [40, 53, 147] },
      theme: "grid",
    });
    yPos = doc.lastAutoTable.finalY + 15;

    // Trending Orders Section
    // doc.setFontSize(16);
    // doc.setTextColor(40, 53, 147);
    // doc.text("Trending Investment Opportunities", margin, yPos);
    // yPos += 10;

    // if (posts.length > 0) {
    //   const trendingData = posts.map((post) => [
    //     post.productName || "N/A",
    //     `RS.${post.fullAmount?.toLocaleString() || "0"}`,
    //     `RS.${post.expectedProfit?.toLocaleString() || "0"}`,
    //     post.timeLine || "N/A",
    //     post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A",
    //   ]);

    //   autoTable(doc, {
    //     startY: yPos,
    //     head: [["Product", "Amount", "Profit", "Timeline", "Posted"]],
    //     body: trendingData,
    //     margin: { left: margin },
    //     styles: { cellPadding: 3, fontSize: 8 },
    //     headStyles: { fillColor: [40, 53, 147] },
    //     alternateRowStyles: { fillColor: [240, 240, 240] },
    //     columnStyles: {
    //       0: { cellWidth: 40 },
    //       1: { cellWidth: 25 },
    //       2: { cellWidth: 25 },
    //       3: { cellWidth: 30 },
    //       4: { cellWidth: 30 },
    //     },
    //   });
    //   yPos = doc.lastAutoTable.finalY + 15;
    // } else {
    //   doc.setFontSize(10);
    //   doc.setTextColor(100, 100, 100);
    //   doc.text("No trending orders available", margin, yPos);
    //   yPos += 10;
    // }

    // My Investments Section
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text("My Investments", margin, yPos);
    yPos += 10;

    if (userOrders.length > 0) {
      const investmentData = userOrders.map((order) => [
        order.productName || "N/A",
        `RS.${order.originalFullAmount?.toLocaleString() || "0"}`,
        `RS.${order.originalExpectedProfit?.toLocaleString() || "0"}`,
        order.status.toUpperCase(),
        order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "N/A",
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Product", "Amount", "Profit", "Status", "Date"]],
        body: investmentData,
        margin: { left: margin },
        styles: { cellPadding: 3, fontSize: 8 },
        headStyles: { fillColor: [40, 53, 147] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
        },
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("No investments made yet", margin, yPos);
    }

    // Footer
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

    // Save the PDF
    doc.save(
      `Investment_Dashboard_${
        userData?.username || "user"
      }_${new Date().toLocaleDateString()}.pdf`
    );
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-5 rounded-lg text-center mb-5">
          <h2 className="text-2xl text-red-600">Error: {error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <div className="bg-blue-50 p-5 rounded-lg text-center mb-5 flex flex-col items-center">
        {/* Profile Image Container */}
        <div className="mb-3">
          {userData?.profileImage ? (
            <img
              src={`${baseUrl}/${userData.profileImage.replace(/\\/g, "/")}`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* <h2 className="text-2xl">
          Welcome {userData?.username || "Investor"}!
        </h2> */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl">
            Welcome {userData?.username || "Investor"}!
          </h2>
        </div>
        <p className="text-gray-600 mt-2"> {userData?.role || "User"}</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={generateDashboardPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FiFileText className="mr-2" /> Generate PDF Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiDollarSign className="mr-2" /> Investment Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">
              Total Earned Profit
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              RS.{profitSummary.totalPaid.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Profit
            </h3>
            <p className="text-2xl font-bold text-green-600">
              RS.{profitSummary.totalRemaining.toLocaleString()}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">
              Total Investments
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-purple-600">
                {profitSummary.totalOrders}
              </span>
              <div className="text-sm">
                <p>Active: {profitSummary.activeOrders}</p>
                <p>Completed: {profitSummary.completedOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Orders Section */}
      <div className="mb-10">
        <h3 className="text-center text-2xl font-bold mb-8 text-gray-800">
          TOP TRENDING ORDERS
        </h3>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((order) => (
              <PostItem key={order._id} order={order} onInvest={handleInvest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-5xl mb-4">📦</div>
            <h4 className="text-xl font-medium text-gray-600">
              No trending orders available
            </h4>
            <p className="text-gray-500 mt-2">
              Check back later for new investment opportunities
            </p>
          </div>
        )}
      </div>

      {/* My Investments Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <FiDollarSign className="mr-2" /> MY INVESTMENTS
        </h3>

        {userOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userOrders.map((order) => (
              <OrderSummary key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              You don't have any approved investments yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Your pending investments will appear here once approved
            </p>
          </div>
        )}
        {/* 
        {userOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userOrders.map((order) => (
              <OrderSummary key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              You haven't made any investments yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Invest in trending orders to see your summary here
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}

// PostItem component with timer
const PostItem = ({ order, onInvest }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expired, setExpired] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    if (!order.createdAt) return;

    // Calculate expiration time (48 hours from creation)
    const postCreationTime = new Date(order.createdAt).getTime();
    const expirationTime = postCreationTime + 48 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = expirationTime - now;

      if (difference <= 0) {
        setExpired(true);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  // Hide component if expired
  if (expired) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
      {order.image ? (
        <img
          src={`${baseUrl}/${order.image.replace(/\\/g, "/")}`}
          className="md:h-48 md:w-64 w-full object-cover rounded-lg"
          alt={order.productName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = item1;
          }}
        />
      ) : (
        <img
          src={item1}
          className="w-full h-full object-cover"
          alt="Default product"
        />
      )}

      <div className="p-5 flex-1">
        <h4 className="font-bold text-xl mb-2 text-gray-800">
          {order.productName}
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Full Amount:</span>
            <span className="font-medium">RS.{order.fullAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Unit Price:</span>
            <span className="font-medium">RS.{order.unitPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expected Profit:</span>
            <span className="font-medium text-green-600">
              RS.{order.expectedProfit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Line:</span>
            <span className="font-medium">{order.timeLine}</span>
          </div>
        </div>
      </div>

      <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
        ⏳ {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </div>
      <button
        onClick={() => onInvest(order)}
        className="md:w-64 w-full bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Invest Now
      </button>
    </div>
  );
};

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { FiDownload } from "react-icons/fi";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function AdminSummary() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
// const baseUrl = import.meta.env.VITE_API_BASE_URI ;
//   // Fetch orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `${baseUrl}/api/protected/admin/orders`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = await response.json();
//         setOrders(
//           data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         );
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Filter orders based on date range
//   const filteredOrders = orders.filter((order) => {
//     const orderDate = new Date(order.createdAt);
//     const start = startDate || new Date(0); // Beginning of time if no start date
//     const end = endDate || new Date(); // Current date if no end date
//     return orderDate >= start && orderDate <= end;
//   });

//   // Calculate statistics
//   const calculateStats = () => {
//     const pendingOrders = filteredOrders.filter(
//       (o) => o.status === "pending"
//     ).length;
//     const approvedOrders = filteredOrders.filter(
//       (o) => o.status === "approved"
//     ).length;
//     const rejectedOrders = filteredOrders.filter(
//       (o) => o.status === "rejected"
//     ).length;

//     const totalProfit = filteredOrders
//       .filter((o) => o.status === "approved")
//       .reduce((sum, order) => sum + (order.expectedProfit || 0), 0);

//     const totalAmount = filteredOrders.reduce(
//       (sum, order) => sum + (order.fullAmount || 0),
//       0
//     );

//     return {
//       totalOrders: filteredOrders.length,
//       pendingOrders,
//       approvedOrders,
//       rejectedOrders,
//       totalProfit,
//       totalAmount,
//     };
//   };

//   const stats = calculateStats();

//   // Prepare chart data
//   const prepareChartData = () => {
//     // Group orders by date
//     const ordersByDate = filteredOrders.reduce((acc, order) => {
//       const date = new Date(order.createdAt).toLocaleDateString();
//       if (!acc[date]) acc[date] = { pending: 0, approved: 0, rejected: 0 };

//       acc[date][order.status] += 1;
//       return acc;
//     }, {});

//     const dates = Object.keys(ordersByDate).sort();

//     return {
//       labels: dates,
//       datasets: [
//         {
//           label: "Pending Orders",
//           data: dates.map((date) => ordersByDate[date].pending),
//           backgroundColor: "rgba(255, 206, 86, 0.6)",
//         },
//         {
//           label: "Approved Orders",
//           data: dates.map((date) => ordersByDate[date].approved),
//           backgroundColor: "rgba(75, 192, 192, 0.6)",
//         },
//         {
//           label: "Rejected Orders",
//           data: dates.map((date) => ordersByDate[date].rejected),
//           backgroundColor: "rgba(255, 99, 132, 0.6)",
//         },
//       ],
//     };
//   };

//   const chartData = prepareChartData();

//   // Generate PDF report
//   const generatePDFReport = () => {
//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(18);
//     doc.text("Orders Summary Report", 15, 15);

//     // Date range
//     doc.setFontSize(10);
//     const dateRange = `Date Range: ${
//       startDate ? startDate.toLocaleDateString() : "All time"
//     } - ${endDate ? endDate.toLocaleDateString() : "Present"}`;
//     doc.text(dateRange, 15, 25);

//     // Summary stats table
//     autoTable(doc, {
//       startY: 30,
//       head: [["Metric", "Value"]],
//       body: [
//         ["Total Orders", stats.totalOrders],
//         ["Pending Orders", stats.pendingOrders],
//         ["Approved Orders", stats.approvedOrders],
//         ["Rejected Orders", stats.rejectedOrders],
//         ["Total Profit", `RS.${stats.totalProfit.toLocaleString()}`],
//         ["Total Amount", `RS.${stats.totalAmount.toLocaleString()}`],
//       ],
//       theme: "grid",
//       headStyles: { fillColor: [41, 128, 185] },
//     });

//     // Bar chart image (placeholder - in real implementation, convert canvas to image)
//     doc.text("Order Trends", 15, doc.lastAutoTable.finalY + 10);
//     doc.text(
//       "[Bar chart would appear here]",
//       15,
//       doc.lastAutoTable.finalY + 20
//     );

//     doc.save(`orders-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-gray-600">Loading summary data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold">Orders Summary</h1>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium">From:</label>
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//               className="border rounded p-1"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium">To:</label>
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//               minDate={startDate}
//               className="border rounded p-1"
//             />
//           </div>

//           <button
//             onClick={generatePDFReport}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
//           >
//             <FiDownload />
//             Export PDF
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow border">
//           <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
//           <p className="text-3xl font-bold text-blue-600">
//             {stats.totalOrders}
//           </p>
//           <p className="text-sm text-gray-500 mt-1">All time orders</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow border">
//           <h3 className="text-lg font-semibold mb-2">Total Profit</h3>
//           <p className="text-3xl font-bold text-green-600">
//             RS.{stats.totalProfit.toLocaleString()}
//           </p>
//           <p className="text-sm text-gray-500 mt-1">From approved orders</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow border">
//           <h3 className="text-lg font-semibold mb-2">Status Distribution</h3>
//           <div className="flex justify-between mt-3">
//             <div className="text-center">
//               <div className="text-xl font-bold text-yellow-600">
//                 {stats.pendingOrders}
//               </div>
//               <div className="text-sm text-gray-500">Pending</div>
//             </div>
//             <div className="text-center">
//               <div className="text-xl font-bold text-green-600">
//                 {stats.approvedOrders}
//               </div>
//               <div className="text-sm text-gray-500">Approved</div>
//             </div>
//             <div className="text-center">
//               <div className="text-xl font-bold text-red-600">
//                 {stats.rejectedOrders}
//               </div>
//               <div className="text-sm text-gray-500">Rejected</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bar Chart */}
//       <div className="bg-white p-6 rounded-lg shadow border mb-8">
//         <h2 className="text-xl font-semibold mb-4">Order Trends</h2>
//         <div className="h-80">
//           <Bar
//             data={chartData}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               scales: {
//                 x: {
//                   stacked: true,
//                 },
//                 y: {
//                   stacked: true,
//                   beginAtZero: true,
//                   ticks: {
//                     precision: 0,
//                   },
//                 },
//               },
//               plugins: {
//                 legend: {
//                   position: "top",
//                 },
//                 title: {
//                   display: true,
//                   text: "Orders by Status Over Time",
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       {/* Recent Orders Table */}
//       <div className="bg-white p-6 rounded-lg shadow border">
//         <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-3 px-4 text-left">Product</th>
//                 <th className="py-3 px-4 text-left">User</th>
//                 <th className="py-3 px-4 text-left">Amount</th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.slice(0, 5).map((order) => (
//                 <tr key={order._id} className="border-b hover:bg-gray-50">
//                   <td className="py-3 px-4">{order.productName}</td>
//                   <td className="py-3 px-4">{order.user?.username || "N/A"}</td>
//                   <td className="py-3 px-4">
//                     RS.{order.fullAmount?.toLocaleString()}
//                   </td>
//                   <td className="py-3 px-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs ${
//                         order.status === "approved"
//                           ? "bg-green-100 text-green-800"
//                           : order.status === "rejected"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {order.status.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-sm">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiDownload, FiCalendar, FiFilter, FiX, FiTrendingUp, FiDollarSign, FiPackage, FiCheckCircle, FiClock, FiXCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addLetterhead } from "../../utils/pdfHelper";
import logo from "../../assets/img/Logo.jpeg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminSummary() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${baseUrl}/api/protected/admin/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        setOrders(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const start = startDate || new Date(0);
    const end = endDate || new Date();
    return orderDate >= start && orderDate <= end;
  });

  // Calculate statistics
  const calculateStats = () => {
    const pendingOrders = filteredOrders.filter(
      (o) => o.status === "pending"
    ).length;
    const approvedOrders = filteredOrders.filter(
      (o) => o.status === "approved"
    ).length;
    const rejectedOrders = filteredOrders.filter(
      (o) => o.status === "rejected"
    ).length;

    const totalProfit = filteredOrders
      .filter((o) => o.status === "approved")
      .reduce((sum, order) => sum + (order.expectedProfit || 0), 0);

    const totalAmount = filteredOrders.reduce(
      (sum, order) => sum + (order.fullAmount || 0),
      0
    );

    return {
      totalOrders: filteredOrders.length,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      totalProfit,
      totalAmount,
    };
  };

  const stats = calculateStats();

  // Prepare chart data for different screen sizes
  const prepareChartData = () => {
    const ordersByDate = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      if (!acc[date]) acc[date] = { pending: 0, approved: 0, rejected: 0 };

      acc[date][order.status] += 1;
      return acc;
    }, {});

    const dates = Object.keys(ordersByDate).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    // For mobile, limit to 5 dates
    const limitedDates = window.innerWidth < 768
      ? dates.slice(-5)
      : window.innerWidth < 1024
        ? dates.slice(-8)
        : dates;

    return {
      labels: limitedDates,
      datasets: [
        {
          label: "Pending",
          data: limitedDates.map((date) => ordersByDate[date]?.pending || 0),
          backgroundColor: "rgba(255, 206, 86, 0.9)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Approved",
          data: limitedDates.map((date) => ordersByDate[date]?.approved || 0),
          backgroundColor: "rgba(75, 192, 192, 0.9)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Rejected",
          data: limitedDates.map((date) => ordersByDate[date]?.rejected || 0),
          backgroundColor: "rgba(255, 99, 132, 0.9)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  // Generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const margin = 15;

    // Use standard letterhead
    const startY = addLetterhead(doc, "Orders Summary Report", logo);
    let yPos = startY;

    // Date range info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateRange = `Date Range: ${startDate ? startDate.toLocaleDateString() : "All time"
      } - ${endDate ? endDate.toLocaleDateString() : "Present"}`;
    doc.text(dateRange, margin, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [["Metric", "Value"]],
      body: [
        ["Total Orders", stats.totalOrders],
        ["Pending Orders", stats.pendingOrders],
        ["Approved Orders", stats.approvedOrders],
        ["Rejected Orders", stats.rejectedOrders],
        ["Total Profit", `RS.${stats.totalProfit.toLocaleString()}`],
        ["Total Amount", `RS.${stats.totalAmount.toLocaleString()}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [40, 53, 147] },
      margin: { left: margin },
    });

    doc.save(`orders-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-600 text-center">Loading summary data...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5">
      {/* ===== MOBILE VIEW (0-767px) ===== */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">Orders Summary</h1>
          <p className="text-xs text-gray-600 mt-1">Manage and analyze your orders</p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            <FiFilter size={16} />
            {showMobileFilters ? "Hide Filters" : "Filters"}
          </button>
          <button
            onClick={generatePDFReport}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            <FiDownload size={16} />
            Export
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showMobileFilters && (
          <div className="mb-4 bg-white p-3 rounded-lg shadow border border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    placeholderText="From"
                    dateFormat="MM/dd"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    placeholderText="To"
                    dateFormat="MM/dd"
                  />
                </div>
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilters}
                  className="w-full text-xs text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Stats Summary */}
        <div className="mb-4">
          <button
            onClick={() => setShowMobileStats(!showMobileStats)}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" />
              <span className="font-medium text-gray-900">Quick Stats</span>
            </div>
            {showMobileStats ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {showMobileStats && (
            <div className="mt-2 space-y-2">
              {/* Total Orders */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiPackage className="text-blue-600" size={16} />
                  <span className="text-sm text-gray-700">Total Orders</span>
                </div>
                <span className="font-bold text-blue-700">{stats.totalOrders}</span>
              </div>

              {/* Total Profit */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-green-600" size={16} />
                  <span className="text-sm text-gray-700">Total Profit</span>
                </div>
                <span className="font-bold text-green-700">RS.{stats.totalProfit.toLocaleString()}</span>
              </div>

              {/* Status Distribution */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Status Distribution</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Pending</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Approved</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.approvedOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Rejected</span>
                    </div>
                    <span className="font-medium text-gray-900">{stats.rejectedOrders}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Chart */}
        <div className="mb-4 bg-white p-3 rounded-lg shadow border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Order Trends</h3>
          <div className="h-48">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                    ticks: {
                      maxRotation: 90,
                      minRotation: 90,
                      font: {
                        size: 8
                      }
                    },
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                      font: {
                        size: 8
                      }
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      boxWidth: 8,
                      padding: 8,
                      font: {
                        size: 8
                      }
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Orders - Mobile Card View */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredOrders.slice(0, 3).map((order) => (
              <div key={order._id} className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {order.productName}
                    </h4>
                    <p className="text-xs text-gray-600">{order.user?.username || "N/A"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${order.status === "approved" ? "bg-green-100 text-green-800" :
                      order.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                    }`}>
                    {order.status.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 text-sm">
                    RS.{order.fullAmount?.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {filteredOrders.length > 3 && (
            <div className="p-3 text-center border-t border-gray-200">
              <button className="text-blue-600 text-sm font-medium">
                View all {filteredOrders.length} orders
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== TABLET VIEW (768px - 1023px) ===== */}
      <div className="hidden lg:hidden md:block">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Summary</h1>
              <p className="text-gray-600 mt-1">Overview and analytics dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={generatePDFReport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FiDownload />
                Export PDF
              </button>
            </div>
          </div>

          {/* Date Filters - Tablet */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Date Range</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholderText="Start date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholderText="End date"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards - Tablet (2x2) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Total Orders */}
            <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiPackage className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Orders</h3>
                  <p className="text-sm text-gray-500">All orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>

            {/* Total Profit */}
            <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Profit</h3>
                  <p className="text-sm text-gray-500">Approved orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">RS.{stats.totalProfit.toLocaleString()}</p>
            </div>

            {/* Status Distribution */}
            <div className="col-span-2 bg-white p-5 rounded-xl shadow border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Status Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <FiClock className="text-yellow-600 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <FiCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">{stats.approvedOrders}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <FiXCircle className="text-red-600 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-700">{stats.rejectedOrders}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart - Tablet */}
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Trends</h3>
            <div className="h-64">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: { size: 10 }
                      },
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                        font: { size: 10 }
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 10,
                        padding: 12,
                        font: { size: 11 }
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Recent Orders - Tablet */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500 mt-1">{filteredOrders.length} orders total</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {order.productName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.user?.username || "N/A"}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-semibold text-gray-900">
                          RS.{order.fullAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === "approved" ? "bg-green-100 text-green-800" :
                            order.status === "rejected" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP VIEW (1024px+) ===== */}
      <div className="hidden lg:block">
        <div className="mb-8">
          {/* Header with Controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Summary Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive overview of order analytics and statistics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">From:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
                    placeholderText="Start date"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">To:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
                    placeholderText="End date"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={clearDateFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              <button
                onClick={generatePDFReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                <FiDownload />
                Export PDF Report
              </button>
            </div>
          </div>

          {/* Stats Grid - Desktop */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiPackage className="text-blue-600 text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                  <div className="text-sm text-gray-500">Total Orders</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Filtered: {filteredOrders.length} orders</div>
            </div>

            {/* Total Profit */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <FiDollarSign className="text-green-600 text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">RS.{stats.totalProfit.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Profit</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">From {stats.approvedOrders} approved orders</div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <FiClock className="text-yellow-600 text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.pendingOrders / Math.max(stats.totalOrders, 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Approved vs Rejected */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.approvedOrders}</div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejectedOrders}</div>
                  <div className="text-sm text-gray-500">Rejected</div>
                </div>
              </div>
              <div className="flex gap-1">
                <div
                  className="h-2 bg-green-500 rounded-l-full"
                  style={{ width: `${(stats.approvedOrders / Math.max(stats.totalOrders, 1)) * 100}%` }}
                ></div>
                <div
                  className="h-2 bg-red-500 rounded-r-full"
                  style={{ width: `${(stats.rejectedOrders / Math.max(stats.totalOrders, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Chart and Recent Orders Side by Side - Desktop */}
          <div className="grid grid-cols-3 gap-6">
            {/* Chart - Takes 2 columns */}
            <div className="col-span-2 bg-white p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Trends Over Time</h3>
              <div className="h-80">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        stacked: true,
                        ticks: {
                          font: { size: 12 }
                        },
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          font: { size: 12 }
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: { size: 12 },
                          padding: 20
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Recent Orders - Takes 1 column */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-500 mt-1">Latest 5 orders</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.productName}</h4>
                        <p className="text-sm text-gray-600">{order.user?.username || "N/A"}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "approved" ? "bg-green-100 text-green-800" :
                          order.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                        }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        RS.{order.fullAmount?.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {filteredOrders.length > 5 && (
                <div className="p-4 border-t border-gray-200 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View all {filteredOrders.length} orders →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Total Amount Summary - Desktop */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Amount Processed</h3>
                <p className="text-gray-600">Combined value of all orders in selected period</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">RS.{stats.totalAmount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Across {filteredOrders.length} orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer - All Views */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Data as of {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
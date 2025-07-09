
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
import { FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
const baseUrl = import.meta.env.VITE_API_BASE_URI ;
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
    const start = startDate || new Date(0); // Beginning of time if no start date
    const end = endDate || new Date(); // Current date if no end date
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

  // Prepare chart data
  const prepareChartData = () => {
    // Group orders by date
    const ordersByDate = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { pending: 0, approved: 0, rejected: 0 };

      acc[date][order.status] += 1;
      return acc;
    }, {});

    const dates = Object.keys(ordersByDate).sort();

    return {
      labels: dates,
      datasets: [
        {
          label: "Pending Orders",
          data: dates.map((date) => ordersByDate[date].pending),
          backgroundColor: "rgba(255, 206, 86, 0.6)",
        },
        {
          label: "Approved Orders",
          data: dates.map((date) => ordersByDate[date].approved),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Rejected Orders",
          data: dates.map((date) => ordersByDate[date].rejected),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  const chartData = prepareChartData();

  // Generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Orders Summary Report", 15, 15);

    // Date range
    doc.setFontSize(10);
    const dateRange = `Date Range: ${
      startDate ? startDate.toLocaleDateString() : "All time"
    } - ${endDate ? endDate.toLocaleDateString() : "Present"}`;
    doc.text(dateRange, 15, 25);

    // Summary stats table
    autoTable(doc, {
      startY: 30,
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
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Bar chart image (placeholder - in real implementation, convert canvas to image)
    doc.text("Order Trends", 15, doc.lastAutoTable.finalY + 10);
    doc.text(
      "[Bar chart would appear here]",
      15,
      doc.lastAutoTable.finalY + 20
    );

    doc.save(`orders-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading summary data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Orders Summary</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border rounded p-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="border rounded p-1"
            />
          </div>

          <button
            onClick={generatePDFReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <FiDownload />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalOrders}
          </p>
          <p className="text-sm text-gray-500 mt-1">All time orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-green-600">
            RS.{stats.totalProfit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">From approved orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Status Distribution</h3>
          <div className="flex justify-between mt-3">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {stats.approvedOrders}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {stats.rejectedOrders}
              </div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow border mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Trends</h2>
        <div className="h-80">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Orders by Status Over Time",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order.productName}</td>
                  <td className="py-3 px-4">{order.user?.username || "N/A"}</td>
                  <td className="py-3 px-4">
                    RS.{order.fullAmount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
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
                  <td className="py-3 px-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

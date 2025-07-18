import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}/api/protected/user/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let yPos = 20;

    // Add title and date
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147); // Dark blue
    doc.text("My Orders Report", pageWidth / 2, yPos, {
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
    yPos += 15;

    // Add a horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Orders table
    if (orders.length > 0) {
      const ordersData = orders.map((order) => [
        order.productName || "N/A",
        `RS.${order.originalFullAmount?.toLocaleString() || "0"}`,
        `RS.${order.unitPrice?.toLocaleString() || "0"}`,
        `RS.${order.originalExpectedProfit?.toLocaleString() || "0"}`,
        order.status.toUpperCase(),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [
          ["Product", "Amount", "Unit Price", "Expected Profit", "Status"],
        ],
        body: ordersData,
        margin: { left: margin },
        styles: { cellPadding: 3, fontSize: 10 },
        headStyles: { fillColor: [40, 53, 147] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 30 },
        },
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("No orders found", pageWidth / 2, yPos, { align: "center" });
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
    doc.save(`My_Orders_${new Date().toLocaleDateString()}.pdf`);
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container max-w-7xl min-h-screen mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <button
          onClick={generatePDF}
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
          Generate PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Unit Price</th>
              <th className="py-2 px-4 border">Expected Profit</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border">{order.productName}</td>
                <td className="py-2 px-4 border">
                  RS.{order.originalFullAmount}
                </td>
                <td className="py-2 px-4 border">RS.{order.unitPrice}</td>
                <td className="py-2 px-4 border">
                  RS.{order.originalExpectedProfit}
                </td>
                <td
                  className={`py-2 px-4 border ${
                    order.status === "approved"
                      ? "text-green-600"
                      : order.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrders;

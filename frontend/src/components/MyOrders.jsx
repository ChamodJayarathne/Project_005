import React, { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
     const baseUrl = import.meta.env.VITE_API_BASE_URI ;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${baseUrl}/api/protected/user/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Expected Profit</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border">{order.productName}</td>
                <td className="py-2 px-4 border">RS.{order.fullAmount}</td>
                <td className="py-2 px-4 border">RS.{order.expectedProfit}</td>
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


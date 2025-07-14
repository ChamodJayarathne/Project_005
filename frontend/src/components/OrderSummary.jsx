/* eslint-disable no-unused-vars */
// src/components/OrderSummary.js
import React from "react";
import { FiDollarSign, FiClock, FiPackage } from "react-icons/fi";

const OrderSummary = ({ order }) => {
  const totalPaid = 
    (order.originalFullAmount - order.fullAmount) +
    (order.originalExpectedProfit - order.expectedProfit);

    // const totalProfit = order.originalExpectedProfit - order.expectedProfit;
  
    const totalExpectedFullAmount = order.originalFullAmount + (order.expectedProfit || order.originalExpectedProfit)
  const totalOriginal = 
    order.originalFullAmount + order.originalExpectedProfit;
  
  const progress = Math.round((totalPaid / totalOriginal) * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold flex items-center">
            <FiPackage className="mr-2" /> {order.productName}
          </h3>
          <p className="text-sm text-gray-500">
            Order ID: {order._id.substring(18, 24).toUpperCase()}
          </p>
            <p className="text-sm text-black">
            Total Expected Full Amount: RS. {totalExpectedFullAmount.toLocaleString()}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          order.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : order.status === 'pending' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
        }`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Full Amount</p>
          <div className="flex justify-between">
            <span>RS.{order.fullAmount.toLocaleString()}</span>
            <span className="text-green-600">
              +RS.{(order.originalFullAmount - order.fullAmount).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500">Expected Profit</p>
          <div className="flex justify-between">
            <span>RS.{order.expectedProfit.toLocaleString()}</span>
            <span className="text-green-600">
              +RS.{(order.originalExpectedProfit - order.expectedProfit).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Total Paid: RS.{totalPaid.toLocaleString()}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-2 flex items-center text-sm text-gray-500">
        <FiClock className="mr-1" />
        Updated: {new Date(order.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default OrderSummary;
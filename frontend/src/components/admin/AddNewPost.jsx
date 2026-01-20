// /* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FiUpload } from "react-icons/fi";
// import { useEffect } from "react";

// export default function AddNewPost() {
//   const [formData, setFormData] = useState({
//     productName: "",
//     unitPrice: "",
//     cuantity:"",
//     fullAmount: "",
//     expectedProfit: "",
//     timeLine: "",
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       const token = localStorage.getItem("token");
//       const data = new FormData();

//       // Append form data
//       Object.entries(formData).forEach(([key, value]) => {
//         data.append(key, value);
//       });

//       // Append file if selected
//       if (selectedFile) {
//         data.append("image", selectedFile);
//       }

//       const response = await axios.post(
//         `${baseUrl}/api/protected/posts`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setMessage({
//         text: "Post created successfully and shared with users!",
//         type: "success",
//       });

//       // Reset form
//       setFormData({
//         productName: "",
//         fullAmount: "",
//         unitPrice: "",
//         expectedProfit: "",
//         timeLine: "",
//       });
//       setSelectedFile(null);

//       // Redirect to posts list after 2 seconds
//       setTimeout(() => navigate("/admin/orders"), 2000);
//     } catch (error) {
//       setMessage({
//         text: error.response?.data?.msg || "Failed to create post",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold text-center mb-10">ADD NEW ORDER</h1>

//       {message.text && (
//         <div
//           className={`mb-6 p-4 rounded-lg ${
//             message.type === "success"
//               ? "bg-green-100 text-green-700 border border-green-200"
//               : "bg-red-100 text-red-700 border border-red-200"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-[#f8f9fa] p-8 rounded-lg shadow-md"
//       >
//         <div className="space-y-6 max-w-2xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <label
//               htmlFor="productName"
//               className="text-md font-medium text-gray-700"
//             >
//               Product Name
//             </label>
//             <input
//               type="text"
//               id="productName"
//               name="productName"
//               value={formData.productName}
//               onChange={handleInputChange}
//               className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <label
//               htmlFor="fullAmount"
//               className="text-md font-medium text-gray-700"
//             >
//               Full Amount ($)
//             </label>
//             <input
//               type="number"
//               id="fullAmount"
//               name="fullAmount"
//               value={formData.fullAmount}
//               onChange={handleInputChange}
//               className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <label
//               htmlFor="unitPrice"
//               className="text-md font-medium text-gray-700"
//             >
//               Unit Price ($)
//             </label>
//             <input
//               type="number"
//               id="unitPrice"
//               name="unitPrice"
//               value={formData.unitPrice}
//               onChange={handleInputChange}
//               className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <label
//               htmlFor="expectedProfit"
//               className="text-md font-medium text-gray-700"
//             >
//               Expected Profit ($)
//             </label>
//             <input
//               type="number"
//               id="expectedProfit"
//               name="expectedProfit"
//               value={formData.expectedProfit}
//               onChange={handleInputChange}
//               className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <label className="text-md font-medium text-gray-700">
//               Product Image
//             </label>
//             <div className="md:col-span-2 flex items-center">
//               <input
//                 type="text"
//                 className="flex-1 p-3 border border-gray-300 rounded-l-md bg-white"
//                 readOnly
//                 value={selectedFile ? selectedFile.name : "No file chosen"}
//                 placeholder="Select an image"
//               />
//               <label className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-md cursor-pointer flex items-center">
//                 <FiUpload className="mr-2" />
//                 Browse
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileChange}
//                   accept="image/*"
//                 />
//               </label>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <label
//               htmlFor="timeLine"
//               className="text-md font-medium text-gray-700"
//             >
//               Time Line
//             </label>
//             <input
//               type="text"
//               id="timeLine"
//               name="timeLine"
//               value={formData.timeLine}
//               onChange={handleInputChange}
//               className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               placeholder="e.g., 2-3 weeks"
//             />
//           </div>

//           <div className="flex justify-end mt-8">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md flex items-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 "CREATE POST"
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }


/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

export default function AddNewPost() {
  const [formData, setFormData] = useState({
    productName: "",
    unitPrice: "",
    quantity: "",
    fullAmount: "",
    sellingUnitPrice:"",
    expectedProfit: "",
    timeLine: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  // Auto-calculate fullAmount when unitPrice or quantity changes
  useEffect(() => {
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    const calculatedAmount = unitPrice * quantity;
    
    setFormData(prev => ({
      ...prev,
      fullAmount: calculatedAmount > 0 ? calculatedAmount.toFixed(2) : ""
    }));
  }, [formData.unitPrice, formData.quantity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For unitPrice and quantity, remove non-numeric characters except decimal point for unitPrice
    let processedValue = value;
    if (name === 'unitPrice') {
      processedValue = value.replace(/[^\d.]/g, '');
      // Ensure only one decimal point
      const decimalCount = (processedValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        const parts = processedValue.split('.');
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else if (name === 'quantity') {
      processedValue = value.replace(/\D/g, '');
    }
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: processedValue 
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setMessage({ text: "Please enter a valid unit price", type: "error" });
      return;
    }
    
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setMessage({ text: "Please enter a valid quantity", type: "error" });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append file if selected
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const response = await axios.post(
        `${baseUrl}/api/protected/posts`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({
        text: "Post created successfully and shared with users!",
        type: "success",
      });

      // Reset form
      setFormData({
        productName: "",
        unitPrice: "",
        quantity: "",
        fullAmount: "",
        sellingUnitPrice:"",
        expectedProfit: "",
        timeLine: "",
      });
      setSelectedFile(null);

      // Redirect to posts list after 2 seconds
      setTimeout(() => navigate("/admin/orders"), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.msg || "Failed to create post",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-10">ADD NEW ORDER</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#f8f9fa] p-8 rounded-lg shadow-md"
      >
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="productName"
              className="text-md font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="unitPrice"
              className="text-md font-medium text-gray-700"
            >
              Unit Price ($)
            </label>
            <input
              type="text"
              id="unitPrice"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., 19.99"
            />
          </div>
{/* 
          sellingUnitPrice */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="quantity"
              className="text-md font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., 100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="fullAmount"
              className="text-md font-medium text-gray-700"
            >
              Full Amount ($)
            </label>
            <input
              type="text"
              id="fullAmount"
              name="fullAmount"
              value={formData.fullAmount}
              readOnly
              className="md:col-span-2 p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="md:col-span-3 text-sm text-gray-500">
{/*          
              <p className="font-semibold">
                {formData.unitPrice || "0"} × {formData.quantity || "0"} = ${formData.fullAmount || "0.00"}
              </p> */}
            </div>
          </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="sellingUnitPrice"
              className="text-md font-medium text-gray-700"
            >
              Selling Unit Price ($)
            </label>
            <input
              type="text"
              id="sellingUnitPrice"
              name="sellingUnitPrice"
              value={formData.sellingUnitPrice}
              onChange={handleInputChange}
              className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., 19.99"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="expectedProfit"
              className="text-md font-medium text-gray-700"
            >
              Expected Profit ($)
            </label>
            <input
              type="number"
              id="expectedProfit"
              name="expectedProfit"
              value={formData.expectedProfit}
              onChange={handleInputChange}
              className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-md font-medium text-gray-700">
              Product Image
            </label>
            <div className="md:col-span-2 flex items-center">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-l-md bg-white"
                readOnly
                value={selectedFile ? selectedFile.name : "No file chosen"}
                placeholder="Select an image"
              />
              <label className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-md cursor-pointer flex items-center">
                <FiUpload className="mr-2" />
                Browse
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="timeLine"
              className="text-md font-medium text-gray-700"
            >
              Time Line
            </label>
            <input
              type="text"
              id="timeLine"
              name="timeLine"
              value={formData.timeLine}
              onChange={handleInputChange}
              className="md:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., 2-3 weeks"
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "CREATE POST"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
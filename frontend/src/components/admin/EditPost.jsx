// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FiArrowLeft, FiSave } from "react-icons/fi";

// const EditPost = () => {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState({
//     productName: "",
//     fullAmount: "",
//     unitPrice: "",
//     expectedProfit: "",
//     timeLine: "",
//     description: "",
//     status: "active",
//   });
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const baseUrl = import.meta.env.VITE_API_BASE_URI;

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${baseUrl}/api/protected/posts/${postId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setPost(response.data);

//         // if (response.data.image) {
//         //   setPreview(`${baseUrl}/${response.data.image}`);
//         // }
//          if (response.data.image) {
//         // Check if the image URL is already complete (contains http:// or https://)
//         const isFullUrl = response.data.image.startsWith('http');
//         setPreview(isFullUrl ? response.data.image : `${baseUrl}/${response.data.image}`);
//       }
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch post");
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [postId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPost((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImage(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("productName", post.productName);
//       formData.append("fullAmount", post.fullAmount);
//       formData.append("unitPrice", post.unitPrice);
//       formData.append("expectedProfit", post.expectedProfit);
//       formData.append("timeLine", post.timeLine);
//       formData.append("description", post.description);
//       formData.append("status", post.status);
//       if (image) {
//         formData.append("image", image);
//       }

//       await axios.put(`${baseUrl}/api/protected/posts/${postId}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Post updated successfully");
//       navigate(`/admin/posts/${postId}`);
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to update post");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
//       >
//         <FiArrowLeft className="mr-2" /> Back
//       </button>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-lg shadow-md p-6"
//       >
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-gray-700 mb-2">Product Name</label>
//             <input
//               type="text"
//               name="productName"
//               value={post.productName}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Full Amount (RS)</label>
//             <input
//               type="number"
//               name="fullAmount"
//               value={post.fullAmount}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Unit Price (RS)</label>
//             <input
//               type="number"
//               name="unitPrice"
//               value={post.unitPrice}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">
//               Expected Profit (RS)
//             </label>
//             <input
//               type="number"
//               name="expectedProfit"
//               value={post.expectedProfit}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Time Line</label>
//             <input
//               type="text"
//               name="timeLine"
//               value={post.timeLine}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 mb-2">Status</label>
//             <select
//               name="status"
//               value={post.status}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="active">Active</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2">Description</label>
//           <textarea
//             name="description"
//             value={post.description}
//             onChange={handleChange}
//             rows="4"
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           ></textarea>
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2">Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full"
//           />
//           {preview && (
//             <div className="mt-4">
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="max-w-xs rounded-md shadow"
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex space-x-4">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center"
//           >
//             <FiSave className="mr-2" /> Save Changes
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate(`/admin/posts/${postId}`)}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditPost;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    productName: "",
    fullAmount: "",
    unitPrice: "",
    quantity: "",
    sellingUnitPrice: "",
    expectedProfit: "",
    timeLine: "",
    description: "",
    status: "active",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URI;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/protected/posts/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPost({
          productName: response.data.productName || "",
          fullAmount: response.data.fullAmount || "",
          unitPrice: response.data.unitPrice || "",
          quantity: response.data.quantity || "",
          sellingUnitPrice: response.data.sellingUnitPrice || "",
          expectedProfit: response.data.expectedProfit || "",
          timeLine: response.data.timeLine || "",
          description: response.data.description || "",
          status: response.data.status || "active",
        });

        if (response.data.image) {
          const isFullUrl = response.data.image.startsWith('http');
          setPreview(isFullUrl ? response.data.image : `${baseUrl}/${response.data.image}`);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-calculate full amount when unitPrice or quantity changes
  useEffect(() => {
    if (post.unitPrice && post.quantity) {
      setCalculating(true);
      const unitPriceNum = parseFloat(post.unitPrice) || 0;
      const quantityNum = parseInt(post.quantity) || 0;
      const fullAmount = unitPriceNum * quantityNum;
      
      setTimeout(() => {
        setPost((prev) => ({ 
          ...prev, 
          fullAmount: isNaN(fullAmount) ? "" : fullAmount.toString() 
        }));
        setCalculating(false);
      }, 300);
    }
  }, [post.unitPrice, post.quantity]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Add all post fields
      formData.append("productName", post.productName);
      formData.append("fullAmount", post.fullAmount);
      formData.append("unitPrice", post.unitPrice);
      formData.append("quantity", post.quantity);
      formData.append("sellingUnitPrice", post.sellingUnitPrice);
      formData.append("expectedProfit", post.expectedProfit);
      formData.append("timeLine", post.timeLine);
      formData.append("description", post.description);
      formData.append("status", post.status);
      
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`${baseUrl}/api/protected/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post updated successfully");
      navigate(`/admin/posts/${postId}`);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.msg || "Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={post.productName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Unit Price (RS) *</label>
            <input
              type="number"
              name="unitPrice"
              value={post.unitPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={post.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-2">Full Amount (RS) *</label>
            <input
              type="number"
              name="fullAmount"
              value={post.fullAmount}
              readOnly
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                calculating ? 'bg-gray-100' : 'bg-gray-50'
              }`}
              required
            />
            {calculating && (
              <div className="absolute right-3 top-10">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Auto-calculated: (Unit Price × Quantity)
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Selling Unit Price (RS) *</label>
            <input
              type="number"
              name="sellingUnitPrice"
              value={post.sellingUnitPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Price at which each unit will be sold
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Expected Profit (RS) *
            </label>
            <input
              type="number"
              name="expectedProfit"
              value={post.expectedProfit}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculated as: (Selling Price - Unit Price) × Quantity
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Time Line *</label>
            <input
              type="text"
              name="timeLine"
              value={post.timeLine}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 30 days, 2 months"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={post.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add product description, features, or additional details..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs rounded-md shadow"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Current image will be replaced if you upload a new one
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Investment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Investment:</p>
              <p className="font-semibold">RS {parseFloat(post.fullAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Unit Price:</p>
              <p className="font-semibold">RS {parseFloat(post.unitPrice || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Quantity:</p>
              <p className="font-semibold">{post.quantity || 0} units</p>
            </div>
            <div>
              <p className="text-gray-600">Expected ROI:</p>
              <p className="font-semibold text-green-600">
                RS {parseFloat(post.expectedProfit || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center"
          >
            <FiSave className="mr-2" /> Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/posts/${postId}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="border border-gray-400 text-gray-600 px-6 py-2 rounded hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Required fields
        </p>
      </form>
    </div>
  );
};

export default EditPost;
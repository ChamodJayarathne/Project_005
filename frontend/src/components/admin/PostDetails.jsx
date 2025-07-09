import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCalendar,
  FiUser,
  FiEdit,
} from "react-icons/fi";

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URI ;

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
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };


    fetchPost();
  }, [postId]);

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

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.image && (
          <div className="h-80 flex justify-center overflow-hidden">
            <img
              src={`${baseUrl}/${post.image}`}
              alt={post.productName}
              className="w-full md:w-80 h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {post.productName}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                post.status === "active"
                  ? "bg-green-100 text-green-800"
                  : post.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FiDollarSign className="text-gray-500 mr-2" />
              <span className="font-medium">Full Amount:</span>
              <span className="ml-2">
                RS.{post.fullAmount?.toLocaleString()}
              </span>
            </div>
     
            <div className="flex items-center">
              <FiTrendingUp className="text-gray-500 mr-2" />
              <span className="font-medium">Expected Profit:</span>
              <span className="ml-2">
                RS.{post.expectedProfit?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center">
              <FiClock className="text-gray-500 mr-2" />
              <span className="font-medium">Time Line:</span>
              <span className="ml-2">{post.timeLine}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="text-gray-500 mr-2" />
              <span className="font-medium">Created At:</span>
              <span className="ml-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <FiUser className="text-gray-500 mr-2" />
              <span className="font-medium">Created By:</span>
              <span className="ml-2">
                {post.createdBy?.username || "Admin"}
              </span>
            </div>
          </div>

          <p className="text-gray-700">{post.description}</p>

          <div className="mt-8">
            <button
              onClick={() => navigate(`/admin/posts/edit/${post._id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            >
              <FiEdit className="mr-2" /> Edit Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

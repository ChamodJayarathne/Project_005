

import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";
import item1 from "../assets/img/Item.jpg";
import { FiDollarSign } from "react-icons/fi";

function Dashboard({ user, onLogout }) {
  const [userData, setUserData] = useState(user);
  const [userOrders, setUserOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const baseUrl = import.meta.env.VITE_API_BASE_URI;

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
    // const fetchData = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     if (!token) return;

    //     // Fetch available posts
    //     const postsResponse = await axios.get(
    //       "http://localhost:5000/api/protected/posts/available",
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );

    //     // Filter out expired posts (older than 48 hours)
    //     const filteredPosts = postsResponse.data.filter((post) => {
    //       const postTime = new Date(post.createdAt).getTime();
    //       const currentTime = new Date().getTime();
    //       return currentTime - postTime < 48 * 60 * 60 * 1000;
    //     });

    //     setPosts(filteredPosts);

    //     // Fetch user orders
    //     const ordersResponse = await axios.get(
    //       "http://localhost:5000/api/protected/user/orders",
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );
    //     setUserOrders(ordersResponse.data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

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
        const filteredPosts = postsResponse.data.filter(post => {
          const postTime = new Date(post.createdAt);
          const isExpired = (now - postTime) > 168 * 60 * 60 * 1000;
          return !isExpired;
        });

        setPosts(filteredPosts);
      

        // Fetch user orders
        const ordersResponse = await axios.get(
          `${baseUrl}/api/protected/user/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserOrders(ordersResponse.data);
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
              src={`${baseUrl}/${userData.profileImage.replace(
                /\\/g,
                "/"
              )}`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>

        <h2 className="text-2xl">
          Welcome {userData?.username || "Investor"}!
        </h2>
        <p className="text-gray-600 mt-2"> {userData?.role || "User"}</p>
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
              You haven't made any investments yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Invest in trending orders to see your summary here
            </p>
          </div>
        )}
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

    const baseUrl = import.meta.env.VITE_API_BASE_URI ;

  useEffect(() => {
    if (!order.createdAt) return;

    // Calculate expiration time (48 hours from creation)
    const postCreationTime = new Date(order.createdAt).getTime();
    const expirationTime = postCreationTime + 168 * 60 * 60 * 1000;

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

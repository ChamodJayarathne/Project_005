const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const cron = require("node-cron");
const orderController = require("./controllers/orderController");

const app = express();

app.use(cors());

app.use(
  cors({

    origin: process.env.FRONTEND_BASE_URL,
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

cron.schedule("0 * * * *", () => {
  orderController.cleanExpiredOrders();
});

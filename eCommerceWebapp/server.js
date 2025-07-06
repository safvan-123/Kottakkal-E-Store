import express from "express";
const app = express();
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import offerproductsRoute from "./routes/offerproductsRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import pincodeRoutes from "./routes/pincodeRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import { sendWhatsappMessage } from "./whatsapp-reset-message/sendWhatsappMessage.js";

dotenv.config();

// //databse configuring
connectDB();

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://kottakkal-e-store.vercel.app",
  "https://kottakkal-e-store-admin.vercel.app", // your Vercel frontend (if deployed)
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// ✅ Fix for Payload Too Large (up to 10MB)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/Category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/user", authRoutes);
app.use("/api/offer-products", offerproductsRoute);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/orders", adminOrderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/pincode", pincodeRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/v1/address", addressRoutes);

//rest api

app.get("/", (req, res) => {
  console.log("GET / route hit");
  res.send("welcome ");
});
// const phone = "919876543210"; // ✅ your test phone number (no +, no space)
// const message = "🔐 Reset your password: https://yourapp.com/reset/abc123";

// sendWhatsappMessage(phone, message);
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

// https://kottakkal-e-store.onrender.com

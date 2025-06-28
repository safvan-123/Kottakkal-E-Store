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

dotenv.config();

// //databse configuring
connectDB();

// //middleware
//{ origin: "http://localhost:5173", credentials: true }
// app.use(cors());
// app.use(
//   cors({
//     origin: ["https://kottakkal-e-store.vercel.app"], // allow your frontend
//     credentials: true, // if using cookies or auth
//   })
// );
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
// app.options("*", cors());
app.use(express.json());
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
app.use("/api/v1/address", addressRoutes);

//rest api

app.get("/", (req, res) => {
  console.log("GET / route hit");
  res.send("welcome ");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

// https://kottakkal-e-store.onrender.com

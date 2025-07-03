import express from "express";
import {
  createRazorpayOrder,
  getSingleOrder,
  getUserOrders,
  placeOrder,
} from "../controller/orderController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/razorpay-order", createRazorpayOrder);

router.post("/place", requireSignIn, placeOrder);

router.get("/my-orders", requireSignIn, getUserOrders);
router.get("/myorders/:id", requireSignIn, getSingleOrder);

export default router;

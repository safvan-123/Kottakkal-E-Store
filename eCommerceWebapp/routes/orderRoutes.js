import express from "express";
import {
  createRazorpayOrder,
  deleteUserOrder,
  getSingleOrder,
  getUserOrders,
  handleProductReturn,
  placeOrder,
} from "../controller/orderController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/razorpay-order", createRazorpayOrder);

router.post("/place", requireSignIn, placeOrder);

router.get("/my-orders", requireSignIn, getUserOrders);
router.get("/my-orders/:id", requireSignIn, getSingleOrder);
router.delete("/my-orders/:id", requireSignIn, deleteUserOrder);

router.post("/return", requireSignIn, handleProductReturn);

export default router;

import express from "express";
import {
  getAllOrders,
  getAllReturnRequests,
  updateOrderStatus,
} from "../controller/adminOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);

router.put("/:id", updateOrderStatus);

router.get("/allreturns", getAllReturnRequests);

export default router;

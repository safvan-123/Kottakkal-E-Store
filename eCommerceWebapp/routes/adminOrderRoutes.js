import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getAllOrders,
  getAllReturnRequests,
  updateOrderStatus,
  updateReturnDeliveryStatus,
} from "../controller/adminOrderController.js";

const router = express.Router();

router.get("/", getAllOrders);

router.put("/:id", updateOrderStatus);

router.get("/allreturns", getAllReturnRequests);
router.put("/return-status/:orderId/:productId", updateReturnDeliveryStatus);

export default router;

import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationRead,
} from "../controller/orderController.js";

const router = express.Router();

router.get("/", requireSignIn, getUserNotifications);
router.put("/:id", requireSignIn, markNotificationRead);

export default router;

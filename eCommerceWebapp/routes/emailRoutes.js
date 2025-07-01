// routes/emailRoutes.js
import express from "express";
import { sendOrderConfirmationEmail } from "../controller/emailController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", requireSignIn, sendOrderConfirmationEmail);

export default router;

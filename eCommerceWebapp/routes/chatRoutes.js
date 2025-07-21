import express from "express";
import { handleChat } from "../controller/chatController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/chat", requireSignIn, handleChat);

export default router;

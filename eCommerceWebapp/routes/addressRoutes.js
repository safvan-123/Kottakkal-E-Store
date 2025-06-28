import express from "express";
import {
  getAddress,
  saveOrUpdateAddress,
} from "../controller/addressController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/update", requireSignIn, saveOrUpdateAddress);
router.get("/", requireSignIn, getAddress);

export default router;

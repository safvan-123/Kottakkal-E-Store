import express from "express";
import {
  addMasterCategory,
  deleteMasterCategory,
  getAllMasterCategories,
  getSingleMasterCategory,
  updateMasterCategory,
} from "../controller/masterCategoryController.js";

const router = express.Router();

router.post("/add", addMasterCategory);
router.get("/", getAllMasterCategories);
router.get("/:id", getSingleMasterCategory);
router.put("/:id", updateMasterCategory);
router.delete("/:id", deleteMasterCategory);

export default router;

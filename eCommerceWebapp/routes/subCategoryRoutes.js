import express from "express";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
} from "../controller/subCategoryController.js";

const router = express.Router();

router.post("/add", addSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", getSingleSubCategory);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;

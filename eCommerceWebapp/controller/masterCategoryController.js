import { MasterCategory } from "../models/masterCategory.js";

export const addMasterCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const existing = await MasterCategory.findOne({ name });

    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await MasterCategory.create({ name, image });
    res.status(201).json({ message: "Category added", category });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all categories
export const getAllMasterCategories = async (req, res) => {
  try {
    const categories = await MasterCategory.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Delete category
export const deleteMasterCategory = async (req, res) => {
  try {
    const category = await MasterCategory.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
};

// Get single category for editing
export const getSingleMasterCategory = async (req, res) => {
  try {
    const category = await MasterCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Update category
export const updateMasterCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await MasterCategory.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.name = name || category.name;
    category.image = image || category.image;

    await category.save();
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

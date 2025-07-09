import { MasterCategory } from "../models/masterCategory.js";
import subCategory from "../models/subCategory.js";

export const addSubCategory = async (req, res) => {
  try {
    const { name, masterCategory, image, description } = req.body;

    if (!name || !masterCategory) {
      return res
        .status(400)
        .json({ message: "Name and Master Category are required" });
    }

    const newSubCategory = new subCategory({
      name,
      masterCategory,
      image,
      description,
    });
    await newSubCategory.save();
    res
      .status(201)
      .json({ message: "Subcategory created", subCategory: newSubCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding subcategory", error: err.message });
  }
};

export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategory
      .find()
      .populate("masterCategory", "name")
      .sort({ createdAt: -1 });
    res.json({ subCategories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategories" });
  }
};

export const getSingleSubCategory = async (req, res) => {
  try {
    const SubCategory = await subCategory
      .findById(req.params.id)
      .populate("masterCategory", "name");
    if (!SubCategory)
      return res.status(404).json({ message: "Subcategory not found" });
    res.json(SubCategory);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategory" });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { name, masterCategory, image, description } = req.body;

    const updated = await subCategory.findByIdAndUpdate(
      req.params.id,
      { name, masterCategory, image, description },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Subcategory not found" });

    res.json({ message: "Subcategory updated", subCategory: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating subcategory" });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const deleted = await subCategory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Subcategory not found" });

    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subcategory" });
  }
};

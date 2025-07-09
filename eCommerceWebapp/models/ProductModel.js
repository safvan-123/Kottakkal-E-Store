// 📁 backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: Number,
    discountPrice: Number,
    stock: Number,
    sku: { type: String, unique: true },
    masterCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterCategory",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    imageUrl: String,
    imageUrl: {
      type: String,
      required: false, // or true if mandatory
    },
    sizes: [String],
    colors: [String],
    tags: [String],
    weight: Number,
    slug: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("product", productSchema);

import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    masterCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterCategory",
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);

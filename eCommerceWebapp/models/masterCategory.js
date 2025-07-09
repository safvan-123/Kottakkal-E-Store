import mongoose from "mongoose";

const masterCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MasterCategory = mongoose.model(
  "MasterCategory",
  masterCategorySchema
);

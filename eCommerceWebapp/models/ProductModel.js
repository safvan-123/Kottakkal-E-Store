import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", // if your category model name is 'category'
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },

    price: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Boolean,
    },
    colors: {
      type: [String],
      enum: ["red", "green", "white", "black", "blue"],
      default: [],
    },
    sizes: {
      type: [String],
      enum: ["s", "m", "l", "xl", "xxl"],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("product", productSchema);

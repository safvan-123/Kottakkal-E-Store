import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["order", "promo", "system", "return"],
      default: "order",
    },
    orderId: { type: String }, // Optional link to order
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);

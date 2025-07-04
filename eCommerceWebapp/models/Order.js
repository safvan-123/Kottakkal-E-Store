import mongoose from "mongoose";

export const returnRequestSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reason: { type: String, required: true },
    customNote: { type: String },
    requestedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  orderId: { type: Number, unique: true },
  items: [
    {
      product: Object,
      quantity: { type: Number, required: true, min: 1 },
      color: { type: String },
      size: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  offerPrice: Number,
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String, required: true },
  },
  isPaid: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
  },
  status: {
    type: String,
    enum: ["Order Confirmed", "Delivered", "Cancelled", "Pending"],
    default: "Order Confirmed",
  },
  returnRequests: [returnRequestSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);

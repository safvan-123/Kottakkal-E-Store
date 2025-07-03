import Order from "../models/Order.js";
import orderCounter from "../models/orderCounter.js";
import { razorpay } from "../utils/razorpay.js";
import { verifySignature } from "../utils/verifySignature.js";

// 1. Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      items,
      totalAmount,
      offerPrice,
      shippingAddress,
      paymentMethod,
      paymentInfo,
    } = req.body;

    let isPaid = false;

    if (paymentMethod === "ONLINE") {
      const isValid = verifySignature(paymentInfo);
      if (!isValid)
        return res.status(400).json({
          success: false,
          message: "Payment signature verification failed",
        });
      isPaid = true;
    }
    // Get the next orderId
    const getNextOrderId = async () => {
      const counter = await orderCounter.findOneAndUpdate(
        { name: "orderId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      return 1000 + counter.value; // start from 1001
    };
    const orderId = await getNextOrderId();

    const order = new Order({
      orderId,
      user: userId,
      items,
      totalAmount,
      offerPrice,
      shippingAddress,
      paymentMethod,
      isPaid,
      paymentInfo: paymentMethod === "ONLINE" ? paymentInfo : {},
    });

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "email name")
      .populate("items.product", "name price image");

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params; // order._id from MongoDB

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price image");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Error fetching single order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

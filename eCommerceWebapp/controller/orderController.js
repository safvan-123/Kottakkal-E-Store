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
    const userId = req.user._id; // from auth middleware

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price image");
    console.log(order);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Ensure order belongs to current user
    if (order.user._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to this order" });
    }
    const itemsWithReturns = order.items.map((item) => {
      const matchingReturn = order.returnRequests.find(
        (rr) => rr.productId.toString() === item.product._id.toString()
      );
      return {
        ...item.toObject(),
        returnRequest: matchingReturn || null, // add returnRequest or null
      };
    });

    // Return modified order object
    const modifiedOrder = {
      ...order.toObject(),
      items: itemsWithReturns,
    };
    res.status(200).json({ success: true, order: modifiedOrder });
  } catch (err) {
    console.error("Error fetching single order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleProductReturn = async (req, res) => {
  try {
    const { orderId, productId, reason, customNote } = req.body;
    console.log(orderId, productId, reason, customNote);

    if (!orderId || !productId || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Optional: Verify the user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized return attempt" });
    }

    // Optional: Check if order is within 7-day window
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    if (diffInDays > 7) {
      return res
        .status(400)
        .json({ success: false, message: "Return period expired." });
    }
    order.returnRequests.push({
      productId,
      reason,
      customNote,
      requestedAt: new Date(),
    });

    await order.save();
    // You could save this info in a new "returns" array or collection
    // For now, just log it or send success response
    console.log("📦 Return Requested:", {
      orderId,
      productId,
      reason,
      customNote,
    });

    res.status(200).json({
      success: true,
      message: "Return request received.",
    });
  } catch (error) {
    console.error("Return request failed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

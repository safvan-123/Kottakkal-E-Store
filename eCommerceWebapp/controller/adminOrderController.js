import Order from "../models/Order.js";
import "../models/ProductModel.js";
import "../models/userModel.js";

// GET all orders (admin view)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// PUT: Update order status and payment
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, isPaid } = req.body;
  console.log("✅ isPaid received in backend:", isPaid);
  console.log("✅ status received in backend:", status);

  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.isPaid = isPaid;

    if (typeof isPaid === "boolean") {
      order.isPaid = isPaid;
    }

    await order.save();

    res.status(200).json({ success: true, message: "Order updated", order });
  } catch (error) {
    console.error("❌ Failed to update order:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

export const getAllReturnRequests = async (req, res) => {
  try {
    const orders = await Order.find({ "returnRequests.0": { $exists: true } })
      .populate("user", "name email")
      .populate("user", "name email phone address")
      .populate("returnRequests.productId", "name price imageUrl");

    const allRequests = [];

    orders.forEach((order) => {
      order.returnRequests.forEach((r) => {
        allRequests.push({
          orderId: order.orderId,
          user: order.user,
          product: r.productId,
          reason: r.reason,
          customNote: r.customNote,
          createdAt: r.requestedAt,
        });
      });
    });
    console.log(allRequests);

    res.status(200).json({ success: true, requests: allRequests });
  } catch (err) {
    console.error("Error in getAllReturnRequests:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch return requests" });
  }
};

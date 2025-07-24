import notificationModel from "../models/notificationModel.js";
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

  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });
  }

  try {
    // const order = await Order.findById(id);
    const order = await Order.findById(id).populate("user", "_id name");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.isPaid = isPaid; // 👈 always reliable, and cannot be faked

    if (typeof isPaid === "boolean") {
      order.isPaid = isPaid;
    }
    let notificationMsg;
    if (status === "Order Confirmed") {
      notificationMsg = `✅ Your order ${order.orderId} has been Confirmed.`;
    } else if (status === "Delivered") {
      notificationMsg = `📦 Your order ${order.orderId} has been Delivered.`;
    }

    if (notificationMsg) {
      console.log(
        "Creating notification for user:",
        order.user._id,
        notificationMsg
      );
      await notificationModel.create({
        user: order.user._id,

        message: notificationMsg,
        type: "order",
        orderId: order.orderId,
      });
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
          orderMongoId: order._id,
          user: order.user,
          product: r.productId,
          reason: r.reason,
          customNote: r.customNote,
          isDelivered: r.isDelivered,
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

export const updateReturnDeliveryStatus = async (req, res) => {
  const { orderId, productId } = req.params;
  const { isDelivered } = req.body;

  try {
    const order = await Order.findById(orderId)
      .populate("user", "_id name")
      .populate("items.product", "name price _id imageUrl");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const returnItem = order.returnRequests.find(
      (r) => r.productId.toString() === productId
    );

    if (!returnItem) {
      return res
        .status(404)
        .json({ success: false, message: "Return item not found" });
    }

    returnItem.isDelivered = isDelivered;

    returnItem.deliveredAt = isDelivered ? new Date() : null;
    let notificationMsg;
    if (returnItem.isDelivered === true) {
      notificationMsg = `📦 Your return request of order ${order.orderId} has been Delivered.`;
    } else if (returnItem.isDelivered === false) {
      notificationMsg = `  Your return request of order ${order.orderId} has been Confirmed for delivery.✅ `;
    }

    if (notificationMsg) {
      console.log(
        "Creating notification for user:",
        order.user._id,
        notificationMsg
      );
      await notificationModel.create({
        user: order.user._id,

        message: notificationMsg,
        type: "order",
        orderId: order.orderId,
      });
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: "Return delivery status updated",
      returnItem,
    });
  } catch (err) {
    console.error("❌ Error updating return delivery status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

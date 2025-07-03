// export default MyOrdersPage;
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaBoxOpen,
  FaShippingFast,
  FaTruckMoving,
  FaCheckCircle,
  FaClipboardCheck,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// const STATUS_STEPS = [
//   { label: "Ordered", icon: <FaBoxOpen /> },
//   { label: "Shipped", icon: <FaShippingFast /> },
//   { label: "Out for Delivery", icon: <FaTruckMoving /> },
//   { label: "Delivered", icon: <FaCheckCircle /> },
// ];

const STATUS_STEPS = [
  { label: "Order Confirmed", icon: <FaClipboardCheck /> },
  { label: "Delivered", icon: <FaCheckCircle /> },
];
const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error("Failed to get orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [token]);

  const getStepIndex = (status) =>
    STATUS_STEPS.filter((step) => step.label === status);

  const handleViewOrder = (orderId) => {
    console.log(orderId);

    navigate(`/myorders/${orderId}`);
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          You haven’t placed any orders yet.
        </p>
      ) : (
        orders.map((order) => {
          console.log(order);

          const currentStep = getStepIndex(order.status || "Order Confirmed");
          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-100 gap-4">
                {/* Left: Order Info */}

                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order ID:</span>{" "}
                    <span className="text-blue-600">{order.orderId}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on:{" "}
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                {/* Right: View Order Button */}
                <div className="flex items-center justify-end sm:mr-4">
                  <button
                    onClick={() => handleViewOrder(order._id)}
                    className="group flex items-center gap-2 bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-full shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm"
                  >
                    <FaEye className="text-sm group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">View Order</span>
                  </button>
                </div>

                {/* Center: Payment Status + Amount */}
                <div className="text-sm sm:text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                  <p className="text-lg text-gray-800 font-bold mt-1">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="px-5 py-6">
                <div className="flex items-center justify-between max-w-xs sm:max-w-md mx-auto w-full relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white ${
                        currentStep[0]?.label == "Order Confirmed" ||
                        currentStep[0]?.label == "Delivered"
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <FaClipboardCheck />
                    </div>
                    <p
                      className={`mt-2 text-xs sm:text-sm text-center ${
                        currentStep[0]?.label == "Order Confirmed" ||
                        currentStep[0]?.label == "Delivered"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      Order Confirmed
                    </p>
                  </div>

                  {/* Connector Line */}
                  <div
                    className={`h-1 w-8 sm:w-12 mx-1 sm:mx-2 mt-[-20px] sm:mt-[-20px] ${
                      currentStep[0]?.label == "Delivered"
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                    style={{ borderRadius: "4px" }}
                  ></div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white ${
                        currentStep[0]?.label == "Delivered"
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <FaCheckCircle />
                    </div>
                    <p
                      className={`mt-2 text-xs sm:text-sm text-center ${
                        currentStep[0]?.label == "Delivered"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      Delivered
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="px-5 pb-5">
                <h3 className="text-md font-semibold text-gray-700 mb-4">
                  Products
                </h3>
                <ul className="space-y-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <img
                        src={item?.product?.image}
                        alt={item?.product?.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item?.product?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right text-gray-800 font-semibold">
                        ₹{item?.product?.price}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrdersPage;

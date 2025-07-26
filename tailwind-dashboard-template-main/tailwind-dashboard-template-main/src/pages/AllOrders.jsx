import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [paidStatus, setPaidStatus] = useState({});

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState("");
  console.log(selectedOrder);

  // Base URL for your API
  // ${import.meta.env.VITE_API_URL}
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;
  //  `http://localhost:5050/api`;

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      if (data.success) {
        setOrders(data.orders);
        const newPaidStatus = data.orders.reduce((acc, o) => {
          acc[o._id] = o.isPaid;
          return acc;
        }, {});
        setPaidStatus(newPaidStatus);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        "Server error while fetching orders. Please check your network or server."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status, isPaid) => {
    setStatusUpdating(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Sent status:", status, "Sent isPaid:", isPaid);

      await axios.put(
        `${API_BASE_URL}/orders/${orderId}`,
        { status, isPaid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      alert(`Order ${orderId.slice(-6)} updated successfully`);
      fetchOrders();
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      alert("Failed to update order. Please try again.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const statusOptions = ["Order Confirmed", "Delivered"];

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col lg:flex-row gap-6">
        {/* Left - Order Table */}
        <div
          className={
            selectedOrder
              ? "flex-1 overflow-x-auto lg:w-2/3"
              : "w-full overflow-x-auto"
          }
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            All Orders
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-md">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
                <th className="px-4 py-2">Order Id</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Paid</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-600 dark:text-gray-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`border-t dark:border-gray-700 cursor-pointer transition-colors duration-200
                      ${
                        selectedOrder?._id === order._id
                          ? "bg-gray-300 dark:bg-gray-700"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }
                    `}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-2">{order?.orderId}</td>
                    <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-2">
                      {formatPrice(order.offerPrice || order.totalAmount)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{order.paymentMethod}</td>
                    <td className="px-4 py-2">
                      {/* <span
                        className={`font-semibold ${
                          order.isPaid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {order.isPaid ? "Yes" : "No"}
                      </span> */}
                      <div className="flex items-center gap-2 mt-2 sm:mt-7">
                        <input
                          type="checkbox"
                          checked={paidStatus[order._id] ?? order.isPaid}
                          onChange={(e) => {
                            const isChecked = e.target.checked;

                            setPaidStatus((prev) => ({
                              ...prev,
                              [order._id]: isChecked,
                            }));

                            // Send with current order status
                            handleStatusChange(
                              order._id,
                              order.status,
                              isChecked
                            );
                          }}
                        />

                        <label
                          htmlFor="isPaid"
                          className="text-sm text-gray-700"
                        >
                          Payment Completed
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {order.createdAt
                        ? format(new Date(order.createdAt), "MMM dd, yyyy")
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right - Order Detail */}
        {selectedOrder && (
          <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-gray-700 rounded-md p-6 shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-600">
              Order Details (#
              <span className="font-mono">{selectedOrder._id.slice(-6)}</span>)
            </h3>
            <div className="text-sm text-gray-800 dark:text-gray-200 space-y-3 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
              <p>
                <strong>User:</strong> {selectedOrder.user?.name || "N/A"} (
                {selectedOrder.user?.email || "N/A"})
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {selectedOrder.createdAt
                  ? format(
                      new Date(selectedOrder.createdAt),
                      "MMM dd, yyyy hh:mm a"
                    )
                  : "N/A"}
              </p>
              <p>
                <strong>Total Amount:</strong>{" "}
                {formatPrice(
                  selectedOrder.offerPrice || selectedOrder.totalAmount
                )}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    selectedOrder.isPaid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                  {selectedOrder.status}
                </span>
              </p>

              <div className="mt-4 border-t pt-3 border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">
                  Shipping Address:
                </h4>
                <p>{selectedOrder.shippingAddress?.name || "N/A"}</p>
                <p>
                  {selectedOrder.shippingAddress?.address || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.landmark
                    ? `${selectedOrder.shippingAddress.landmark}, `
                    : ""}
                  {selectedOrder.shippingAddress?.city || "N/A"}
                </p>
                <p>
                  {selectedOrder.shippingAddress?.state || "N/A"} -{" "}
                  {selectedOrder.shippingAddress?.pincode || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedOrder.shippingAddress?.phone || "N/A"}
                </p>
              </div>

              <div className="mt-4 border-t pt-3 border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">
                  Items Ordered:
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <div
                        // combining product _id with size/color if product object is simple
                        key={`${item.product?._id || item._id}-${
                          item.size || ""
                        }-${item.color || ""}`}
                        className="flex items-center gap-3 bg-gray-100 dark:bg-gray-600 p-2 rounded-md shadow-sm"
                      >
                        <img
                          src={
                            item.product?.image ||
                            "https://placehold.co/50x50/e0e0e0/ffffff?text=No+Image"
                          } // Fallback image
                          alt={item.product?.name || "Product image"}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-xs">
                            Qty: {item.quantity} | {formatPrice(item.price)}{" "}
                            each
                          </p>
                          {/* Display Size and Color */}
                          {(item.size || item.color) && (
                            <p className="text-gray-600 dark:text-gray-300 text-xs">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ", "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      No items in this order.
                    </p>
                  )}
                </div>
              </div>

              {/* Update Status Dropdown */}
              <div className="mt-6 border-t pt-3 border-gray-200 dark:border-gray-600">
                <label
                  htmlFor="orderStatus"
                  className="block font-medium text-gray-900 dark:text-white mb-2"
                >
                  Update Order Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder._id,
                      e.target.value,
                      paidStatus[selectedOrder._id] ?? selectedOrder.isPaid
                    )
                  }
                  disabled={statusUpdating}
                  className="..."
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {statusUpdating && (
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
                    Updating status...
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;

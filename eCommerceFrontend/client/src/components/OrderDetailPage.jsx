import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaMoneyCheckAlt,
  FaUndoAlt,
} from "react-icons/fa";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

  // Return modal states
  const [showModal, setShowModal] = useState(false);
  const [returnItem, setReturnItem] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (!token || !id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          ` ${import.meta.env.VITE_API_URL}/api/orders/my-orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        const data = await res.json();
        if (data.success) setOrder(data.order);
        else toast.error("Failed to fetch order details.");
      } catch (err) {
        toast.error(`Error fetching order , ${err}`);
      }
    };

    fetchOrder();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, token]);
  useEffect(() => {
    if (showModal) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showModal]);
  console.log(order);

  // Handle return submission
  const handleReturnSubmit = async () => {
    if (!selectedReason) {
      toast.warning("Please select a return reason.");
      return;
    }
    // ${import.meta.env.VITE_API_URL}
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify({
            orderId: order._id,
            productId: returnItem?.product?._id,
            reason: selectedReason,
            customNote: customReason,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Return request submitted.");
        setShowModal(false);
        setSelectedReason("");
        setCustomReason("");
      } else {
        toast.error(data.message || "Return failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const isReturnEligible = (createdAt) => {
    const orderDate = new Date(createdAt);
    const now = new Date();
    const diff = (now - orderDate) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  if (!order) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 sm:p-5 shadow-lg text-white mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Order #{order.orderId}
            </h2>
            <p className="text-xs sm:text-sm opacity-90">
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

          <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "Delivered"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {order.status === "Delivered" ? <FaCheckCircle /> : <FaClock />}
              {order.status}
            </span>

            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                order.isPaid
                  ? "bg-emerald-200 text-emerald-800"
                  : "bg-rose-200 text-rose-800"
              }`}
            >
              <FaMoneyCheckAlt />
              {order.isPaid ? "Paid" : "Payment Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Items in this order
        </h3>
        <ul className="space-y-5">
          {order.items.map((item, idx) => {
            const isReturned = item?.returnRequest;
            console.log(isReturned);

            return (
              <li
                key={idx}
                className="flex items-center justify-between gap-4 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item?.product?.image}
                    alt={item?.product?.name}
                    className="w-16 h-16 rounded-lg object-cover shadow-sm"
                  />
                  <div>
                    <p className="text-gray-800 font-medium text-sm">
                      {item?.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-700 font-semibold text-sm mr-2">
                    ₹{item?.product?.price}
                  </p>
                  {/* {isReturnEligible(order.createdAt) && (
                    <button
                      onClick={() => {
                        setReturnItem(item);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center gap-2 px-2 py-1 mt-2 ml-2 rounded-full bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 transition"
                    >
                      <FaUndoAlt className="text-sm" />
                      Return
                    </button>
                  )} */}
                  {isReturnEligible(order.createdAt) &&
                    (item.returnRequest ? (
                      <div className="mt-2 ml-2">
                        <button
                          disabled
                          className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 mt-2 ml-2 rounded-full bg-green-100 text-green-700 text-[11px] sm:text-xs font-semibold cursor-not-allowed border border-green-300 shadow-sm"
                        >
                          <FaBoxOpen className="text-sm" />
                          <span className="tracking-wide">
                            Pickup Scheduled
                          </span>
                        </button>

                        {(() => {
                          const requestTime = new Date(
                            item.returnRequest.requestedAt
                          );
                          const now = new Date();
                          const diffInMs = now - requestTime;
                          const diffInHours = diffInMs / (1000 * 60 * 60);

                          if (diffInHours <= 24) {
                            return (
                              <p className="text-[11px] text-gray-500 mt-1">
                                The product will be picked up within 24 hours.
                              </p>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReturnItem(item);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-2 py-1 mt-2 ml-2 rounded-full bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 transition"
                      >
                        <FaUndoAlt className="text-sm" />
                        Return
                      </button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Total */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-800">
          Total Amount:{" "}
          <span className="text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
        </p>
      </div>

      {/* Return Modal */}
      {showModal && returnItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md mx-4 sm:mx-0 p-6 rounded-2xl shadow-2xl animate-slide-down transition-all duration-300">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Return Request: {returnItem.product.name}
            </h2>

            <div className="space-y-3 mb-4">
              {[
                "Item is damaged",
                "Wrong product received",
                "Quality not as expected",
                "Ordered by mistake",
                "Other",
              ].map((reason, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason && (
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                placeholder="Additional reason (optional)"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnSubmit}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;

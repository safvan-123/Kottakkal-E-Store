import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const OrderDetailsPage = () => {
  const { id } = useParams(); // Get order ID from URL

  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  console.log(order);

  useEffect(() => {
    if (!token || !id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        console.log(data);

        if (data.success) {
          setOrder(data.order);
        } else {
          toast.error("Failed to fetch order details.");
        }
      } catch (err) {
        toast.error("Error fetching order.");
      }
    };

    fetchOrder();
  }, [id, token]);

  if (!order) {
    return <p className="text-center text-gray-500 mt-20">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Order Details - <span className="text-blue-600">{order.orderId}</span>
      </h2>

      <p className="text-sm text-gray-500 mb-1">
        Placed on: {new Date(order.createdAt).toLocaleString()}
      </p>

      <p className="text-sm mb-4">
        Status:{" "}
        <span
          className={`px-2 py-1 rounded-full text-white text-xs ${
            order.status === "Delivered" ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {order.status}
        </span>
      </p>

      <h3 className="text-lg font-semibold mb-2">Products:</h3>
      <ul className="space-y-4">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-4 border-b pb-4">
            <img
              src={item?.product?.image}
              alt={item?.product?.name}
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div className="flex-1">
              <p className="font-medium">{item?.product?.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <div className="font-semibold">₹{item?.product?.price}</div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold text-gray-800">
          Total: ₹{order.totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaCheckCircle, FaClock, FaMoneyCheckAlt } from "react-icons/fa";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);

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
        if (data.success) setOrder(data.order);
        else toast.error("Failed to fetch order details.");
      } catch (err) {
        toast.error("Error fetching order.");
      }
    };

    fetchOrder();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, token]);

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

      {/* Items Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Items in this order
        </h3>
        <ul className="space-y-5">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4"
            >
              <img
                src={item?.product?.image}
                alt={item?.product?.name}
                className="w-16 h-16 rounded-lg object-cover shadow-sm"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium text-sm">
                  {item?.product?.name}
                </p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right font-semibold text-blue-700">
                ₹{item?.product?.price}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-800">
          Total Amount:{" "}
          <span className="text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import { FaCheckCircle, FaClock } from "react-icons/fa";

// const OrderDetailsPage = () => {
//   const { id } = useParams();
//   const { token } = useContext(AuthContext);
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     if (!token || !id) return;

//     const fetchOrder = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/orders/my-orders/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = await res.json();
//         if (data.success) setOrder(data.order);
//         else toast.error("Failed to fetch order details.");
//       } catch (err) {
//         toast.error("Error fetching order.");
//       }
//     };

//     fetchOrder();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [id, token]);

//   if (!order) {
//     return <p className="text-center text-gray-500 mt-20">Loading...</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
//       {/* Header with smaller height */}
//       <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 sm:p-5 shadow-lg text-white mb-6">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold">
//               Order #{order.orderId}
//             </h2>
//             <p className="text-xs sm:text-sm opacity-90">
//               Placed on:{" "}
//               {new Date(order.createdAt).toLocaleString("en-US", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true,
//               })}
//             </p>
//           </div>
//           <div className="mt-1 sm:mt-0">
//             <span
//               className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
//                 order.status === "Delivered"
//                   ? "bg-green-200 text-green-800"
//                   : "bg-yellow-200 text-yellow-800"
//               }`}
//             >
//               {order.status === "Delivered" ? <FaCheckCircle /> : <FaClock />}
//               {order.status}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Items Section */}
//       <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-slide-up">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">
//           Items in this order
//         </h3>
//         <ul className="space-y-5">
//           {order.items.map((item, idx) => (
//             <li
//               key={idx}
//               className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-4"
//             >
//               <img
//                 src={item?.product?.image}
//                 alt={item?.product?.name}
//                 className="w-16 h-16 rounded-lg object-cover shadow-sm"
//               />
//               <div className="flex-1">
//                 <p className="text-gray-800 font-medium text-sm">
//                   {item?.product?.name}
//                 </p>
//                 <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//               </div>
//               <div className="text-right font-semibold text-blue-700">
//                 ₹{item?.product?.price}
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Total */}
//       <div className="text-right">
//         <p className="text-lg font-bold text-gray-800">
//           Total Amount:{" "}
//           <span className="text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsPage;

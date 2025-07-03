// import React, { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import {
//   FaBoxOpen,
//   FaShippingFast,
//   FaTruckMoving,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { toast } from "react-toastify";

// const STATUS_STEPS = [
//   { label: "Ordered", icon: <FaBoxOpen /> },
//   { label: "Shipped", icon: <FaShippingFast /> },
//   { label: "Out for Delivery", icon: <FaTruckMoving /> },
//   { label: "Delivered", icon: <FaCheckCircle /> },
// ];

// const MyOrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const { token } = useContext(AuthContext);

//   useEffect(() => {
//     if (!token) return;

//     const fetchOrders = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await res.json();
//         if (data.success) {
//           setOrders(data.orders);
//         } else {
//           toast.error("Failed to get orders.");
//         }
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//       }
//     };

//     fetchOrders();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [token]);

//   const getStepIndex = (status) =>
//     STATUS_STEPS.findIndex((step) => step.label === status);

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//       <h1 className="text-4xl font-bold mb-10 text-gray-800">My Orders</h1>

//       {orders.length === 0 ? (
//         <p className="text-center text-gray-500 text-lg mt-20">
//           You haven’t placed any orders yet.
//         </p>
//       ) : (
//         orders.map((order) => {
//           console.log(order);

//           const currentStep = getStepIndex(order.status || "Ordered");

//           return (
//             <div
//               key={order.orderId}
//               className="bg-white shadow-md rounded-2xl mb-12 border border-gray-100 overflow-hidden"
//             >
//               {/* Order Header */}
//               <div className="flex justify-between flex-wrap gap-4 px-6 py-4 border-b border-gray-200">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Order ID:{" "}
//                     <span className="text-blue-600">{order.orderId}</span>
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Placed on:Placed on:{" "}
//                     {new Date(order.createdAt).toLocaleString("en-US", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                       hour: "numeric",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <div
//                     className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
//                       order.isPaid
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {order.isPaid ? "Payment Completed" : "Pending Payment"}
//                   </div>
//                   <div className="mt-1 font-semibold text-gray-800">
//                     ₹{order.totalAmount}
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Progress Timeline */}
//               <div className="px-6 py-5 border-b border-gray-200">
//                 <div className="flex items-center justify-between relative">
//                   {STATUS_STEPS.map((step, idx) => {
//                     const isActive = idx <= currentStep;

//                     return (
//                       <div
//                         key={step.label}
//                         className="flex flex-col items-center text-center flex-1 relative"
//                       >
//                         <div
//                           className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10 ${
//                             isActive ? "bg-blue-600" : "bg-gray-300"
//                           }`}
//                         >
//                           {step.icon}
//                         </div>
//                         <p
//                           className={`mt-2 text-sm ${
//                             isActive
//                               ? "text-blue-600 font-medium"
//                               : "text-gray-400"
//                           }`}
//                         >
//                           {step.label}
//                         </p>

//                         {idx < STATUS_STEPS.length - 1 && (
//                           <div
//                             className={`absolute top-5 left-1/2 w-full h-1 z-0 ${
//                               currentStep >= idx + 1
//                                 ? "bg-blue-600"
//                                 : "bg-gray-300"
//                             }`}
//                             style={{
//                               left: "50%",
//                               width: "100%",
//                               transform: "translateX(50%)",
//                             }}
//                           ></div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Products */}
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                   Products in this Order
//                 </h3>
//                 <ul className="divide-y divide-gray-100">
//                   {order.items.map((item, idx) => (
//                     <li
//                       key={idx}
//                       className="flex items-center justify-between py-4 gap-4"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div>
//                           <img
//                             src={item?.product?.image}
//                             alt=""
//                             style={{ width: "60px", height: "60px" }}
//                           />
//                           <p className="text-gray-900 font-medium">
//                             {item.product.name}
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">
//                             Quantity: {item.quantity}
//                           </p>
//                         </div>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-800">
//                         ₹{item.product.price}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default MyOrdersPage;
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaBoxOpen,
  FaShippingFast,
  FaTruckMoving,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const STATUS_STEPS = [
  { label: "Ordered", icon: <FaBoxOpen /> },
  { label: "Shipped", icon: <FaShippingFast /> },
  { label: "Out for Delivery", icon: <FaTruckMoving /> },
  { label: "Delivered", icon: <FaCheckCircle /> },
];

const MyOrdersPage = () => {
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
    STATUS_STEPS.findIndex((step) => step.label === status);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          You haven’t placed any orders yet.
        </p>
      ) : (
        orders.map((order) => {
          const currentStep = getStepIndex(order.status || "Ordered");

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 mb-8"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between p-5 border-b border-gray-100 gap-4">
                <div>
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

              {/* Timeline */}
              {/* <div className="px-5 py-6">
                <div className="relative flex justify-between items-center sm:gap-4">
                  {STATUS_STEPS.map((step, index) => {
                    const isActive = index <= currentStep;
                    return (
                      <div
                        key={step.label}
                        className="flex flex-col items-center text-center flex-1 relative"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 text-white shadow-md ${
                            isActive ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p
                          className={`mt-2 text-xs ${
                            isActive
                              ? "text-blue-600 font-semibold"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>

                       
                        {index < STATUS_STEPS.length - 1 && (
                          <div
                            className={`absolute top-5 left-1/2 w-full h-1 z-0 ${
                              currentStep >= index + 1
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                            style={{
                              left: "50%",
                              width: "100%",
                              transform: "translateX(50%)",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div> */}

              {/* Timeline */}
              <div className="px-5 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative">
                  {STATUS_STEPS.map((step, index) => {
                    const isActive = index <= currentStep;
                    return (
                      <div
                        key={step.label}
                        className="flex flex-col items-center relative"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${
                            isActive ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p
                          className={`mt-2 text-sm text-center ${
                            isActive
                              ? "text-blue-600 font-semibold"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>

                        {/* Horizontal connector line only for sm and up */}
                        {index < STATUS_STEPS.length - 1 && (
                          <div
                            className={`hidden sm:block absolute top-5 left-1/2 w-full h-1 transform -translate-x-1/2 z-0 ${
                              currentStep >= index + 1
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Products */}
              <div className="p-5">
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

import { CheckCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import DownloadInvoiceButton from "../components/DownloadInvoiceButton";
import axios from "axios";
import "jspdf-autotable";
import logo from "../assets/DeliveryImage.avif";
import { generateInvoicePdf } from "../components/GenerateInvoicePdf";

export default function OrderSuccessPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!token) return;

    const sendOrderEmail = async (order, userEmail) => {
      try {
        if (!order || !order.items?.length) return;
        const lastEmailedOrderId = localStorage.getItem("lastEmailedOrderId");

        if (lastEmailedOrderId == order?.orderId) {
          console.log("Email already sent for this order.");
          return;
        }
        const pdfBase64 = await generateInvoicePdf(order, logo, {
          save: false,
        });

        if (!pdfBase64) {
          console.error("Failed to generate PDF.");
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/email`,
          {
            to: userEmail,
            order: {
              _id: order.orderId,
              items: order.items,
              total: order.totalAmount,
              deliveryAddress: order?.shippingAddress,
            },
            invoice: pdfBase64, // ✅ this is the actual string now
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        console.log("✅ Email sent:", res.data);
        if (location.pathname !== "/ordersuccess") {
          toast.info("Your cart has been cleared.");
        }
        localStorage.setItem("lastEmailedOrderId", order.orderId);
        return res.data;
      } catch (err) {
        console.error("❌ Email error:", err);
      }
    };

    const fetchAndSendEmail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
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
        if (data.success) {
          setOrders(data.orders);
          if (data.orders.length > 0) {
            const latestOrder = data.orders[0];
            setLastOrder(latestOrder);
            await sendOrderEmail(latestOrder, user.email); // ✅ now this is inside async function
          }
        } else {
          toast.error("Failed to get orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchAndSendEmail(); // call inner async function
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white px-4 py-6 text-gray-800">
      {/* Animated Card Wrapper */}
      <div className="border border-green-300 bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 sm:w-20 h-16 sm:h-20 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Thank you for your purchase!
        </h1>
        <p className="text-sm sm:text-base text-center mt-2 text-gray-600">
          Your order has been placed successfully.
        </p>

        {/* Order Summary */}
        <div className="mt-6 space-y-2 text-sm sm:text-base">
          <h2 className="text-base sm:text-lg font-semibold border-b pb-2">
            Order Summary
          </h2>
          <p>
            <span className="font-medium">Order ID:</span> {lastOrder?.orderId}
          </p>
          <p>
            <span className="font-medium">Items:</span>{" "}
            {lastOrder?.items
              ?.map((item) => item.product?.name)
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="font-bold">
            <span className="font-medium">Total Price:</span> ₹
            {lastOrder?.totalAmount}
          </p>
          <p>
            <span className="font-medium">Delivery Address:</span>{" "}
            {lastOrder?.shippingAddress?.address}
          </p>
          <p>
            <span className="font-medium">Payment Mode:</span>{" "}
            {lastOrder?.paymentMethod}
          </p>
        </div>

        {/* Buttons: Same row on mobile too */}
        <div className="flex flex-row flex-wrap justify-center gap-3 mt-6">
          <a
            href="/"
            className="bg-green-500 text-white text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow hover:bg-green-600 transition"
          >
            Go to Home
          </a>
          <a
            href="/myorders"
            onClick={() => navigate("/myorders")}
            className="border border-green-500 text-green-600 text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-green-50 transition"
          >
            View Orders
          </a>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-4 w-full max-w-md px-2 flex justify-center items-center">
        <DownloadInvoiceButton order={lastOrder} />
      </div>
    </div>
  );
}

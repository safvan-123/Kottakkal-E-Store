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
  // const [emailSent, setEmailSent] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  console.log(lastOrder);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // if (!token || emailSent) return;

    const sendOrderEmail = async (order, userEmail) => {
      try {
        if (!order || !order.items?.length) return;

        const pdfBase64 = await generateInvoicePdf(order, logo, {
          save: false,
        });

        if (!pdfBase64) {
          console.error("Failed to generate PDF.");
          return;
        }

        const res = await axios.post(
          `http://localhost:5050/api/email`,
          {
            to: userEmail,
            order: {
              _id: order._id,
              items: order.items,
              total: order.totalAmount,
              deliveryAddress: order?.shippingAddress,
            },
            invoice: pdfBase64, // ✅ this is the actual string now
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Email sent:", res.data);
        setEmailSent(true);
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
      <div className="border border-green-300 bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">
          Thank you for your purchase!
        </h1>
        <p className="text-base text-center mt-2 text-gray-600">
          Your order has been placed successfully.
        </p>

        {/* Order Summary */}
        <div className="mt-6 space-y-2 text-sm">
          <h2 className="text-lg font-semibold border-b pb-2">Order Summary</h2>
          {/* <p>
            <span className="font-medium">Order ID:</span> #123456
          </p> */}
          {/* <p>
            <span className="font-medium">Items:</span>{" "}
            {lastOrder?.items?.map((item) => item.product.name)}
          </p> */}
          <p>
            <span className="font-medium">Items:</span>{" "}
            {lastOrder?.items
              ?.map((item) => item.product?.name)
              .filter(Boolean) // ensures no undefined names
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

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <a
            href="/"
            className="bg-green-500 text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition"
          >
            Go to Home
          </a>
          <a
            href="/myorders"
            onClick={() => navigate("/myorders")}
            className="border border-green-500 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition"
          >
            View Orders
          </a>
        </div>
      </div>
      <DownloadInvoiceButton order={lastOrder} />
    </div>
  );
}
